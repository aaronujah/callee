const User = require("./models/Users");
const { sendMessage } = require("./sendMessage");
const { newSuggestion } = require("./suggest");

exports.suggest = async (body) => {
  let id = body.message.from.id;
  user = await User.findOne({ chatId: id });

  if (!user) {
    text = `You don't have an account yet. Create an account using  /start`;
    return sendMessage(id, text);
  }

  try {
    contacts = newSuggestion(id, user);
  } catch (ex) {
    console.log(ex.message);
  }
};
