import React, { createContext, useReducer } from "react";
import question from "../../data/questions";

const STAGES = ["Start", "Playing", "End"];

const initialState = {
  gameStage: STAGES[0],
  question,
  currentQuestion: 0,
  score: 0,
};

const quizReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_STAGE":
      const nextStage =
        state.gameStage === STAGES[0] ? STAGES[1] : state.gameStage;
      return {
        ...state,
        gameStage: nextStage,
      };
    case "CHANGE_QUESTION":
      const nextQuestion = state.currentQuestion + 1;
      let endGame = false;

      if (!question[nextQuestion]) {
        endGame = true;
      }

      return {
        ...state,
        currentQuestion: nextQuestion,
        gameStage: endGame ? STAGES[2] : state.gameStage,
        answerSelected: null,
      };

    case "NEW_GAME":
      return initialState;

    case "CHECK_ANSWER": {
      if (state.answerSelected) return state;

      const { answer, option } = action.payload;
      const isCorrect = answer === option;

      return {
        ...state,
        score: state.score + (isCorrect ? 1 : 0),
        answerSelected: option,
        isCorrectAnswer: isCorrect, 
      };
    }

    default:
      return state;
  }
};

export const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  const value = useReducer(quizReducer, initialState);

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};
