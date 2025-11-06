const express = require("express");
const router = express.Router();
const validate = require('../Validators/authValidator')
const validateRequest = require('../middlewares/validateRequest')
const ctrl = require('../Controllers/authController')
const auth = require("../middlewares/authMiddleware");
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

router.get(
  "/user/byEmail/:email",
  validate.userValidation,
  validateRequest,
  auth,
  ctrl.getUserByEmail
);

router.get("/allUsers", auth, validateRequest, ctrl.getAllUsers);
router.delete("/deleteUser/:id",auth, validateRequest, ctrl.deleteUser);
router.put("/role/:id",auth, validateRequest, ctrl.updateUserRole);
module.exports = router;