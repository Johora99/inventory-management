const jwt = require("jsonwebtoken");
const User = require('../models/user')
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");

const register = async (req, res, next) => {
  try {
    await connectDB();
    const { fullName, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.isBlocked) {
        return res.status(403).json({
          success: false,
          message: "This user is blocked and cannot register",
        });
      }
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      fullName,
      email,
      password: hashed,
      role: "user",
      isGoogleUser: false,
      isBlocked: false, // ensure default blocked status
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


const googleAuth = async (req, res, next) => {
  try {
    const { email, fullName } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Check if user exists
    let user = await User.findOne({ email });

    if (user && user.isBlocked) {
      // Blocked user cannot login/register
      return res.status(403).json({
        success: false,
        message: "This user is blocked and cannot login",
      });
    }

    if (!user) {
      // If user does not exist → create new Google user
      const payload = {
        email,
        fullName,
        role: "user",
        isGoogleUser: true,
        isBlocked: false, // default to not blocked
      };

      user = await User.create(payload);

      // Generate JWT
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      const { password: _, ...userSafe } = user.toObject();

      return res.status(201).json({
        success: true,
        message: "Registration successful",
        data: { user: userSafe, token },
      });
    }

    // Existing, unblocked user → login
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const { password: _, ...userSafe } = user.toObject();

    return res.status(200).json({
      success: true,
      message: "Google login successful",
      data: { user: userSafe, token },
    });
  } catch (err) {
    next(err);
  }
};



const login = async (req, res, next) => {
  try {
     await connectDB();
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

//  get user my email -------------------------------------
const getUserByEmail = async (req, res, next) => {
  try {
     await connectDB();
    const { email } = req.params;

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Exclude password from response
    const { password, ...userSafe } = user.toObject();

    res.json({
      success: true,
      message: "User retrieved successfully",
      data: userSafe,
    });
  } catch (error) {
    next(error);
  }
};


 const getAllUsers = async (req, res) => {
  try {
     await connectDB();
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch users", error });
  }
};
// 🔒 Block user
 const blockUser = async (req, res) => {
  try {
    await connectDB();
    const userId = req.params.id;

    const user = await User.findByIdAndUpdate(userId, { isBlocked: true }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ success: true, message: `${user.fullName} has been blocked.` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Unblock user
 const unblockUser = async (req, res) => {
  try {
    await connectDB();
    const userId = req.params.id;

    const user = await User.findByIdAndUpdate(userId, { isBlocked: false }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ success: true, message: `${user.fullName} has been unblocked.` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
 const deleteUser = async (req, res) => {
  try {
     await connectDB();
    const userId = req.params.id;

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: "User deleted successfully", deletedUser: user });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ success: false, message: "Failed to delete user", error });
  }
};
const updateUserRole = async (req, res) => {
  try {
     await connectDB();
    const { id } = req.params;
    const { role } = req.body; 
    if (!role) {
      return res.status(400).json({ success: false, message: "Role is required" });
    }
    const allowedRoles = ["user", "creator", "admin"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role specified" });
    }
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User role updated successfully",
      updatedUser,
    });
  } catch (error) {
    console.error("Update role error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user role",
      error: error.message,
    });
  }
};
// ❌ Remove Admin Role — even from themselves
 const removeAdmin = async (req, res) => {
  try {
    await connectDB();
    const userId = req.params.id;

    const user = await User.findByIdAndUpdate(userId, { role: "user" }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ success: true, message: `${user.fullName} is no longer an admin.` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  getUserByEmail,
  getAllUsers,
  deleteUser,
  updateUserRole,
  googleAuth,
  blockUser,
  unblockUser,
  removeAdmin,
}