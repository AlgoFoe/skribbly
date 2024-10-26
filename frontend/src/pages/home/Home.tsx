import { nanoid } from "nanoid";
import Avatar from "../../components/Avatar";
import { useAuthContext } from "../../context/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { authUser } = useAuthContext();
  const [joinRoomId, setJoinRoomId] = useState<string>("");
  const navigate = useNavigate();

  const joinRoom = async () => {
    if (joinRoomId.trim() !== "") {
      navigate(`/play/${joinRoomId}`);
    }
  };

  const createRoom = async () => {
    const roomId = nanoid(10);
    await fetch(`/api/room/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roomId: roomId,
      }),
    });
    navigate(`/play/${roomId}`);
  };

  const joinRandomRoom = async () => {
    const res = await fetch(`/api/room/random`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const { roomFound, room } = await res.json();
    if (roomFound) {
      navigate(`/play/${room[0].roomId}`);
    }
  };

  const pasteFromClipboard = async () => {
    const text = await navigator.clipboard.readText();
    setJoinRoomId(text);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-red-300 w-[350px] h-[40%] p-3 rounded-lg flex flex-col items-center justify-center sm:min-h-[60%] sm:min-w-[35rem] md:min-h-[70%]">
        <div className="w-full h-36 my-auto flex items-center justify-center">
          <Avatar
            arrows
            colorXY={authUser?.colorXY}
            eyesXY={authUser?.eyesXY}
            mouthXY={authUser?.mouthXY}
          />
        </div>
        <button
          className="btn btn-block bg-green-500 hover:bg-green-600 border-none mb-2"
          onClick={joinRandomRoom}
        >
          <span className="text-2xl text-white drop-shadow-md">PLAY!</span>
        </button>
        <div className="join mb-2 w-full flex">
          <input
            className="input grow input-bordered join-item"
            placeholder="Enter room code or paste link"
            value={joinRoomId}
            onInput={(e) => {
              setJoinRoomId(e.currentTarget.value);
            }}
          />
          <button
            className="btn join-item w-16"
            onClick={pasteFromClipboard}
          >
            Paste
          </button>
          <button className="btn join-item rounded-r-lg" onClick={joinRoom}>
            Join
          </button>
        </div>
        <button className="btn btn-block btn-info" onClick={createRoom}>
          <span className="text-lg text-white drop-shadow-md">Create Private Room</span>
        </button>
      </div>
    </div>
  );
};

export default Home;
