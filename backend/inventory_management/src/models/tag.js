const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: 'tags',
    toJSON: { virtuals: true },
  }
);

// Virtual clean id
tagSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Prevent OverwriteModelError
const Tag = mongoose.models.Tag || mongoose.model('Tag', tagSchema);

module.exports = Tag;