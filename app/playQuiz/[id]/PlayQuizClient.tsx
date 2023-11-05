"use client";
import React, { useEffect, useState } from "react";
import Container from "@/app/components/Container";
import StartScreen from "./components/StartScreen";
import QuizQuestion from "./components/QuizQuestion";
import {
  setQuestions,
  setQuizId as setQuizIdAction,
  setUserName,
} from "@/app/redux/features/questions";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import CorrectAnswersBarPercentage from "./components/CorrectAnswersBarPercentage";
import EndGame from "./EndGame/EndGame";
import axios from "axios";
import toast from "react-hot-toast";
import { BounceLoader } from "react-spinners";
import {
  Attempt,
  QuestionsState,
  RootState,
} from "@/app/components/types/types";
import { useParams, useRouter } from "next/navigation";
import { getItem, setItem } from "@/app/localStorage/localStorage";

interface PlayQuizClientProps {}

const PlayQuizClient: React.FC<PlayQuizClientProps> = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [name, setName] = useState<string>("");
  const [quizLoaded, setQuizLoaded] = useState<Boolean>(false);
  const [quizCreatorName, setQuizCreatorName] = useState<string>("");
  const [quizId, setQuizId] = useState<string>("");
  const [hasError, setHasError] = useState<boolean>();
  const [userAlreadyGuessed, setUserAlreadyGuessed] = useState(false);
  const [quizAttemptFound, setQuizAttemptFound] = useState<any>(null);
  const params = useParams();

  const questionsCount = useSelector(
    (state: RootState) => state.questions.questionsCount
  );
  const currentQuestion = useSelector(
    (state: RootState) => state.questions.currentQuestion
  );

  const correctQuestions = useSelector(
    (state: RootState) => state.questions.correctQuestions
  );

  const handleBeginClick = (name: string) => {
    if (name === "") {
      toast.error("Please enter a name");
      return;
    }

    const quizIdFromParams = params.id;
    const quizId = Array.isArray(quizIdFromParams)
      ? quizIdFromParams[0]
      : quizIdFromParams;

    getQuizById(quizId);

    dispatch(setUserName(name));
    setName(name);
  };

  useEffect(() => {
    setQuizLoaded(false);
    if (getItem("quizesAttempts") === null) {
      setItem("quizesAttempts", []);
      setQuizLoaded(true);
    } else {
      const quizIdFromParams = params.id;
      const quizId = Array.isArray(quizIdFromParams)
        ? quizIdFromParams[0]
        : quizIdFromParams;

      let quizesAttempts = JSON.parse(getItem("quizesAttempts") || "[]");

      console.log(quizesAttempts);
      console.log(quizId);

      if (quizesAttempts === null || quizesAttempts === undefined) {
        return;
      }
      const foundAttempt = quizesAttempts.find(
        (quizAttempt: any) => quizAttempt.quizId === quizId
      );

      console.log(foundAttempt);

      if (foundAttempt) {
        setQuizAttemptFound(foundAttempt);
        setUserAlreadyGuessed(true);
      }
      setQuizLoaded(true);
      console.log(foundAttempt);
    }
    console.log("se pusta");
  }, []);

  const getQuizById = async (quizId: string) => {
    console.log(quizId);
    try {
      setQuizLoaded(false);
      const res = await axios.get(`/api/getQuiz?id=${quizId}`);
      dispatch(setQuestions(res.data.questions));
      setQuizLoaded(true);
      setQuizCreatorName(res.data.creatorName);
      setQuizId(quizId);
    } catch (err) {
      setHasError(true);
    } finally {
      setQuizLoaded(true);
    }
  };

  if (hasError) {
    toast.error("Quiz not found");
    router.push("/");
  }

  if (!quizLoaded) {
    return (
      <div>
        <BounceLoader color="#36d7b7" />
      </div>
    );
  }

  if (quizAttemptFound) {
    return (
      <div className="">
        <EndGame
          // eslint-disable-next-line
          quizId={quizAttemptFound.quizId}
          userName={quizAttemptFound.userName}
          questionsCount={quizAttemptFound.questionsCount}
          correctQuestions={quizAttemptFound.correctQuestions}
          userAlreadyGuessed={true}
        />
      </div>
    );
  }

  if (name === "" && !userAlreadyGuessed) {
    return (
      <StartScreen
        handleBeginClick={handleBeginClick}
        creatorName={quizCreatorName}
      />
    );
  }
  if (currentQuestion == questionsCount && currentQuestion != 0) {
    return (
      <div className="">
        <EndGame
          quizId={quizId}
          userName={name}
          questionsCount={questionsCount}
          correctQuestions={correctQuestions}
          userAlreadyGuessed={quizAttemptFound}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center px-4">
      <QuizQuestion />
      <Container>
        <CorrectAnswersBarPercentage />
      </Container>
    </div>
  );
};

export default PlayQuizClient;
