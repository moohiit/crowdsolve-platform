import { useNavigate } from 'react-router-dom';
import CommentForm from './CommentForm';

const SolutionList = ({ solutions, onUpvote, isAuthenticated }) => {
  const navigate = useNavigate();

  const handleCommentClick = (solutionId) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: window.location.pathname } });
    }
  };

  return (
    <div className="mt-6">
      <h2 className="font-bold text-xl">Solutions</h2>
      {solutions.map((solution) => (
        <div key={solution._id} className="bg-gray-100 p-4 mb-4 rounded shadow hover:shadow-lg transition">
          <p>{solution.description}</p>
          <p className="text-sm">By: {solution.user.name}</p>
          <button
            onClick={() => onUpvote(solution._id)}
            className="text-blue-500 hover:underline mr-4"
          >
            Upvote ({solution.upvotes.length})
          </button>
          <CommentForm
            solutionId={solution._id}
            onSubmit={() => handleCommentClick(solution._id)}
            isAuthenticated={isAuthenticated}
          />
        </div>
      ))}
    </div>
  );
};

export default SolutionList;