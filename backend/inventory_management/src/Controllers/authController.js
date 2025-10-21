const jwt = require("jsonwebtoken");
const User = require('../models/user')
const bcrypt = require("bcryptjs");
const register = async (req, res, next) => {
  console.log(req.body)
  try {
    const { fullName, email, password } = req.body;

    // Check if verified user already exists
    const existingVerified = await User.findOne({ email});
    if (existingVerified) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);
    // Create user
    const newUser = await User.create({
      fullName,
      email,
      password: hashed,
      role: "user",
      isGoogleUser: false,
    });

    // Generate JWT
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const { password: _, ...userSafe } = newUser.toObject();

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      data: { user: userSafe, token },
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const u = await User.findOne({ email });
    if (!u)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });

    const ok = await require("bcryptjs").compare(password, u.password);
    if (!ok)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ id: u._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    const { password: _, ...userSafe } = u.toObject();
    res.json({
      success: true,
      message: "Login successful",
      data: { user: userSafe, token },
    });
  } catch (e) {
    next(e);
  }
};
module.exports = {
  register,
  login,
}