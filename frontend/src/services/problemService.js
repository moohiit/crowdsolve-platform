import api from "./api";

export const createProblem = (formData) =>
  api.post("/api/problems", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const getProblems = (page = 1, limit = 10) =>
  api.get(`/api/problems?page=${page}&limit=${limit}`);
export const getProblem = (id) => api.get(`/api/problems/${id}`);
