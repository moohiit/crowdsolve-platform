import { useState } from 'react';
import { useSelector } from 'react-redux';

const SolutionForm = ({ problemId, onSuccess }) => {
  const { loading, error } = useSelector((state) => state.auth);
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSuccess({ description });
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Suggest a solution"
        className="w-full mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Suggest Solution'}
      </button>
    </form>
  );
};

export default SolutionForm;