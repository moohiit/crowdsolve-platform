import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchProblemById, addSolution, addComment, upvoteSolution } from "../store/slices/problemSlice";
import { useAuthAction } from "../utils/withAuthAction";

export default function ProblemPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { current } = useSelector((s) => s.problems);
  const requireAuth = useAuthAction();

  const [solutionText, setSolutionText] = useState("");
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    dispatch(fetchProblemById(id));
  }, [dispatch, id]);

  const handleAddSolution = () => {
    requireAuth(() => {
      dispatch(addSolution({ id, data: { text: solutionText } }));
      setSolutionText("");
    });
  };

  const handleAddComment = (solutionId) => {
    requireAuth(() => {
      dispatch(addComment({ id: solutionId, data: { text: commentText } }));
      setCommentText("");
    });
  };

  const handleUpvote = (solutionId) => {
    requireAuth(() => {
      dispatch(upvoteSolution(solutionId));
    });
  };

  if (!current) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{current.title}</h1>
      <p>{current.description}</p>

      <h2 className="text-lg font-semibold mt-6">Solutions</h2>
      {current.solutions.map((s) => (
        <div key={s._id} className="border p-3 mt-3 rounded">
          <p>{s.text}</p>
          <button onClick={() => handleUpvote(s._id)}>👍 {s.upvotes}</button>

          <div className="mt-2">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add comment"
              className="border p-1 mr-2"
            />
            <button onClick={() => handleAddComment(s._id)}>Comment</button>
          </div>

          <div className="ml-4 mt-2">
            {s.comments.map((c) => (
              <p key={c._id}>💬 {c.text}</p>
            ))}
          </div>
        </div>
      ))}

      <div className="mt-6">
        <textarea
          value={solutionText}
          onChange={(e) => setSolutionText(e.target.value)}
          placeholder="Write your solution"
          className="border w-full p-2"
        />
        <button onClick={handleAddSolution} className="mt-2">Submit Solution</button>
      </div>
    </div>
  );
}
