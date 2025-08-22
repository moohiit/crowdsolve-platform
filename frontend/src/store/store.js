import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import problemReducer from "./slices/problemSlice";
import solutionReducer from "./slices/solutionSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    problems: problemReducer,
    solutions: solutionReducer,
  },
});

export default store;
