const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "client"],
      default: "client",
    },
    passwordResetCode: { type: String, select: false },
    expireResetCode: { type: Date, select: false },
    verifyResetCode: { type: Boolean, select: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
