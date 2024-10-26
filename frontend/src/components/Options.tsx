import React from "react";
import { useAuthContext } from "../context/AuthContext";

interface OptionsProps {
  words: string[];
  onWordSelected: (word: string) => void;
  userDrawingUsername: string
}

const Options: React.FC<OptionsProps> = ({ words, onWordSelected, userDrawingUsername }) => {

  const { authUser } = useAuthContext()

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-10">
      {
        authUser?.username !== userDrawingUsername ?
          (<h1 className="text-4xl font-bold tracking-wider animate-pulse">{`${userDrawingUsername} is choosing a word...`}</h1>) :
          (<div className="bg-white p-4 rounded-md shadow-md">
            <h2 className="text-lg font-bold mb-4">Choose a word</h2>
            <div className="flex space-x-4">
              {words.map((word, index) => (
                <button
                  key={index}
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                  onClick={() => onWordSelected(word)}
                >
                  {word}
                </button>
              ))}
            </div>
          </div>)
      }
    </div>
  );
};

export default Options;
