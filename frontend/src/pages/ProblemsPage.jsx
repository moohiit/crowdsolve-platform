import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProblems } from "../store/slices/problemSlice";
import { Link } from "react-router-dom";

export default function ProblemsPage() {
  const dispatch = useDispatch();
  const { list } = useSelector((s) => s.problems);

  useEffect(() => {
    dispatch(fetchProblems());
  }, [dispatch]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">All Problems</h1>
      {list.map((p) => (
        <div key={p._id} className="border p-3 mb-3 rounded">
          <h2 className="font-semibold">{p.title}</h2>
          <p>{p.description}</p>
          <Link to={`/problems/${p._id}`} className="text-blue-500">View Details</Link>
        </div>
      ))}
    </div>
  );
}
