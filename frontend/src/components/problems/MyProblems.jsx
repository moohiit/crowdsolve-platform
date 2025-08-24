// components/problems/MyProblems.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  setUserProblems,
  startLoading,
  setError,
} from "../../store/slices/problemSlice";

const MyProblems = () => {
  const dispatch = useDispatch();
  const { userProblems, loading, error } = useSelector(
    (state) => state.problems
  );
  const { user } = useSelector((state) => state.auth);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchUserProblems();
  }, [page]);

  const fetchUserProblems = async () => {
    dispatch(startLoading());
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `/api/problems/user/my-problems?page=${page}&limit=10`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      const data = await response.json();

      if (data.success) {
        if (page === 1) {
          dispatch(setUserProblems(data.problems));
        } else {
          dispatch(setUserProblems([...userProblems, ...data.problems]));
        }
        setHasMore(data.page < data.pages);
      } else {
        dispatch(setError(data.message || "Failed to fetch your problems"));
      }
    } catch (error) {
      dispatch(setError("Network error. Please try again."));
    }
  };

  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

  const deleteProblem = async (problemId) => {
    if (!window.confirm("Are you sure you want to delete this problem?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/problems/${problemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        // Remove the problem from the list
        dispatch(
          setUserProblems(
            userProblems.filter((problem) => problem._id !== problemId)
          )
        );
      } else {
        dispatch(setError(data.message));
      }
    } catch (error) {
      dispatch(setError("Failed to delete problem. Please try again."));
    }
  };

  if (loading && userProblems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center mt-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 mt-16">
        <div className="bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 mt-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">My Reported Problems</h1>
        <Link to="/create-problem" className="btn-save flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Report New Problem
        </Link>
      </div>

      {userProblems.length === 0 ? (
        <div className="card text-center py-12">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-xl font-medium text-white mb-2">
            You haven't reported any problems yet
          </h3>
          <p className="text-gray-400 mb-6">
            Start by reporting a problem in your community
          </p>
          <Link to="/create-problem" className="btn-save">
            Report Your First Problem
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {userProblems.map((problem) => (
              <div
                key={problem._id}
                className="card group hover:border-primary-500/30 transition-all duration-300 animate-slide-up"
              >
                {problem?.image?.url && (
                  <div className="relative h-48 overflow-hidden rounded-lg mb-4">
                    <img
                      src={`${problem?.image?.url}`}
                      alt={problem.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900/70 to-transparent"></div>
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors">
                    {problem.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {problem.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {problem.location}
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(problem.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">
                      {problem.solutionsCount || 0} solutions
                    </span>
                    <span className="text-gray-400">
                      {problem.totalUpvotes || 0} upvotes
                    </span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-dark-700/50 flex space-x-2">
                  <Link
                    to={`/problems/${problem._id}`}
                    className="btn-warning flex-1 text-center"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => deleteProblem(problem._id)}
                    className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 rounded-lg transition-colors"
                    title="Delete Problem"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {hasMore && (
            <div className="text-center">
              <button
                onClick={loadMore}
                disabled={loading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Loading...
                  </div>
                ) : (
                  "Load More Problems"
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyProblems;
