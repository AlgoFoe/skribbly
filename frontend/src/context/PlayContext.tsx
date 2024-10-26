import { createContext, useState, ReactNode, Dispatch, SetStateAction, useContext } from "react";

export interface User {
    rank: number;
    username: string;
    points: number;
    colorXY: [number, number];
    mouthXY: [number, number];
    eyesXY: [number, number];
  }

export interface PlayContextType {
  correctGuessers: Set<string>;
  setCorrectGuessers: Dispatch<SetStateAction<Set<string>>>;
  currentUserDrawing: number;
  setCurrentUserDrawing: Dispatch<SetStateAction<number>>;
}

const defaultValue: PlayContextType = {
  correctGuessers: new Set(),
  setCorrectGuessers: () => {},
  currentUserDrawing: 1,
  setCurrentUserDrawing: () => {},
};

export const PlayContext = createContext<PlayContextType>(defaultValue);

interface PlayContextProviderProps {
  children: ReactNode;
}

export const PlayContextProvider = ({ children }: PlayContextProviderProps) => {
  const [correctGuessers, setCorrectGuessers] = useState<Set<string>>(new Set());
  const [currentUserDrawing, setCurrentUserDrawing] = useState<number>(1);

  return (
    <PlayContext.Provider value={{ correctGuessers, setCorrectGuessers, currentUserDrawing, setCurrentUserDrawing }}>
      {children}
    </PlayContext.Provider>
  );
};

export const usePlayContext = (): PlayContextType => {
  const context = useContext(PlayContext);
  if (context === undefined) {
    throw new Error("usePlayContext must be used within a PlayContextProvider");
  }
  return context;
};
