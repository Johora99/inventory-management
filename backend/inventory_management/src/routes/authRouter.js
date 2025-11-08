const express = require("express");
const router = express.Router();
const validate = require('../Validators/authValidator')
const validateRequest = require('../middlewares/validateRequest')
const ctrl = require('../Controllers/authController')
const auth = require("../middlewares/authMiddleware");
const { validationResult } = require("express-validator");
const verifyAdmin = require("../middlewares/verifyAdmin")
// Public routes
router.post(
  "/register",
  validate.registerStartValidation,
  validateRequest,
  ctrl.register
);
router.post(
  "/register/google",
  validate.googleLoginValidation,
  validateRequest,
  ctrl.googleAuth
);
router.post(
  "/login", 
  validate.loginValidation, 
  validateRequest, 
  ctrl.login);

router.get(
  "/user/byEmail/:email",
  validate.userValidation,
  validateRequest,
  auth,
  ctrl.getUserByEmail
);

router.get("/allUsers", auth, validateRequest, ctrl.getAllUsers);
router.delete("/deleteUser/:id",auth, validateRequest, verifyAdmin, ctrl.deleteUser);
router.put("/role/:id",auth, validateRequest, verifyAdmin, ctrl.updateUserRole);
router.patch("/block/:id", auth,validateRequest, verifyAdmin, ctrl.blockUser);
router.patch("/unblock/:id", auth, validateRequest, verifyAdmin, ctrl.unblockUser);
module.exports = router;