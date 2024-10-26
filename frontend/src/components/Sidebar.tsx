import React, { useEffect } from 'react';
import Avatar from './Avatar';
import { usePlayContext } from '../context/PlayContext';
import Pusher from 'pusher-js';

interface User {
  rank: number;
  username: string;
  points: number;
  colorXY: [number, number];
  mouthXY: [number, number];
  eyesXY: [number, number];
}

interface SidebarProps {
  users: User[];
  roomId: string;
}

const Sidebar: React.FC<SidebarProps> = ({ users, roomId }) => {
  const { correctGuessers, setCorrectGuessers } = usePlayContext();

  useEffect(() => {
    const pusher = new Pusher('aeebbaeff97d07c436be', {
      cluster: 'ap2',
    });

    const channel = pusher.subscribe(roomId);

    const handleUserGuessed = (data: { username: string }) => {
      setCorrectGuessers(prev => new Set(prev).add(data.username));
    };

    channel.bind('user-guessed', handleUserGuessed);

    return () => {
      channel.unbind('user-guessed', handleUserGuessed);
      pusher.unsubscribe(roomId);
    };
  }, [roomId, setCorrectGuessers]);

  return (
    <div className="bg-blue-200 p-4 h-full w-full">
      <h2 className="text-center font-bold text-xl mb-4">Leaderboard</h2>   
      <ul className="flex flex-col gap-2">
        {users.map((user, index) => (
          <li
            key={index}
            className={`flex items-center justify-between p-2 shadow rounded-md ${correctGuessers.has(user.username) ? "bg-green-300" : "bg-white"}`}
          >
            <div className="h-8 w-8">
                <Avatar arrows={false} colorXY={user.colorXY} mouthXY={user.mouthXY} eyesXY={user.eyesXY} />
            </div>
            <span className="text-lg">{user.username}</span>
            <span className="text-lg">{user.points === undefined ? 0 : user.points} pts</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
