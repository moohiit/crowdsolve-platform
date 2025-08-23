// store/slices/problemSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  problems: [],
  userProblems: [], // Added userProblems array
  currentProblem: null,
  solutions: [],
  comments: [],
  loading: false,
  error: null,
};

const problemSlice = createSlice({
  name: 'problems',
  initialState,
  reducers: {
    startLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setProblems: (state, action) => {
      state.problems = action.payload;
      state.loading = false;
    },
    setUserProblems: (state, action) => { // Added setUserProblems reducer
      state.userProblems = action.payload;
      state.loading = false;
    },
    setProblem: (state, action) => {
      state.currentProblem = action.payload;
      state.loading = false;
    },
    setSolutions: (state, action) => {
      state.solutions = action.payload;
      state.loading = false;
    },
    setComments: (state, action) => {
      state.comments = action.payload;
      state.loading = false;
    },
    addProblem: (state, action) => {
      state.problems.unshift(action.payload);
      state.userProblems.unshift(action.payload); // Also add to userProblems
    },
    addSolution: (state, action) => {
      state.solutions.push(action.payload);
    },
    addComment: (state, action) => {
      state.comments.push(action.payload);
    },
    updateSolutionUpvotes: (state, action) => {
      const { solutionId, upvotes } = action.payload;
      const solution = state.solutions.find(s => s._id === solutionId);
      if (solution) {
        solution.upvotes = upvotes;
      }
    },
    removeProblem: (state, action) => { // Added removeProblem reducer
      const problemId = action.payload;
      state.problems = state.problems.filter(problem => problem._id !== problemId);
      state.userProblems = state.userProblems.filter(problem => problem._id !== problemId);
      
      // Also remove currentProblem if it's the one being deleted
      if (state.currentProblem && state.currentProblem._id === problemId) {
        state.currentProblem = null;
      }
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  startLoading,
  setProblems,
  setUserProblems, // Export the new action
  setProblem,
  setSolutions,
  setComments,
  addProblem,
  addSolution,
  addComment,
  updateSolutionUpvotes,
  removeProblem, // Export the new action
  setError,
  clearError,
} = problemSlice.actions;

export default problemSlice.reducer;