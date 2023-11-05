import { getItem, removeItem } from "@/app/localStorage/localStorage";
import Leaderboard from "@/app/playQuiz/[id]/EndGame/Leaderboard";
import { Attempt } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FacebookIcon,
  FacebookShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";

interface QuizShareSocialsProps {
  quizId: string;
}

const QuizShareSocials: React.FC<QuizShareSocialsProps> = ({ quizId }) => {
  const shareUrl = new URL(`playQuiz/${quizId}`, window.location.href).href;
  const [attemptsLoading, setAttemptsLoading] = useState(false);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const router = useRouter();
  // const shareUrl = new URL(`playQuiz?id=${quizId}`, window.location.href).href;

  const getQuizById = async (quizId: string) => {
    console.log(quizId);
    try {
      setAttemptsLoading(true);
      const res = await axios.get(`/api/getQuiz?id=${quizId}`);
      console.log(res.data);
      if (res.data.attempts === undefined) return console.log("undefined");
      setAttempts(res.data.attempts);
    } catch (err) {
      console.log(err);
    } finally {
      setAttemptsLoading(false);
    }
  };

  useEffect(() => {
    getQuizById(quizId);
  }, []);

  const handleCopyLinkClick = () => {
    toast.success("Link copied to clipboard");
    navigator.clipboard.writeText(shareUrl);
  };

  const handleDeleteQuizClick = () => {
    deleteQuiz();
  };

  const deleteQuiz = async () => {
    if (getItem("quizId") !== quizId) {
      toast.error("You can't delete this quiz");
      return;
    }

    const deleteQuizPromise = axios.delete(`/api/deleteQuiz?id=${quizId}`);

    toast.promise(deleteQuizPromise, {
      loading: "Deleting...",
      success: () => {
        removeItem("quizId");
        window.location.reload();
        return "Quiz deleted successfully";
      },
      error: "Failed to delete quiz",
    });
  };
  return (
    <div className="bg-[#202026] rounded-xl w-full px-5 py-9 text-white text-center flex flex-col items-center justify-center">
      <h1 className="text-xl md:text-3xl font-bold">
        Your quiz link is: <br />
        <a href={shareUrl} className="underline text-sm md:text-3xl">
          {shareUrl}
        </a>
      </h1>

      <button
        className="px-8 text-xl py-4 bg-blue-600 text-white rounded-full hover:bg-blue-500 cursor-pointer mt-4 w-full md:w-1/2 mx-auto"
        onClick={() => handleCopyLinkClick()}
      >
        Copy Link to Clipboard
      </button>

      <div className="mt-8">
        <h2>Share your quiz on: </h2>
        <div className="flex justify-center gap-10 ">
          <FacebookShareButton url={shareUrl}>
            <FacebookIcon xHeight={40} round={false} className="rounded-xl" />
          </FacebookShareButton>
          <WhatsappShareButton url={shareUrl}>
            <WhatsappIcon xHeight={40} round={false} className="rounded-xl" />
          </WhatsappShareButton>
          <TwitterShareButton url={shareUrl}>
            <TwitterIcon xHeight={40} round={false} className="rounded-xl" />
          </TwitterShareButton>
        </div>
      </div>

      <div className="mt-8 w-full">
        {attempts.length > 0 && (
          <Leaderboard attempts={attempts} loading={attemptsLoading} />
        )}
        <div>
          <button
            className="px-8 text-xl py-4 bg-red-600 text-white rounded-full hover:bg-red-500 cursor-pointer mt-4 w-full md:w-1/2 mx-auto"
            onClick={() => {
              handleDeleteQuizClick();
            }}
          >
            Delete Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizShareSocials;
