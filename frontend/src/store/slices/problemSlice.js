import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axiosInstance";

// fetch all problems
export const fetchProblems = createAsyncThunk("problems/fetchAll", async () => {
  const res = await axios.get("/problems");
  return res.data;
});

// fetch single problem
export const fetchProblemById = createAsyncThunk(
  "problems/fetchById",
  async (id) => {
    const res = await axios.get(`/problems/${id}`);
    return res.data;
  }
);

// create solution
export const addSolution = createAsyncThunk(
  "problems/addSolution",
  async ({ id, data }) => {
    const res = await axios.post(`/problems/${id}/solutions`, data);
    return { id, solution: res.data };
  }
);

// upvote solution
export const upvoteSolution = createAsyncThunk(
  "problems/upvoteSolution",
  async (id) => {
    const res = await axios.post(`/solutions/${id}/upvote`);
    return res.data;
  }
);

// comment solution
export const addComment = createAsyncThunk(
  "problems/addComment",
  async ({ id, data }) => {
    const res = await axios.post(`/solutions/${id}/comments`, data);
    return { id, comment: res.data };
  }
);

const problemSlice = createSlice({
  name: "problems",
  initialState: {
    list: [],
    current: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProblems.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(fetchProblemById.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(addSolution.fulfilled, (state, action) => {
        if (state.current && state.current._id === action.payload.id) {
          state.current.solutions.push(action.payload.solution);
        }
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const sol = state.current.solutions.find(
          (s) => s._id === action.payload.id
        );
        if (sol) sol.comments.push(action.payload.comment);
      })
      .addCase(upvoteSolution.fulfilled, (state, action) => {
        const sol = state.current.solutions.find(
          (s) => s._id === action.payload._id
        );
        if (sol) sol.upvotes = action.payload.upvotes;
      });
  },
});

export default problemSlice.reducer;
