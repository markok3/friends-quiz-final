import { RootState } from "@/app/components/types/types";
import React from "react";
import { useSelector } from "react-redux";

const CorrectAnswersBarPercentage = ({}) => {
  // Use useSelector to access data from the Redux store
  const correctQuestions = useSelector(
    (state: RootState) => state.questions.correctQuestions
  );
  const questionsCount = useSelector(
    (state: RootState) => state.questions.questionsCount
  );

  // Calculate the percentage of correct answers
  const percentage = (correctQuestions / questionsCount) * 100;

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <h2 className="text-2xl font-semibold mb-2 text-white text-center">
        {correctQuestions} correct out of {questionsCount} answers
      </h2>
      <div className="w-[90%] bg-gray-300 rounded overflow-hidden">
        <div
          className="bg-green-500 h-5 transition-all"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <p className="text-center text-xl mt-2 text-white">
        Percentage of Correct Answers: {percentage.toFixed(2)}%
      </p>
    </div>
  );
};

export default CorrectAnswersBarPercentage;
