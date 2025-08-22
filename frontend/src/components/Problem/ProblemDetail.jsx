const ProblemDetail = ({ problem }) => {
  return (
    <div className="bg-white p-6 rounded shadow">
      <h1 className="font-bold text-2xl">{problem.title}</h1>
      <p>{problem.description}</p>
      <p>Location: {problem.location}</p>
      {problem.imageUrl && <img src={`${process.env.REACT_APP_API_URL}${problem.imageUrl}`} alt="Problem" className="w-full h-64 object-cover" />}
      <p>Posted by: {problem.user.name}</p>
    </div>
  );
};

export default ProblemDetail;