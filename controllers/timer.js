const User = require("../models/Users");
const { sendMessage } = require("../sendMessage");

exports.timer = async (body) => {
  let id = body.message.from.id;

  user = await User.findOne({ chatId: id });

  if (!user) {
    text = `You don't have an account yet. Create an account using  /start`;
    return sendMessage(id, text);
  }

  text = `Select the time you want to be getting your daily list `;
  let buttonDisplay = {
    reply_markup: {
      keyboard: [["8am"], ["12noon"], ["3pm"], ["6pm"]],
      one_time_keyboard: true,
    },
  };
  return sendMessage(id, text, buttonDisplay);
};

exports.setAutoTime = async (body) => {
  let id = body.message.from.id;
  textTime = body.message.text.toLowerCase();

  switch (textTime) {
    case "8am":
      autoTime = "8am";
      break;
    case "12noon":
      autoTime = "12noon";
      break;
    case "3pm":
      autoTime = "3pm";
      break;
    case "6pm":
      autoTime = "6pm";
      break;
  }

  user = await User.findOneAndUpdate(
    { chatId: id },
    { autoUpdateTime: autoTime }
  );

  if (!user) {
    text = `You don't have an account yet. Create an account using  /start`;
    return sendMessage(id, text);
  }

  return sendMessage(
    id,
    "Your automatic daily list timer has been set succesfully"
  );
};
