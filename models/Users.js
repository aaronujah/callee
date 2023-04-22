const mongoose = require("mongoose");
const validator = require("validator");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    userName: {
      type: String,
      unique: true,
    },
    phoneNumber: {
      type: String,
      unique: true,
    },
    chatId: {
      type: String,
      unique: true,
    },
    autoUpdateTime: {
      type: String,
      default: "8am",
    },
  },
  { timestamps: true },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

UserSchema.path("phoneNumber").validate(async (value) => {
  const numberCount = await mongoose.models.User.countDocuments({
    phoneNumber: value,
  });
  return !numberCount;
}, "This phone number has been used by another user.");

UserSchema.path("chatId").validate(async (value) => {
  const numberCount = await mongoose.models.User.countDocuments({
    chatId: value,
  });
  return !numberCount;
}, "You already have an account.");

module.exports = mongoose.model("User", UserSchema);
