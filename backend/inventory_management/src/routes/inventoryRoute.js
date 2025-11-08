const express = require("express");
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const validate = require("../Validators/inventoryValidator")
const validateRequest = require('../middlewares/validateRequest')
const ctrl = require("../Controllers/inventoryController");
const {userValidation} = require("../Validators/authValidator")
const { upload } = require("../config/cloudinary");
const parseInventoryFields = require('../middlewares/parseInventoryFields');
router.get(
  '/tags/suggest', 
  validate.suggestValidation, 
  validateRequest,
  auth,
  ctrl.suggestTags
);

  router.get(
    '/users/suggest',
     validate.suggestValidation,
     validateRequest,
     auth, 
     ctrl.suggestUsers
    );
  router.post(
    '/draft',
    auth,
    upload.single('image'), 
    parseInventoryFields,
     validate.inventoryValidation, 
     validateRequest,
     ctrl.saveDraftInventory
    );
  router.post(
  '/createInventories',
  auth,                               
  upload.single('image'),
  parseInventoryFields,
  validate.inventoryValidation,
  validateRequest,
  ctrl.createInventory
);

router.get("/access", auth, validateRequest, ctrl.getAccessInventories);
router.get("/my-inventories", auth, validateRequest, ctrl.getUserInventories);
router.get("/all-inventories", validateRequest, ctrl.getAllInventories);
router.delete('/inventory/:id', auth, validateRequest, ctrl.deleteInventory);
router.patch("/edit/:id", auth, upload.single('image'), validateRequest, ctrl.editInventories);
module.exports = router;