const Tag = require('../models/tag');
const User = require("../models/user");
const Inventory = require('../models/inventory');
const connectDB = require("../config/db");

const suggestTags = async (req, res) => {
  const { query } = req.query;
  try {
     await connectDB();
    const suggestions = await Tag.find({
      name: { $regex: `^${query}`, $options: 'i' },
    })
      .limit(5)
      .select('name');
    res.json(suggestions.map(tag => tag.name));
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const suggestUsers = async (req, res) => {
  const { query } = req.query;
  try {
     await connectDB();
    const suggestions = await User.find({
      $or: [
        { fullName: { $regex: `^${query}`, $options: 'i' } },
        { email: { $regex: `^${query}`, $options: 'i' } },
      ],
    })
      .limit(5)
      .select('fullName email');
    res.json(suggestions.map(user => ({ id: user.id, name: user.fullName, email: user.email })));
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const saveDraftInventory = async (req, res) => {
  const {
    id,
    title,
    description,
    category,
    tags,
    isPublic,
    accessUsers,
    customIdElements,
    customId,
    customFields,
    version,
  } = req.body;

  const data = {
    title,
    description,
    category,
    tags,
    isPublic,
    accessUsers,
    customIdElements,
    customId,
    customFields,
    createdBy: req.user._id,
    version: parseInt(version),
  };

  if (req.file) {
    data.imageUrl = req.file.path;
  }

  try {
     await connectDB();
    const user = await User.findById(req.user._id);
    if (!user) return res.status(400).json({ message: 'Invalid createdBy user' });
  for (const accessUser of data.accessUsers || []) {
  const u = await User.findById(accessUser.id); 
  if (!u) {
    return res.status(400).json({ message: `Invalid user ID: ${accessUser.id}` });
  }
  accessUser.user = u._id; 
  accessUser.name = u.fullName;
  accessUser.email = u.email;
  delete accessUser.id; 
}

    let inventory;
    if (id) {
      inventory = await Inventory.findOneAndUpdate(
        { _id: id, createdBy: req.user._id },
        { $set: { ...data, version: data.version + 1 } },
        { new: true }
      );

      if (!inventory) {
        return res.status(404).json({ message: 'Inventory not found for update' });
      }
    }
    else {
      data.version = 1;
      inventory = new Inventory(data);
      await inventory.save();
    }

    res.json({
      message: id ? 'Draft updated successfully' : 'Draft created successfully',
      id: inventory._id,
      version: inventory.version,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const createInventory = async (req, res) => {
  const { id, title, description, category, tags, isPublic, accessUsers, customIdElements,customId, customFields } = req.body;
  const data = {
    title,
    description,
    category,
    tags,
    isPublic,
    accessUsers,
    customIdElements,
    customId,
    customFields,
    createdBy: req.user._id,
  };

  if (req.file) {
    data.imageUrl = req.file.path;
  }

  try {
     await connectDB();
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(400).json({ message: 'Invalid createdBy user' });
    }
  for (const accessUser of data.accessUsers || []) {
  const u = await User.findById(accessUser.id); 
  if (!u) {
    return res.status(400).json({ message: `Invalid user ID: ${accessUser.id}` });
  }
  accessUser.user = u._id; 
  accessUser.name = u.fullName;
  accessUser.email = u.email;
  delete accessUser.id; 
}

    for (const tag of data.tags || []) {
      if (!(await Tag.findOne({ name: tag }))) {
        await new Tag({ name: tag }).save();
      }
    }
    let inventory;

    if (id) {
      inventory = await Inventory.findByIdAndUpdate(id, data, { new: true });
    } else {
      inventory = await Inventory.findOneAndUpdate(
        { createdBy: req.user._id, title: data.title },
        data,
        { new: true }
      );
    }
    if (!inventory) {
      inventory = new Inventory(data);
      await inventory.save();
      return res.status(201).json({ message: 'Inventory created', inventory });
    }
    return res.status(200).json({ message: 'Inventory created', inventory });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


const getUserInventories = async (req, res) => {
  try {
     await connectDB();
    const userId = req.user._id; 

    const inventories = await Inventory.find({ createdBy: userId }).sort({ createdAt: -1 });

    res.status(200).json(inventories);
  } catch (error) {
    console.error("Error fetching inventories:", error);
    res.status(500).json({ message: "Failed to fetch inventories", error });
  }
};


const getAllInventories = async (req, res) => {
  try {
     await connectDB();
    const inventories = await Inventory.find()
      .populate("createdBy", "-password") 
      .sort({ createdAt: -1 }); 

    res.status(200).json({ success: true, data: inventories });
  } catch (error) {
    console.error("Error fetching inventories:", error);
    res.status(500).json({ success: false, message: "Failed to fetch inventories", error });
  }
};

const deleteInventory = async (req, res) => {
  try {
    await connectDB();

    const inventoryId = req.params.id;
    const userId = req.user._id;
    const userRole = req.user.role;

    const inventory = await Inventory.findById(inventoryId);

    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }

    const isOwner = inventory.createdBy.toString() === userId.toString();
    const isAdmin = userRole === "admin";
    const isAccessUser = inventory.accessUsers?.some(
      (u) => u.user.toString() === userId.toString()
    );

    if (!isOwner && !isAdmin && !isAccessUser) {
      return res.status(403).json({
        message: "You are not authorized to delete this inventory",
      });
    }

    await Inventory.findByIdAndDelete(inventoryId);

    res.status(200).json({
      message: "Inventory deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting inventory:", error);
    res.status(500).json({
      message: "Failed to delete inventory",
      error: error.message,
    });
  }
};


// Helper to check access
const canEditInventory = async(user, inventory) => {
   await connectDB();
  if (!user) return false;
  const isAdmin = user.role === "admin";
  const isCreator = inventory.createdBy.equals(user._id);
  const hasAccess = inventory.accessUsers?.some(
    (u) => u.user.toString() === user._id.toString()
  );

  return isAdmin || isCreator || hasAccess;
};


const editInventories = async (req, res) => {
  try {
     await connectDB();
    const inventoryId = req.params.id;
    const updates = req.body; 

    const inventory = await Inventory.findById(inventoryId);
    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }

    if (!canEditInventory(req.user, inventory)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const allowedFields = [
      "title", "description", "category", "tags", "isPublic",
      "accessUsers", "imageUrl", "customIdElements", "customFields",
      "customId", "custom_id"
    ];

    let isUpdated = false;

    allowedFields.forEach((field) => {
      if (field in updates) {
        const newValue = updates[field];
        const oldValue = inventory[field];
        if (
          newValue !== null && 
          newValue !== undefined &&
          !isEmptyValue(newValue, field) &&
          !deepEqual(newValue, oldValue)
        ) {
          inventory[field] = newValue;
          isUpdated = true;
        }
      }
    });

    if (!isUpdated) {
      return res.status(200).json({ message: "No changes detected", inventory });
    }

    inventory.version = (inventory.version || 0) + 1;
    await inventory.save();

    res.status(200).json({
      message: "Inventory updated successfully",
      inventory
    });
  } catch (error) {
    console.error("Edit inventory error:", error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ message: "Validation failed", errors });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAccessInventories = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const inventories = await Inventory.find({
      "accessUsers.user": userId
    })
      .sort({ createdAt: -1 }) 

    return res.status(200).json({
      success: true,
      count: inventories.length,
      data: inventories,
    });
  } catch (error) {
    next(error);
  }
};

function isEmptyValue(value, field) {
  if (value === '') return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (value === null || value === undefined) return true;

  const requiredFields = ['title', 'category'];
  if (requiredFields.includes(field) && (value === '' || value === null)) {
    return true; 
  }
  return false;
}


function deepEqual(a, b) {
  if (a === b) return true;
  if (Array.isArray(a) && Array.isArray(b)) {
    return JSON.stringify(a) === JSON.stringify(b);
  }
  return false;
}
module.exports = {
  suggestTags,
  suggestUsers,
  saveDraftInventory,
  createInventory,
  getUserInventories,
  getAllInventories,
  deleteInventory,
  editInventories,
  getAccessInventories,
};