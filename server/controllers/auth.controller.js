const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const register = asyncHandler(async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(401).json("User is already registered.");
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    const access_token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res
      .status(200)
      .cookie("access_token", access_token, {
        httpOnly: true,
        expires: new Date(Date.now() + 3600000),
      })
      .json({
        success: true,
        access_token,
        user,
      });
  } catch (error) {
    res.status(500).json(error);
  }
});

const login = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json("You are not registered.");
    }

    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      return res.status(401).json("Invalid Credentials.");
    }

    const access_token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res
      .status(200)
      .cookie("access_token", access_token, {
        httpOnly: true,
        expires: new Date(Date.now() + 3600000),
      })
      .json({
        success: true,
        access_token,
        user,
      });
  } catch (error) {
    res.status(500).json(error);
  }
});

const checkAuth = asyncHandler(async (req, res) => {
  try {
    if (req.user) {
      res.json(req.user);
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

const logout = asyncHandler(async (req, res) => {
  try {
    res
      .status(200)
      .cookie("access_token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      })
      .json({
        success: true,
      });
  } catch (error) {
    res.status(500).json(error);
  }
});


module.exports = { register, login, checkAuth, logout };
