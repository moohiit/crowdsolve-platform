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
    const { path, filename } = req.file;
    const image = {
      url: path, // secure_url from Cloudinary
      public_id: filename,
    };

    const problem = new Problem({
      user: req.user._id, // From auth middleware
      title,
      description,
      location,
      image,
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

    // Get problems with user info
    const problems = await Problem.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "name");

    // Get problem IDs
    const problemIds = problems.map((p) => p._id);

    // Get solutions count
    const solutionsCounts = await Solution.aggregate([
      { $match: { problem: { $in: problemIds } } },
      { $group: { _id: "$problem", count: { $sum: 1 } } }
    ]);

    // Get upvotes count
    const upvotesCounts = await Solution.aggregate([
      { $match: { problem: { $in: problemIds } } },
      { 
        $project: { 
          problem: 1, 
          upvotesCount: { $size: { $ifNull: ["$upvotes", []] } } 
        } 
      },
      { $group: { _id: "$problem", totalUpvotes: { $sum: "$upvotesCount" } } }
    ]);

    // Create maps
    const solutionsCountMap = {};
    solutionsCounts.forEach(item => {
      solutionsCountMap[item._id.toString()] = item.count;
    });

    const upvotesCountMap = {};
    upvotesCounts.forEach(item => {
      upvotesCountMap[item._id.toString()] = item.totalUpvotes;
    });

    // Add counts
    const problemsWithCounts = problems.map((problem) => {
      return {
        ...problem.toObject(),
        solutionsCount: solutionsCountMap[problem._id.toString()] || 0,
        totalUpvotes: upvotesCountMap[problem._id.toString()] || 0,
      };
    });

    const total = await Problem.countDocuments();

    res.status(200).json({
      success: true,
      problems: problemsWithCounts,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
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

    // Get problems with user info
    const problems = await Problem.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "name");
    
    // Get problem IDs
    const problemIds = problems.map(problem => problem._id);
    
    // Get solutions count for all problems in one query
    const solutionsCounts = await Solution.aggregate([
      { $match: { problem: { $in: problemIds } } },
      { $group: { _id: "$problem", count: { $sum: 1 } } }
    ]);
    
    // Get total upvotes for all problems in one query
    const upvotesCounts = await Solution.aggregate([
      { $match: { problem: { $in: problemIds } } },
      { $project: { problem: 1, upvotesCount: { $size: { $ifNull: ["$upvotes", []] } } } },
      { $group: { _id: "$problem", totalUpvotes: { $sum: "$upvotesCount" } } }
    ]);
    
    // Create maps for easy lookup
    const solutionsCountMap = {};
    solutionsCounts.forEach(item => {
      solutionsCountMap[item._id.toString()] = item.count;
    });
    
    const upvotesCountMap = {};
    upvotesCounts.forEach(item => {
      upvotesCountMap[item._id.toString()] = item.totalUpvotes;
    });
    
    // Add counts to problems
    const problemsWithCounts = problems.map(problem => {
      return {
        ...problem.toObject(),
        solutionsCount: solutionsCountMap[problem._id.toString()] || 0,
        totalUpvotes: upvotesCountMap[problem._id.toString()] || 0
      };
    });
    
    const total = await Problem.countDocuments({ user: req.user._id });
    
    res.status(200).json({ 
      success: true, 
      problems: problemsWithCounts, 
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