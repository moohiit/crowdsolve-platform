// components/problems/ProblemDetail.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { setProblem, setSolutions, startLoading, setError } from '../../store/slices/problemSlice';
import SolutionList from '../solutions/SolutionList';
import CreateSolution from '../solutions/CreateSolution';

const ProblemDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentProblem, solutions, loading, error } = useSelector(state => state.problems);
  const { isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    fetchProblem();
    fetchSolutions();
  }, [id]);

  const fetchProblem = async () => {
    dispatch(startLoading());
    try {
      const response = await fetch(`http://localhost:5000/api/problems/${id}`);
      const data = await response.json();
      
      if (data.success) {
        dispatch(setProblem(data.problem));
      } else {
        dispatch(setError('Problem not found'));
      }
    } catch (error) {
      dispatch(setError('Network error. Please try again.'));
    }
  };

  const fetchSolutions = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/solutions/${id}`);
      const data = await response.json();
      
      if (data.success) {
        dispatch(setSolutions(data.solutions));
      }
    } catch (error) {
      console.error('Failed to fetch solutions:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center mt-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 mt-16">
        <div className="bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-lg text-sm mb-4">
          {error}
        </div>
        <Link to="/problems" className="btn-primary">
          Back to Problems
        </Link>
      </div>
    );
  }

  if (!currentProblem) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 mt-16">
      <Link to="/problems" className="inline-flex items-center text-primary-500 hover:text-primary-400 mb-6 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Problems
      </Link>
      
      <div className="card mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-white">{currentProblem.title}</h1>
          <span className="text-sm text-gray-400">
            {new Date(currentProblem.createdAt).toLocaleDateString()}
          </span>
        </div>
        
        <div className="flex items-center text-sm text-gray-400 mb-6">
          <div className="flex items-center mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {currentProblem.user?.name}
          </div>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {currentProblem.location}
          </div>
        </div>
        
        {currentProblem.imageUrl && (
          <div className="mb-6 rounded-lg overflow-hidden">
            <img 
              src={`http://localhost:5000${currentProblem.imageUrl}`} 
              alt={currentProblem.title}
              className="w-full h-64 object-cover"
            />
          </div>
        )}
        
        <div className="prose prose-invert max-w-none">
          <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
          <p className="text-gray-300 whitespace-pre-wrap">{currentProblem.description}</p>
        </div>
      </div>
      
      <div className="card">
        <h2 className="text-xl font-bold text-white mb-6">Suggested Solutions ({solutions.length})</h2>
        
        {isAuthenticated ? (
          <CreateSolution problemId={id} onSolutionAdded={fetchSolutions} />
        ) : (
          <div className="bg-dark-700/50 rounded-lg p-4 mb-6 text-center">
            <p className="text-gray-300">
              <Link to="/login" state={{ from: { pathname: `/problems/${id}` } }} className="text-primary-500 hover:text-primary-400 font-medium">
                Login
              </Link> to suggest a solution
            </p>
          </div>
        )}
        
        <SolutionList solutions={solutions} problemId={id} />
      </div>
    </div>
  );
};

export default ProblemDetail;