import React from 'react';
import Avatar from './Avatar';
import toast from 'react-hot-toast';

interface Member {
  username: string;
  colorXY: [number, number];
  eyesXY: [number, number];
  mouthXY: [number, number];
}

interface WaitingRoomProps {
  members: Member[];
  roomLink: string;
}

const WaitingRoom: React.FC<WaitingRoomProps> = ({ members, roomLink }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(roomLink);
    toast.success('Link copied to clipboard!');
  };

  const handleStart = async () => {
    try {
      await fetch("/api/room/gameStarted", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roomId: roomLink,membersLen: members.length}), 
      });
    } catch (error) {
      console.error("Error starting the game:", error);
    }
  };


  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-3/4 h-5/6 bg-gray-700 shadow-lg rounded-lg p-4 overflow-auto">
        <div className="flex gap-2 items-center justify-center">
          <h1 className="text-2xl font-bold text-center mb-4">Waiting for players to join</h1>
          <span className="loading loading-dots loading-xs"></span>
        </div>
        <div className="flex items-center justify-around h-1/2">
          {members.map((member, index) => (
            <div key={index} className="flex flex-col justify-end items-center h-40 w-40 p-4 rounded-full shadow-2xl bg-gray-600">
              <Avatar
                arrows={false} 
                colorXY={member.colorXY}
                eyesXY={member.eyesXY}
                mouthXY={member.mouthXY}
              />
              <span className="text-xl font-semibold">{member.username}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center justify-center mt-6 space-y-4">
          <div className="text-center text-xl font-bold">Invite your friends!</div>
          <input
            type="text"
            value={roomLink}
            readOnly
            className="w-full md:w-1/2 h-12 px-4 py-2 border rounded-lg focus:outline-none"
          />
          <button
            onClick={copyToClipboard}
            className="w-full md:w-1/2 p-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600"
          >
            Copy Room Id
          </button>
          <button
            onClick={handleStart}
            className="w-full md:w-1/2 p-2 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600"
          >
            Start Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default WaitingRoom;
