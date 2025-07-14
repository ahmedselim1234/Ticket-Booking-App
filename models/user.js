const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {first_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    role: {
      type: String,
      enum: ["admin", "client"],
      default: 'client'
    },
  },
  { timestamps: true }
);

module.exports=mongoose.model("User",userSchema)