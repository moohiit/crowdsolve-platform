import Solution from "../models/Solution.js";
import Comment from "../models/Comment.js";
import Joi from "joi";

const solutionSchema = Joi.object({
  description: Joi.string().min(10).required(),
});

const commentSchema = Joi.object({
  text: Joi.string().min(5).required(),
});

export const createSolution = async (req, res, next) => {
  try {
    const { error } = solutionSchema.validate(req.body);
    if (error)
      return res.status(400).json({ success:false, message: error.details[0].message });

    const { description } = req.body;
    const solution = new Solution({
      problem: req.params.problemId,
      user: req.user._id,
      description,
    });
    await solution.save();

    res.status(201).json({success:true, solution});
  } catch (err) {
    next(err);
  }
};

export const upvoteSolution = async (req, res, next) => {
  try {
    const solution = await Solution.findById(req.params.id);
    if (!solution)
      return res.status(404).json({ success:false, message: "Solution not found" });

    const userId = req.user._id;
    if (solution.upvotes.includes(userId)) {
      solution.upvotes = solution.upvotes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      solution.upvotes.push(userId);
    }
    await solution.save();

    res.status(200).json({success:true, solution});
  } catch (err) {
    next(err);
  }
};

export const createComment = async (req, res, next) => {
  try {
    const { error } = commentSchema.validate(req.body);
    if (error)
      return res.status(400).json({ success:false, message: error.details[0].message });

    const { text } = req.body;
    const comment = new Comment({
      solution: req.params.solutionId,
      user: req.user._id,
      text,
    });
    await comment.save();

    res.status(201).json({success:true, comment});
  } catch (err) {
    next(err);
  }
};

export const getSolutions = async (req, res, next) => {
  try {
    const solutions = await Solution.find({ problem: req.params.problemId })
      .populate("user", "name")
      .sort({ "upvotes.length": -1 }); // Sort by upvotes descending
    res.status(200).json({success:true,solutions});
  } catch (err) {
    next(err);
  }
};

export const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({
      solution: req.params.solutionId,
    }).populate("user", "name");
    res.status(200).json({success:true,comments});
  } catch (err) {
    next(err);
  }
};
