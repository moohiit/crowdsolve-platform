import Problem from "../models/Problem.js";
import Joi from "joi";
import Solution from "../models/Solution.js";

const problemSchema = Joi.object({
  title: Joi.string().min(3).required(),
  description: Joi.string().min(10).required(),
  location: Joi.string().required(),
});

export const createProblem = async (req, res, next) => {
  try {
    const { error } = problemSchema.validate(req.body);
    if (error)
      return res.status(400).json({ success:false, message: error.details[0].message });

    const { title, description, location } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const problem = new Problem({
      user: req.user._id, // From auth middleware
      title,
      description,
      location,
      imageUrl,
    });
    await problem.save();

    res.status(201).json({ success:true, problem });
  } catch (err) {
    next(err);
  }
};

export const getProblems = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const problems = await Problem.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "name");
    const total = await Problem.countDocuments();
    res.status(200).json({ success:true, problems, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

export const getProblem = async (req, res, next) => {
  try {
    const problem = await Problem.findById(req.params.id).populate(
      "user",
      "name"
    );
    if (!problem) return res
      .status(404)
      .json({ success: false, message: "Problem not found" });
    res.status(200).json({ success: true, problem });
  } catch (err) {
    next(err);
  }
};

export const getUserProblems = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const problems = await Problem.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "name");
    
    const total = await Problem.countDocuments({ user: req.user._id });
    
    res.status(200).json({ 
      success: true, 
      problems, 
      total, 
      page, 
      pages: Math.ceil(total / limit) 
    });
  } catch (err) {
    next(err);
  }
};

// controllers/problemController.js
export const deleteProblem = async (req, res, next) => {
  try {
    const problem = await Problem.findById(req.params.id);
    
    if (!problem) {
      return res.status(404).json({ success: false, message: "Problem not found" });
    }
    
    // Check if the user owns the problem
    if (problem.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this problem" });
    }
    
    // Delete associated solutions and comments
    await Solution.deleteMany({ problem: problem._id });
    
    // Delete the problem
    await Problem.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ success: true, message: "Problem deleted successfully" });
  } catch (err) {
    next(err);
  }
};