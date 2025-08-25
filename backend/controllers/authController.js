import User from "../models/User.js";
import { generateToken } from "../utils/jwtUtils.js";
import Joi from "joi";

const signupSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const signup = async (req, res, next) => {
  try {
    const { error } = signupSchema.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });

    const { name, email, password, role } = req.body;
    let user = await User.findOne({ email });
    if (user) return res
      .status(400)
      .json({ success: false, message: "User already exists" });

    user = new User({ name, email, password, role });
    await user.save();

    const token = generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000, // 1 hour
    });

    res
      .status(201)
      .json({
        success: true,
        message: "User created",
        token,
        user: { id: user._id, name, email, role },
      });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success:false, message: "Invalid credentials" });
    }

    const token = generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000,
    });

    res.status(200).json({
      success:true,
      message: "Logged in",
      token,
      user: { id: user._id, name: user.name, email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};

export const logout = (req, res, next) => {
  try {
    res.clearCookie("token");
    res.json({ success: false, message: "Logged out" });
  } catch (error) {
    next(error);
  }
};

export const getMe = (req, res, next) => {
  try {
    res.status(200).json({ success: true, user: req.user });
  } catch (error) {
    next(error);
  }
};
