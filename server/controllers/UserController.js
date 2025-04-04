import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { UserModel } from "../models/index.js";

// Register User
export const registration = async (req, res) => {
  let { email, password } = req.body;

  try {
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      res.status(404).json({
        message: "This email has already been used",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: email,
      passwordHash: passwordHash,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRE,
      }
    );

    const { ...userData } = user._doc;

    res.status(200).json({
      token,
      ...userData,
    });
  } catch (error) {
    console.log("Register user error: " + error);
    res.status(500).json({
      message: "Register user error",
      error,
    });
  }
};

// Login User
export const login = async (req, res) => {
  let { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isValidPass = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPass) {
      return res.status(400).json({
        message: "Invalid login or password",
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRE,
      }
    );

    const { ...userData } = user._doc;

    res.status(200).json({
      token,
      ...userData,
    });
  } catch (error) {
    console.log("Login user error: " + error);
    res.status(500).json({
      message: "Login user error",
      error,
    });
  }
};

// Update User Profile
export const updateUserById = async (req, res) => {
  const id = req.params.id;

  let { password, newPassword } = req.body;

  try {
    const user = await UserModel.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isValidPass = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPass) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    user.passwordHash = passwordHash;

    await user.save();

    res.status(200).json({
      message: "Update user is success",
    });
  } catch (error) {
    console.log("Update user error: " + error);
    res.status(500).json({
      message: "Update user error",
      error,
    });
  }
};

// Get User Details
export const getUserById = async (req, res) => {
  let { id } = req.body;

  try {
    const user = await UserModel.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User with this id does not exist",
      });
    }

    const { ...userData } = user._doc;

    res.status(200).json({
      userData,
    });
  } catch (error) {
    console.log("Get user details error: " + error);
    res.status(500).json({
      message: "Get user details error",
      error,
    });
  }
};

// TODO Reset user password
export const resetPassword = async (req, res) => {};

// Get All Users --ADMIN
export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find().exec();

    res.status(200).json({
      users,
    });
  } catch (error) {
    console.log("Get all users error: " + error);
    res.status(500).json({
      message: "Get all users error",
      error,
    });
  }
};
