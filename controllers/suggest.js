const User = require("../models/Users");
const Contact = require("../models/Contacts");
const { sendMessage, sendContact } = require("../sendMessage");

exports.suggest = async (body) => {
  let id = body.message.from.id;
  user = await User.findOne({ chatId: id });

  if (!user) {
    text = `You don't have an account yet. Create an account using  /start`;
    return sendMessage(id, text);
  }

  date = new Date();
  today = new Date(new Date().setDate(date.getDate()))
    .toISOString()
    .split("T")[0];

  highDate = new Date(new Date().setDate(date.getDate() - 14))
    .toISOString()
    .split("T")[0];
  mediumDate = new Date(new Date().setDate(date.getDate() - 30))
    .toISOString()
    .split("T")[0];
  lowDate = new Date(new Date().setDate(date.getDate() - 60))
    .toISOString()
    .split("T")[0];

  try {
    high = await Contact.find({
      createdBy: user._id,
      priority: "High",
      lastContact: { $lte: highDate },
    });
    medium = await Contact.find({
      createdBy: user._id,
      priority: "Medium",
      lastContact: { $lte: mediumDate },
    });
    low = await Contact.find({
      createdBy: user._id,
      priority: "Low",
      lastContact: { $lte: lowDate },
    });

    console.log(high + medium + low);
  } catch (ex) {
    console.log(ex.message);
  }

  high = high[Math.floor(Math.random() * high.length)];
  medium = medium[Math.floor(Math.random() * medium.length)];
  low = low[Math.floor(Math.random() * low.length)];

  sender(id, high, "High");
  sender(id, medium, "Medium");
  sender(id, low, "Low");
  return { high, medium, low };
};

const sender = async (id, contact, priority) => {
  try {
    await sendContact(id, contact);
  } catch (error) {
    await sendMessage(
      id,
      `You don't have contacts in your ${priority} priority list`
    );
  }
};
