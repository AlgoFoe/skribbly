  import { useEffect, useState } from "react";
  import { pusher } from "./DrawingCanvas";
  import { useAuthContext } from "../context/AuthContext";
  import toast from "react-hot-toast";
import { usePlayContext } from "../context/PlayContext";

  const Chat = ({
    roomId,
    selectedWord,
  }: {
    roomId: string;
    selectedWord: string;
  }) => {
    const [newMessage, setNewMessage] = useState<string>("");
    const [messages, setMessages] = useState<
      { sender: string; text: string; isCorrect: boolean }[]
    >([]);
    const { authUser } = useAuthContext();
    const {correctGuessers,setCorrectGuessers} = usePlayContext();

    useEffect(() => {
      pusher.subscribe(roomId);
      return () => {
        pusher.unsubscribe(roomId);
      };
    }, [roomId]);

    useEffect(() => {
      const fun = (data: any) => {
        setMessages((prev) => [...prev, { ...data }]);
      };
      pusher.bind("sendMessage", fun);

      return () => {
        pusher.unbind("sendMessage", fun);
      };
    }, []);

    const sendMessage = async () => {
      const isCorrect = newMessage.toLowerCase() === selectedWord.toLowerCase();
      const messageText = isCorrect
        ? `guessed the word`
        : newMessage;

      if (isCorrect) {
        
        await fetch(`/api/room/updateScore`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: authUser?.username,
            roomId: roomId,
            score: 10
          }),
        });

        if (correctGuessers.has(authUser?.username || "")) {
          setNewMessage("");
          toast.success('You got it', {
            position: "top-center"
          })
          console.log("correctGuessers");
          return;
        } else {
          setCorrectGuessers((prev) => new Set(prev).add(authUser?.username || ""));
        }
      }
      await fetch(`/api/message/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: authUser?.username,
          text: messageText,
          roomId: roomId,
          isCorrect
        }),
      });

      setNewMessage("");
    };

    return (
      <>
        <div className="flex-grow overflow-auto lg:bg-white">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-2 p-2 shadow ${message.text.includes("guessed the word") ? "bg-green-200" : "bg-white"
                }`}
            >
              {`${message.sender}: ${message.text}`}
            </div>
          ))}
        </div>
        <div className="join mb-2 w-full">
          <input
            className="input grow join-item"
            placeholder="Send Message"
            value={newMessage}
            onInput={(e) => setNewMessage(e.currentTarget.value)}
          />
          <button
            className="btn join-item rounded-r-lg"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </>
    );
  };

  export default Chat;
