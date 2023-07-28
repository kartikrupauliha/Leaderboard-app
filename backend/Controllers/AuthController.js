const User = require("../models/user.model");
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcryptjs");

module.exports.Signup = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ message: "User already exists" });
    }
    const user = await User.create({ email, password, name, isAdmin: false });
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    res.cookie("isAdmin", false, {
      withCredentials: true,
      httpOnly: false,
    });
    res.cookie("id", user._id, {
      withCredentials: true,
      httpOnly: false,
    });
    res.cookie("userEmail", email, {
      withCredentials: true,
      httpOnly: false,
    });
    res
      .status(201)
      .json({ message: "User signed in successfully", success: true, user, isAdmin:false, userEmail:email, userName:name, token });
    next();
  } catch (error) {
    console.error(error);
  }
};

module.exports.Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "Incorrect password or email" });
    }
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.json({ message: "Incorrect password or email" });
    }
    const isAdmin = user.isAdmin;
    const userName = user.name;
    const userEmail = user.email;
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    res.cookie("userEmail", userEmail, {
      withCredentials: true,
      httpOnly: false,
    });
    res.cookie("id", user._id, {
      withCredentials: true,
      httpOnly: false,
    });
    res.cookie("isAdmin", isAdmin, {
      withCredentials: true,
      httpOnly: false,
    });
    res.status(201).json({
      message: "User logged in successfully",
      token,
      userName,
      userEmail,
      isAdmin,
      success: true,
    });
    next();
  } catch (error) {
    console.error(error);
  }
};
