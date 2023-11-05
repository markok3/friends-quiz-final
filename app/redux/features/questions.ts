import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Question, Answer, QuestionsState } from "@/app/components/types/types";

// Initial state for the questions slice.
const initialState: QuestionsState = {
  userName: "",
  quizId: "",
  questionsCount: 0,
  currentQuestion: 0,
  correctQuestions: 0,
  incorrectQuestions: 0,
  questions: [],
};

// Create a questions slice.
const questionsSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {
    // Add reducer actions here to update the questions state.
    setUserName: (state, action: PayloadAction<string>) => {
      state.userName = action.payload;
    },
    setQuestions: (state, action: PayloadAction<Question[]>) => {
      state.questionsCount = action.payload.length;
      state.questions = action.payload;
    },
    setCurrentQuestion: (state, action: PayloadAction<number>) => {
      state.currentQuestion = action.payload;
    },
    incrementCorrectQuestions: (state) => {
      state.correctQuestions++;
    },
    incrementIncorrectQuestions: (state) => {
      state.incorrectQuestions++;
    },
    setQuizId: (state, action: PayloadAction<string>) => {
      state.quizId = action.payload;
    },
  },
});

// Export actions created by the slice.
export const {
  setQuestions,
  setCurrentQuestion,
  incrementCorrectQuestions,
  incrementIncorrectQuestions,
  setUserName,
  setQuizId,
} = questionsSlice.actions;

// Export the reducer function.
export default questionsSlice.reducer;
