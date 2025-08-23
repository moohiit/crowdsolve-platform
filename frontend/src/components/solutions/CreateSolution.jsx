// components/solutions/CreateSolution.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addSolution, setError, clearError } from '../../store/slices/problemSlice';

const CreateSolution = ({ problemId, onSolutionAdded }) => {
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const dispatch = useDispatch();
  const { error } = useSelector(state => state.problems);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    dispatch(clearError());
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:5000/api/solutions/${problemId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ description }),
          credentials: 'include',
        }
      );
      
      const data = await response.json();
      
      if (data.success) {
        dispatch(addSolution(data.solution));
        setDescription('');
        if (onSolutionAdded) {
          onSolutionAdded();
        }
      } else {
        dispatch(setError(data.message));
      }
    } catch (error) {
      dispatch(setError('Failed to submit solution. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div className="mb-8">
      <h4 className="text-lg font-semibold text-white mb-4">Suggest a Solution</h4>
      
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your solution in detail..."
            rows="4"
            className="form-input"
            required
          ></textarea>
        </div>
        <button 
          type="submit" 
          disabled={submitting}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Submitting...
            </div>
          ) : (
            'Submit Solution'
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateSolution;