// components/solutions/SolutionList.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import SolutionItem from './SolutionItem';

const SolutionList = ({ solutions, problemId }) => {
  const { loading } = useSelector(state => state.problems);
  
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  if (solutions.length === 0) {
    return (
      <div className="bg-dark-700/30 rounded-lg p-8 text-center border border-dashed border-dark-600/50">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        <h3 className="text-lg font-medium text-gray-400 mb-2">No solutions yet</h3>
        <p className="text-gray-500">Be the first to suggest a solution to this problem</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {solutions.map(solution => (
        <SolutionItem 
          key={solution._id} 
          solution={solution} 
          problemId={problemId}
        />
      ))}
    </div>
  );
};

export default SolutionList;