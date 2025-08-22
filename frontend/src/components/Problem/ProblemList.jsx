import { Link } from 'react-router-dom';

const ProblemList = ({ problems }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {problems.map((problem) => (
        <div key={problem._id} className="bg-white p-4 rounded shadow">
          <h2 className="font-bold">{problem.title}</h2>
          <p>{problem.description.substring(0, 100)}...</p>
          <p className="text-sm">Location: {problem.location}</p>
          {problem.imageUrl && <img src={`${process.env.REACT_APP_API_URL}${problem.imageUrl}`} alt="Problem" className="w-full h-32 object-cover" />}
          <Link to={`/problems/${problem._id}`} className="text-blue-500">View Details</Link>
        </div>
      ))}
    </div>
  );
};

export default ProblemList;