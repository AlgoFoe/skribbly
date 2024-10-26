import React from "react";
import Avatar from "./Avatar";
import Confetti from "react-confetti";

interface FinishedProps {
  winner: string;
  secondPlace: string;
  thirdPlace: string;
  winnerPoints: number;
  secondPlacePoints: number;
  thirdPlacePoints: number;
}
const Finished: React.FC<FinishedProps> = ({
  winner,
  secondPlace,
  thirdPlace,
  winnerPoints,
  secondPlacePoints,
  thirdPlacePoints,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20 ">
      <div className="bg-blue-400 p-8 rounded-lg shadow-lg text-center w-1/2 h-3/4 relative text-red-800">
        <h1 className="text-3xl font-bold mb-4 text-emerald-500">
          {winner} is the winner!
        </h1>
        <div className="flex justify-around items-end mt-40">
          <div className="flex flex-col items-center pr-32 ">
            <div className="text-2xl font-bold mb-2">#2</div>
            <div className="w-24 h-24 rounded-full mb-2">
              <Avatar
                arrows={false}
                colorXY={[0, 0]}
                eyesXY={[0, 0]}
                mouthXY={[0, 0]}
              />
            </div>
            <div className="text-xl">{secondPlace===undefined?"None":secondPlace}</div>
            <div className="text-sm">{secondPlacePoints===undefined?0:secondPlacePoints} points</div>
          </div>
          <div className="flex flex-col items-center absolute top-44 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="text-2xl font-bold mb-2">#1</div>
            <div className="w-24 h-24 rounded-full mb-2">
              <div
                className="h-10 w-10 absolute top-4 left-30"
                style={{
                  backgroundImage: "url('/img/crown.gif')",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "100%",
                  backgroundPosition: "-90% -250%",
                }}
              ></div>
              <Avatar
                arrows={false}
                colorXY={[-100, -100]}
                eyesXY={[-100, -100]}
                mouthXY={[-100, -100]}
              />
            </div>
            <div className="text-xl">{winner===undefined?"None":winner}</div>
            {
              <div className="z-40 mr-96">
                <Confetti width={400} height={window.innerHeight} />
              </div>
            }
            <div className="text-sm">{winnerPoints===undefined?0:winnerPoints} points</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-2xl font-bold mb-2">#3</div>
            <div className="w-24 h-24 rounded-full mb-2">
              <Avatar
                arrows={false}
                colorXY={[-100, 0]}
                eyesXY={[-100, 0]}
                mouthXY={[-100, 0]}
              />
            </div>
            <div className="text-xl">{thirdPlace===undefined?"None":thirdPlace}</div>
            <div className="text-sm">{thirdPlacePoints===undefined?0:thirdPlacePoints} points</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Finished;
