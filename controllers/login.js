const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const User = require("../models/user_model");
const dotenv = require("dotenv");
const e = require("express");
dotenv.config();


exports.login = async (req, res, next) => {

const { email, password } = req.body;

try {
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error("A user with this email could not be found!");
    error.statusCode = 401;
    res.status(401).json({status:"fail", message: "user not found!" });
  }

  // if (user.roles === "INSTRUCTOR" && !user.isApproved) {
  //   const error = new Error("Instructor not approved yet by admin.");
  //   error.statusCode = 403;
  //   throw error;
  // }
  if (!email || !password) {
    return res.status(400).json({ status: "fail", message: "Please provide email and password" });
  }

  // const isMatch = await bcrypt.compare(password, user.password);
  // if (!isMatch) {
  //   const error = new Error("Wrong password!");
  //   error.statusCode = 401;
  //   throw error;
  // }
  const isMatch = password === user.password; // For demonstration purposes only
  if (!isMatch) {
    const error = new Error("Wrong password!");
    error.statusCode = 401;
    res.status(401).json({status:"fail", message: "Wrong password!" });
  }

  const token = jwt.sign(
    {
      email: user.email,
      userId: user._id.toString(),
      role: user.roles,
    },
    process.env.SECRET,
    { expiresIn: "1h" }
  );

  res.status(200).json({
    status: "success",
    token,
    userId: user._id.toString(),
  });
} catch (err) {
  if (!err.statusCode) err.statusCode = 500;
  next(err);
}
};



