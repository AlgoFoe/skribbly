import { useNavigate, useParams } from "react-router-dom";
import DrawingCanvas, { pusher } from "../../components/DrawingCanvas";
import Sidebar from "../../components/Sidebar";
import { useEffect, useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import Options from "../../components/Options";
import Finished from "../../components/Finished";
import WaitingRoom from "../../components/WaitingRoom";
import { generate } from "random-words";
import Chat from "../../components/Chat";
import toast from "react-hot-toast";
import { usePlayContext } from "../../context/PlayContext";

interface User {
  rank: number;
  username: string;
  points: number;
  colorXY: [number, number];
  mouthXY: [number, number];
  eyesXY: [number, number];
}

const Play = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const { authUser } = useAuthContext();

  const [gameStarted, setGameStarted] = useState<boolean>(false);

  const [members, setMembers] = useState<User[]>([]);
  const { currentUserDrawing, setCurrentUserDrawing } = usePlayContext();
  const [currRound, setCurrRound] = useState<number>(1);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [revealedWord, setRevealedWord] = useState<string[]>([]);
  const [timer, setTimer] = useState(0);
  const [wordOptions, setWordOptions] = useState<string[]>(generate(3) as string[]);
  const {setCorrectGuessers} = usePlayContext()
  const [sortedMembers, setSortedMembers] = useState<User[]>([]);
  // console.log("currUserDrawingNum at line 19 in play.tsx: ", currUserDrawingNum);

  // console.log(currUserDrawingNum)

  const setPlayers = (data: any) => {
    setMembers(data.players);
    // console.log("members.length from setPlayers : ",members)
  };

  const chosenWord = (data: any) => {
    console.log("chosenWord: ", data);
    setCorrectGuessers(new Set())
    setSelectedWord(data.word);
    setRevealedWord(new Array(data.word.length).fill("_"));
    setTimer(60)
  };

  const updateScore = (data: any) => {
    // console.log("update members ", members);

    setMembers((prevMembers) => {
      const updatedMembers = prevMembers.map((member) => {
        if (member.username === data.username) {
          return { ...member, points: (member.points || 0) + data.score };
        }
        return member;
      });
      // console.log("numMembersGuessedWord : ", data.numMembersGuessedWord);
      // console.log("Updated members length : ", updatedMembers.length);

      if (data.numMembersGuessedWord === updatedMembers.length - 1) {
        console.log("HEYY BITCH")
        console.log("updating timer");
        setSelectedWord(null)
        setTimer(0);
      }

      return updatedMembers;
    });
  };
  const startGame = (data: any) => {
    console.log("DATA", data.membersLen);
    console.log("user drawing Index", currentUserDrawing);
    if (data.membersLen <= 1) {
      toast.error("How will you play alone?");
      return;
    } else {
      const words = generate(3);
      setWordOptions([...words]);
      setGameStarted(true);
      console.log(data.msg);
    }
  };

  useEffect(() => {
    console.log(gameStarted);
    if (!roomId) return;

    const channel = pusher.subscribe(roomId);
    channel.bind("set-players", setPlayers);
    channel.bind("word-chosen", chosenWord);
    channel.bind("update-score", updateScore);
    channel.bind("start-game", startGame);

    return () => {
      channel.unbind("start-game", startGame);
      channel.unbind("word-chosen", chosenWord);
      channel.unbind("set-players", setPlayers);
      channel.unbind("update-score", updateScore);
      pusher.unsubscribe(roomId);
    };
  }, [roomId]);

  useEffect(() => {
    const leaveRoom = async () => {
      await fetch(`/api/room/leave`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId,
          user: authUser,
        }),
      });

      if (members.length === 1) {
        await deleteRoom();
      }
    };

    const deleteRoom = async () => {
      await fetch("/api/room/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId }),
      });
    };

    const checkRoomValidity = async () => {
      const res = await fetch("/api/room/valid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId }),
      });
      const data = await res.json();
      return data;
    };

    checkRoomValidity().then(async (res) => {
      if (!res.valid) {
        navigate("/");
      } else {
        const room = await fetch(`/api/room/join`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            roomId,
            user: {
              username: authUser?.username,
              colorXY: authUser?.colorXY,
              eyesXY: authUser?.eyesXY,
              mouthXY: authUser?.mouthXY,
            },
          }),
        });

        if (!room) {
          navigate("/");
        }
      }
    });

    window.addEventListener("beforeunload", leaveRoom);
    return () => window.removeEventListener("beforeunload", leaveRoom);
  }, []);

  const handleWordSelected = async (word: string) => {
    await fetch("/api/room/wordChosen", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomId, chosenWord: word }),
    });
  };

  useEffect(() => {
    if (!selectedWord) return;

    const revealCharacter = () => {
      setRevealedWord((prev) => {
        const unrevealedIndexes = prev
          .map((char, index) => (char === "_" ? index : null))
          .filter((index) => index !== null) as number[];

        if (
          (selectedWord.length <= 3 && unrevealedIndexes.length <= 1) ||
          (selectedWord.length <= 5 && unrevealedIndexes.length <= 3) ||
          (selectedWord.length > 5 && unrevealedIndexes.length <= 6)
        ) {
          return prev;
        }

        const randomIndex =
          unrevealedIndexes[
          Math.floor(Math.random() * unrevealedIndexes.length)
          ];

        prev[randomIndex] = selectedWord[randomIndex];
        return [...prev];
      });
    };

    const interval = setInterval(revealCharacter, 1000);
    return () => clearInterval(interval);
  }, [selectedWord]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (selectedWord) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer > 0) {
            return prevTimer - 1;
          } else {
            // userDrawing();
            clearInterval(interval);
            return 0;
          }
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [selectedWord]);

  useEffect(() => {
    if (currRound <= 3 && timer === 0 && gameStarted) {
      userDrawing()
      newWords()
    }
  }, [timer])

  const newWords = () => {
    const words = generate(3)
    setWordOptions([...words])
    setSelectedWord(null)
    console.log("currUserDrawingNum from newWords() : ", currentUserDrawing)
    // return (
    //   <Options words={words} onWordSelected={handleWordSelected} userDrawingUsername={members[currUserDrawingNum - 1]?.username} />
    // )
  }

  const userDrawing = async () => {
  setSelectedWord(null)
    const res = await fetch("/api/room/userDrawing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomId }),
    });
    const data = await res.json();
    // setCurrentUserDrawing(2);
    setCurrentUserDrawing(data.currentUserDrawing);
    console.log("user-draw", currentUserDrawing);
    setCurrRound(data.round);

    console.log("TIMER END : ", data);
  };
  useEffect(() => {
    if (members.some(member => member.points !== undefined)) {
      console.log("INSIDE");
      setSortedMembers([...members].sort((a, b) => (b.points || 0) - (a.points || 0)));
    }else{
      console.log("OUT");
    }
    console.log("FINAL", sortedMembers);
  }, [members]);
  
  return (
    <div className="relative flex flex-col h-screen">
      {!gameStarted && <WaitingRoom members={members} roomLink={`${roomId}`} />}
      {gameStarted && (
        <>

          <div className="z-50">
            {!selectedWord && currRound<=3 && (
              <Options words={wordOptions} onWordSelected={handleWordSelected} userDrawingUsername={members[currentUserDrawing - 1]?.username} />
            )}
          </div>
          <div
            className={`flex gap-2 items-center p-2 bg-blue-600 text-white w-full lg:w-screen ${
              !selectedWord ? "opacity-50" : ""
            }`}
          >
            <div
              className="h-10 w-10 flex justify-center items-center"
              style={{
                backgroundSize: "115%",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundImage: "url('/img/clock.gif')",
              }}
            >
              <span className={"text-black font-extrabold"}
              >
                {timer}
              </span>
            </div>
            <div>{`Round ${currRound<=3?currRound:3} of 3`}</div>
            {members[currentUserDrawing - 1]?.username !== authUser?.username ?(
              <div className="ml-[550px] -mt-1">
                <span className="text-gray-400 font-bold text-lg">
                  Guess This:
                </span>
                {!selectedWord ? (
                  <span className="text-orange-500 text-lg font-bold flex items-center justify-center ">
                    None
                  </span>
                ) : (
                  <span className="flex justify-center items-center text-red-400 font-bold text-lg -ml-3">
                    {revealedWord.map((char, index) =>
                      char === "_" ? (
                        <span
                          key={index}
                          style={{
                            fontWeight: "bold",
                            fontSize: "1.5rem",
                            marginRight: "0.1rem",
                          }}
                        >
                          {char}
                        </span>
                      ) : (
                        <span key={index} style={{ marginRight: "0.1rem" }}>
                          {char}
                        </span>
                      )
                    )}
                  </span>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center text-center w-4/5">
                <div>
                  <span
                    className="text-center font-bold text-2xl"
                    style={{ letterSpacing: "4px" }}
                  >
                    {selectedWord}
                  </span>
                </div>
              </div>
            )}
          </div>
          <div
            className={`flex flex-grow ${!selectedWord ? "opacity-50" : ""}`}
          >
            <div className="flex-none bg-blue-200 p-4 w-1/4">
              <Sidebar roomId={roomId!} users={members} />
            </div>
            <div className="flex flex-col lg:flex-row flex-grow bg-gray-100">
              <div className="flex-grow flex justify-center bg-white w-full">
                <DrawingCanvas
                  roomId={roomId!}
                  isDrawingEnabled={!!selectedWord}
                  currentUserDrawingBool={
                    members[currentUserDrawing - 1]?.username ===
                    authUser?.username
                  }
                />
              </div>
              <div className="lg:flex-grow p-2 lg:m-0 m-2 rounded-b-md overflow-auto flex flex-col lg:h-full h-[250px] w-1/2 lg:w-1/2">
                <Chat roomId={roomId!} selectedWord={selectedWord || ""} />
              </div>
            </div>
          </div>
          {timer === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
              {currRound > 3 && <Finished
              winner={sortedMembers[0]?.username}
              secondPlace={sortedMembers[1]?.username}
              thirdPlace={sortedMembers[2]?.username}
              winnerPoints={sortedMembers[0]?.points}
              secondPlacePoints={sortedMembers[1]?.points}
              thirdPlacePoints={sortedMembers[2]?.points}
            />}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Play;
