const mongoose = require("mongoose");
const validator = require("validator");

const ContactSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    userName: {
      type: String,
      unique: true,
    },
    phoneNumber: {
      type: String,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
    },
    lastContact: {
      type: Date,
    },
    lastRemark: { type: String },
  },
  { timestamps: true },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("Contact", ContactSchema);
