// components/solutions/CommentList.jsx
import React, { useEffect, useState } from 'react';

const CommentList = ({ solutionId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchComments();
  }, [solutionId]);
  
  const fetchComments = async () => {
    try {
      const response = await fetch(
        `/api/solutions/${solutionId}/comments`
      );
      const data = await response.json();
      
      if (data.success) {
        setComments(data.comments);
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  if (comments.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500 text-sm">
        No comments yet.
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      {comments.map(comment => (
        <div key={comment._id} className="bg-dark-700/20 rounded-lg p-3 border border-dark-600/30">
          <p className="text-gray-300 text-sm">{comment.text}</p>
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <span>By {comment.user?.name}</span>
            <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentList;