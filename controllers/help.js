const { sendMessage } = require("../sendMessage");

exports.help = async (body) => {
  let id = body.message.from.id;
  text = ``;
  return sendMessage(id, text);
};
