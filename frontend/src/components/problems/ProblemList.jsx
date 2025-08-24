// components/problems/ProblemList.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { setProblems, startLoading, setError } from '../../store/slices/problemSlice';

const ProblemList = () => {
  const dispatch = useDispatch();
  const { problems, loading, error } = useSelector(state => state.problems);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchProblems();
  }, [page]);

  const fetchProblems = async () => {
    dispatch(startLoading());
    try {
      const response = await fetch(
        `/api/problems?page=${page}&limit=10`
      );
      const data = await response.json();

      if (data.success) {
        if (page === 1) {
          dispatch(setProblems(data.problems));
        } else {
          dispatch(setProblems([...problems, ...data.problems]));
        }
        setHasMore(data.page < data.pages);
      } else {
        dispatch(setError('Failed to fetch problems'));
      }
    } catch (error) {
      dispatch(setError('Network error. Please try again.'));
    }
  };

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  if (loading && problems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 mt-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Community Problems</h1>
        <Link to="/create-problem" className="btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Report Problem
        </Link>
      </div>

      {problems.length === 0 ? (
        <div className="card text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-medium text-white mb-2">No problems reported yet</h3>
          <p className="text-gray-400 mb-6">Be the first to report a community problem</p>
          <Link to="/create-problem" className="btn-primary">
            Report First Problem
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {problems.map(problem => (
              <div key={problem._id} className="card group hover:border-primary-500/30 transition-all duration-300 animate-slide-up">
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
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors">{problem.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {problem.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
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
                <div className="mt-4 pt-4 border-t border-dark-700/50 space-x-2">
                  <Link
                    to={`/problems/${problem._id}`}
                    className="btn-secondary w-full text-center block"
                  >
                    View Details & Solutions
                  </Link>
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
                  'Load More Problems'
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProblemList;