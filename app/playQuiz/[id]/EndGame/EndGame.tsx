import React, { useEffect, useState } from "react";
import CorrectAnswersBarPercentage from "../components/CorrectAnswersBarPercentage";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { Attempt } from "@/app/components/types/types";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Leaderboard from "./Leaderboard";
import { getItem, setItem } from "@/app/localStorage/localStorage";
import { get } from "http";
import toast from "react-hot-toast";

type EndGameProps = {
  userName: string;
  questionsCount: number;
  correctQuestions: number;
  quizId: string;
  userAlreadyGuessed?: boolean;
};

const EndGame: React.FC<EndGameProps> = ({
  userName,
  questionsCount,
  correctQuestions,
  quizId,
  userAlreadyGuessed,
}) => {
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const router = useRouter();

  const getQuizById = async (quizId: string) => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/getQuiz?id=${quizId}`);
      console.log(res.data);
      if (res.data === null) {
        router.push("/");
        toast.error("Quiz not found");
      }
      if (res.data.attempts === undefined) return console.log("undefined");
      setAttempts(res.data.attempts);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const attempt: Attempt = {
      userName,
      quizId,
      score: correctQuestions,
    };

    if (userAlreadyGuessed) {
      getQuizById(quizId);
      return;
    }

    if (quizId !== undefined) {
      setLoading(true);
      axios
        .post("/api/addAttemptToQuiz", { attempt, quizId })
        .then((res) => {
          setAttempts(res.data.attempts);
          // setToLocalStorage
          let quizItems = JSON.parse(getItem("quizesAttempts") || "[]");

          const newQuizItem = {
            quizId: quizId,
            userName,
            correctQuestions,
            questionsCount,
          };

          quizItems.push(newQuizItem);

          setItem("quizesAttempts", JSON.stringify(quizItems));

          console.log({
            quizId: quizId,
            userName,
            correctQuestions,
            questionsCount,
          });
          console.log(res.data.attempts);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-8 px-4">
      <div className="flex flex-col text-center bg-[#202026] rounded-xl px-16 py-4 mt-4 shadow-lg">
        <h1 className="text-white text-5xl font-black my-4">
          Create a quiz yourself
        </h1>
        <p className="text-[#a19fb1] text-3xl my-4">
          How well do your friends know you ?
        </p>

        <a
          href="/"
          className=" text-3xl px-8 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer "
        >
          Create Quiz
        </a>
      </div>
      <CorrectAnswersBarPercentage />
      <Leaderboard attempts={attempts} loading={loading} />
    </div>
  );
};

export default EndGame;
