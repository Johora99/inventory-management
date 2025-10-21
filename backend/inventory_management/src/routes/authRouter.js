const express = require("express");
const router = express.Router();
const validate = require('../Validators/authValidator')
const validateRequest = require('../middlewares/validateRequest')
const ctrl = require('../Controllers/authController')
// Public routes
router.post(
  "/register",
  validate.registerStartValidation,
  validateRequest,
  ctrl.register
);
router.post(
  "/login", 
  validate.loginValidation, 
  validateRequest, 
  ctrl.login);
module.exports = router;