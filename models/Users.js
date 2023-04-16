const mongoose = require("mongoose");
const validator = require("validator");

const UserSchema = new mongoose.Schema(
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
      unique: true,
    },
    chatId: {
      type: String,
      unique: true,
    },
    autoUpdateTime: {
      type: Date,
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

module.exports = mongoose.model("User", UserSchema);
