import React from "react";
import PlayQuizClient from "./PlayQuizClient";
import { Toaster } from "react-hot-toast";

interface PlayQuizProps {
  params: {
    id: string;
  };
}

const PlayQuiz: React.FC<PlayQuizProps> = () => {
  return (
    <div className=" w-full h-full flex items-center justify-center">
      <Toaster />
      <PlayQuizClient />
    </div>
  );
};

export default PlayQuiz;
