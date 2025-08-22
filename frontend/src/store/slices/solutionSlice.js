import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  solutions: [],
  loading: false,
  error: null,
};

const solutionSlice = createSlice({
  name: "solutions",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setSolutions: (state, action) => {
      state.solutions = action.payload;
      state.loading = false;
      state.error = null;
    },
    addSolution: (state, action) => {
      state.solutions.unshift(action.payload);
    },
    addComment: (state, action) => {
      const { solutionId, comment } = action.payload;
      const solution = state.solutions.find((s) => s._id === solutionId);
      if (solution) {
        solution.comments.push(comment);
      }
    },
    upvoteSolution: (state, action) => {
      const { solutionId, userId } = action.payload;
      const solution = state.solutions.find((s) => s._id === solutionId);
      if (solution && !solution.upvotes.includes(userId)) {
        solution.upvotes.push(userId);
      }
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setLoading,
  setSolutions,
  addSolution,
  addComment,
  upvoteSolution,
  setError,
} = solutionSlice.actions;
export default solutionSlice.reducer;
