const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    profilePicture: { type: String },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.isGoogleUser;
      },
    },
    isGoogleUser: { type: Boolean, default: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

// Virtual clean id
userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
userSchema.set("toJSON", { virtuals: true });

// check admin role
userSchema.methods.isAdmin = function () {
  return this.role === "admin";
};
// ✅ Prevent OverwriteModelError
const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
