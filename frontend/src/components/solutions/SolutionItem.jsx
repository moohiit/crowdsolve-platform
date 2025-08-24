// components/solutions/SolutionItem.jsx
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateSolutionUpvotes } from '../../store/slices/problemSlice';
import CommentList from './CommentList';

const SolutionItem = ({ solution, problemId }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [submittingUpvote, setSubmittingUpvote] = useState(false);
  
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  
  const handleUpvote = async () => {
    if (!isAuthenticated) {
      alert('Please login to upvote solutions');
      return;
    }
    
    setSubmittingUpvote(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `/api/solutions/${solution._id}/upvote`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
        }
      );
      
      const data = await response.json();
      
      if (data.success) {
        dispatch(updateSolutionUpvotes({
          solutionId: solution._id,
          upvotes: data.solution.upvotes,
        }));
      }
    } catch (error) {
      console.error('Failed to upvote:', error);
    } finally {
      setSubmittingUpvote(false);
    }
  };
  
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    setSubmittingComment(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `/api/solutions/${solution._id}/comments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ text: commentText }),
          credentials: 'include',
        }
      );
      
      const data = await response.json();
      
      if (data.success) {
        setCommentText('');
        // Refresh comments by toggling visibility
        setShowComments(false);
        setTimeout(() => setShowComments(true), 100);
      }
    } catch (error) {
      console.error('Failed to submit comment:', error);
    } finally {
      setSubmittingComment(false);
    }
  };
  
  const isUpvoted = user && solution.upvotes.includes(user.id);
  
  return (
    <div className="bg-dark-700/30 rounded-lg p-4 mb-4 border border-dark-600/30">
      <div className="mb-3">
        <p className="text-gray-300 whitespace-pre-wrap">{solution.description}</p>
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
        <div className="flex items-center">
          <span className="w-6 h-6 bg-primary-500/10 rounded-full flex items-center justify-center text-primary-400 text-xs mr-2">
            {solution.user?.name?.charAt(0).toUpperCase()}
          </span>
          By {solution.user?.name}
        </div>
        <span>{new Date(solution.createdAt).toLocaleDateString()}</span>
      </div>
      
      <div className="flex items-center space-x-3">
        <button 
          onClick={handleUpvote} 
          disabled={submittingUpvote}
          className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm transition-colors ${
            isUpvoted 
              ? 'bg-primary-500/20 text-primary-400' 
              : 'bg-dark-600/50 text-gray-400 hover:bg-dark-600'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
          <span>{solution.upvotes.length}</span>
        </button>
        
        <button 
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-1 px-3 py-1 rounded-full bg-dark-600/50 text-gray-400 hover:bg-dark-600 text-sm transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span>{showComments ? 'Hide Comments' : 'Show Comments'}</span>
        </button>
      </div>
      
      {showComments && (
        <div className="mt-4 pt-4 border-t border-dark-600/30">
          <CommentList solutionId={solution._id} />
          
          {isAuthenticated ? (
            <form onSubmit={handleCommentSubmit} className="mt-4">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                rows="2"
                className="form-input text-sm"
                required
              ></textarea>
              <button 
                type="submit" 
                disabled={submittingComment}
                className="btn-warning mt-2 text-sm py-1 px-3"
              >
                {submittingComment ? 'Posting...' : 'Post Comment'}
              </button>
            </form>
          ) : ( <>
            <p className="text-gray-400 text-sm mt-4 text-center mb-2">
              <a href="/login" className="text-primary-500 hover:text-primary-400 btn-warning">
                Login
                </a>
              </p>
              <p className='text-gray-400 text-sm mt-4 text-center mb-2'>to comment on this solution</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SolutionItem;