import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, logout } from "./store/slices/authSlice";
import Layout from "./components/common/Layout";
import AuthLayout from "./layouts/AuthLayout";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import ProblemList from "./components/problems/ProblemList";
import ProblemDetail from "./components/problems/ProblemDetail";
import CreateProblem from "./components/problems/CreateProblem";
import MyProblems from "./components/problems/MyProblems"; // Import the new component
import Dashboard from "./components/dashboard/Dashboard";
import UserDashboard from "./components/dashboard/UserDashboard";
import socket from "./socket/socket";
import Notification from "./components/common/Notification";
import { addNotifications, newNotification } from "./store/slices/notificationSlice";

function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.auth);
  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/notifications", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        dispatch(addNotifications(data.notifications));
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };
  // Verify token on app load and page refresh
  useEffect(() => {

    const verifyToken = async () => {
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          if (decoded.exp < currentTime) {
            // Token expired
            dispatch(logout());
            return;
          }
          const response = await fetch("/api/auth/me", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          });

          const data = await response.json();

          if (data.success) {
            dispatch(
              loginSuccess({
                user: data.user,
                token: token,
              })
            );
            fetchNotifications();
          } else {
            dispatch(logout());
          }
        } catch (error) {
          console.error("Token verification failed:", error);
          dispatch(logout());
        }
      }
    };

    verifyToken();
  }, [dispatch, token]);

  useEffect(() => {
    if (!user) return;
    socket.connect();
    socket.emit('joinRoom', user?._id);
    console.log("Socket connected in App.jsx");
    // Listen once for notifications
    const handleNotification = (data) => {
      console.log("New notification received:", data);
      dispatch(newNotification(data));
    };
    socket.on("newNotification", handleNotification);

    // Optional: listen for connection errors
    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });
    // Cleanup
    return () => {
      socket.off("newNotification", handleNotification);
      socket.off("connect_error");
      socket.disconnect();
    };
  }, [user]);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Auth routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>

          {/* Protected routes */}
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  {user && user.role === "admin" ? (
                    <Dashboard />
                  ) : (
                    <UserDashboard />
                  )}
                </ProtectedRoute>
              }
            />
            <Route path="/problems" element={<ProblemList />} />
            <Route path="/problems/:id" element={<ProblemDetail />} />
            <Route
              path="/create-problem"
              element={
                <ProtectedRoute>
                  <CreateProblem />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-problems"
              element={
                <ProtectedRoute>
                  <MyProblems />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <Notification />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/problems" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
