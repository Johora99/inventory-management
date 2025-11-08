const { body, param } = require("express-validator");
const User = require("../models/user"); 

const registerStartValidation = [
  body("fullName")
    .notEmpty()
    .withMessage("Full Name is required")
    .isLength({ min: 2 })
    .withMessage("Full Name must be at least 2 characters long"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .custom(async (email) => {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser.isBlocked) {
        throw new Error("This user is blocked and cannot register");
      }
      return true;
    }),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

// google login =============================
const googleLoginValidation = [
  body("fullName")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Must be a valid email")
    .custom(async (email) => {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser.isBlocked) {
        throw new Error("This user is blocked and cannot login");
      }
      return true;
    }),
];

const userValidation = [
  param("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
];

const loginValidation = [
  body("email").notEmpty().isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

module.exports = {
  registerStartValidation,
  googleLoginValidation,
  loginValidation,
  userValidation,
};
