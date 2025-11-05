const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
  category: {
  type: String,
  default: 'Other', 
  },

    imageUrl: {
      type: String,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    accessUsers: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        name: { type: String, trim: true },
        email: { type: String, trim: true, lowercase: true },
      },
    ],
    customIdElements: [
      {
        type: {
          type: String,
          enum: ['fixed', 'random20', 'random32', '6digit', '9digit', 'guid', 'date', 'sequence'],
          required: true,
        },
        value: {
          type: String,
          default: '',
        },
        format: {
          type: String,
          default: '',
        },
      },
    ],
    customId: {
      type: String,
      require: true
    },
    customFields: [
      {
        type: {
          type: String,
          enum: ['text', 'multiline', 'numeric', 'link', 'boolean'],
          required: true,
        },
        title: {
          type: String,
          required: true,
          trim: true,
        },
        description: {
          type: String,
          trim: true,
          default: '',
        },
        showInTable: {
          type: Boolean,
          default: false,
        },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    version: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    collection: 'inventories',
    toJSON: { virtuals: true },
  }
);

inventorySchema.virtual('id').get(function () {
  return this._id.toHexString();
});

inventorySchema.index({ createdBy: 1 });

const Inventory = mongoose.models.Inventory || mongoose.model('Inventory', inventorySchema);

module.exports = Inventory;