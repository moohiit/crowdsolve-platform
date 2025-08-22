import api from "./api";

export const createSolution = (problemId, data) =>
  api.post(`/api/solutions/${problemId}`, data);
export const upvoteSolution = (id) => api.put(`/api/solutions/${id}/upvote`);
export const createComment = (solutionId, data) =>
  api.post(`/api/solutions/${solutionId}/comments`, data);
export const getSolutions = (problemId) =>
  api.get(`/api/solutions/${problemId}`);
export const getComments = (solutionId) =>
  api.get(`/api/solutions/${solutionId}/comments`);
