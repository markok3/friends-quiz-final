import React, { useEffect, useState } from "react";
import QuizHeader from "./QuizHeader";
import Question from "./question/Question";
import axios from "axios";
import QuizShareSocials from "./QuizShareSocials";
import toast from "react-hot-toast";
import { Answer, Question as QuestionType } from "../types/types";
import questionsData from "@/app/data/questionsData";
import { v4 as uuidv4 } from "uuid";
import { parse } from "path";
import { AiOutlinePlus } from "react-icons/ai";
import { setItem } from "@/app/localStorage/localStorage";

interface QuizProps {
  name: string;
}

const Quiz: React.FC<QuizProps> = ({ name }) => {
  const [quizId, setQuizId] = useState(null);

  const handleSaveAndShareClick = () => {
    if (hasInvalidQuestions() || hasInvalidAnswers()) {
      return;
    }
    const quizData = {
      name: "Your Quiz Name", //to be added
      creatorName: name,
      questions: questions,
    };

    const saveQuizPromise = axios.post("/api/createQuiz", quizData);

    toast.promise(saveQuizPromise, {
      loading: "Saving...",
      success: (res) => {
        setQuizId(res.data.id);
        setItem("quizId", res.data.id);
        return "Quiz saved successfully";
      },
      error: "Failed to save quiz",
    });
  };

  const hasInvalidQuestions = () => {
    const hasEmptyQuestion = questions.some((question) => {
      return question.question === "";
    });

    if (hasEmptyQuestion) {
      toast.error("Please fill in all questions");
      return true;
    }
  };

  const hasInvalidAnswers = () => {
    const hasEmptyCorrectAnswers = questions.some((question) => {
      if (question.answers.some((answer) => hasEmptyCorrectAnswer(answer))) {
        return true;
      }
    });

    if (hasEmptyCorrectAnswers) {
      toast.error("Please choose a correct answer for each question");
      return true;
    }

    const hasNoCorrectAnswerChoosen = questions.some((question: any) => {
      if (!questionHasAtLeastOneCorrectAnswer(question)) {
        return true;
      }
    });

    if (hasNoCorrectAnswerChoosen) {
      toast.error("Please choose a correct answer for each question");
      return true;
    }
  };

  const hasEmptyCorrectAnswer = (answer: Answer) => {
    return answer.isCorrect && answer.text === "";
  };

  const questionHasAtLeastOneCorrectAnswer = (question: QuestionType) => {
    return question.answers.some((answer: Answer) => answer.isCorrect);
  };

  const addNameInQuestions = (questions: QuestionType[], name: string) => {
    return questions.map((question) => {
      const updatedQuestion = { ...question };
      updatedQuestion.question = updatedQuestion.question.replace(
        "{name}",
        name
      );
      return updatedQuestion;
    });
  };

  const chooseRandomQuestions = (
    num: number,
    questionData: QuestionType[],
    name: string
  ) => {
    // shuffle the questions
    let shuffledQuestions = questionData.sort(() => Math.random() - 0.5);
    // return the number of questions we want
    shuffledQuestions = shuffledQuestions.slice(0, num);

    shuffledQuestions = shuffledQuestions.map((question) => ({
      ...question,
      id: uuidv4(),
    }));

    shuffledQuestions = addNameInQuestions(shuffledQuestions, name);

    // add name in questions
    return shuffledQuestions;
  };

  const [questions, setQuestions] = useState<QuestionType[]>([]);

  useEffect(() => {
    let shuffledQuestions = chooseRandomQuestions(5, questionsData, name);
    setQuestions(shuffledQuestions);
  }, []);

  const updateQuestion = (updatedQuestion: any, index: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = updatedQuestion;
    setQuestions(updatedQuestions);
  };

  const deleteQuestion = (index: number) => {
    if (questions.length <= 1) {
      toast.error("You must have at least one question");
      return;
    }
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    if (questions.length >= 10) {
      toast.error("You can only add up to 10 questions");
      return;
    }

    const randomQuestion = chooseRandomQuestions(1, questionsData, name);
    const updatedQuestions = [...questions, randomQuestion[0]];

    setQuestions(updatedQuestions);
  };

  if (quizId === null) {
    return (
      <>
        <QuizHeader name={name} />
        <div
          className="flex flex-col items-center
       justify-center gap-8 mt-8"
        >
          {questions.map((question, index) => (
            <Question
              key={question.id}
              index={index}
              question={question}
              updateQuestion={(updatedQuestion: QuestionType) =>
                updateQuestion(updatedQuestion, index)
              }
              deleteQuestion={() => deleteQuestion(index)}
            />
          ))}

          {/* add question button */}
          <div className="" onClick={() => addQuestion()}>
            <AiOutlinePlus
              size={40}
              className="text-xl 
              font-extrabold 
              text-white 
              bg-green-600 
              rounded-full 
              hover:transform 
              hover:cursor-pointer 
              hover:scale-110 
              transition 
              duration-300 
              ease-in-out 
              h-9 
              w-9"
            />
          </div>
          {/* save and share button */}
          <div className="mb-5 w-full">
            <button
              onClick={() => handleSaveAndShareClick()}
              className="px-8 text-3xl py-5 bg-blue-500 text-white rounded-full hover:bg-blue-600 cursor-pointer mt-12 w-full"
            >
              Save and Share
            </button>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <div className="h-full flex items-center justify-center">
        <QuizShareSocials quizId={quizId} />
      </div>
    );
  }
};

export default Quiz;
