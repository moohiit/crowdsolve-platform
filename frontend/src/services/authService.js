import api from "./api";

export const signup = (data) =>
  api.post("/api/auth/signup", data).then((res) => res.data);
export const login = (data) =>
  api.post("/api/auth/login", data).then((res) => res.data);
export const getMe = () => api.get("/api/auth/me").then((res) => res.data);
export const logout = () => Promise.resolve(); // Handled in Redux
