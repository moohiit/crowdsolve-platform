import mongoose from "mongoose";

const solutionSchema = new mongoose.Schema({
  problem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Problem",
    required: true,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  description: { type: String, required: true },
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Array of users who upvoted
  createdAt: { type: Date, default: Date.now },
});

const Solution = mongoose.model("Solution", solutionSchema);

export default Solution;
