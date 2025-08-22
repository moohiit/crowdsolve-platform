import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setLoading, setError } from '../../features/auth/authSlice';
import { createComment } from '../../services/solutionService';

const CommentForm = ({ solutionId, isAuthenticated, onSubmit }) => {
  const { loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [text, setText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      onSubmit(solutionId);
      return;
    }
    dispatch(setLoading(true));
    try {
      await createComment(solutionId, { text });
      setText('');
    } catch (err) {
      dispatch(setError(err.response?.data?.message || 'Failed to comment'));
    }
    dispatch(setLoading(false));
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add comment"
        className="w-full mb-2 p-1 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-green-500 text-white p-1 text-sm rounded hover:bg-green-600 disabled:opacity-50"
      >
        {loading ? 'Commenting...' : 'Comment'}
      </button>
    </form>
  );
};

export default CommentForm;