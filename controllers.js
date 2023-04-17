const User = require("./models/Users");
const Contact = require("./models/Contacts");
require("dotenv").config({ path: "./config.env" });
const axios = require("axios");

const { TOKEN } = process.env;
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;
let text = "";

const controller = async (body) => {
  if (body.message.text === "/start") {
    await start(body);
    sendMessage(body.message.from.id, text);
  } else if (body.message.text === "/contacts") {
    await contacts(body);
  }
};

const start = async (body) => {
  let { first_name, id, last_name } = body.message.from;

  let user = {};
  user.chatId = id;
  user.name = `${first_name} ${last_name === undefined ? "" : last_name}`;
  try {
    await User.create(user);
    text = `Your account was created successfully. 
You can now setup contacts into different categories using /contacts`;
  } catch (ex) {
    text = ex.message;
  }
};

const contacts = async (body) => {
  let id = body.message.from.id;

  user = await User.findOne({ chatId: id });

  if (!user) {
    text = `You don't have an account yet. Create an account using  /start`;
    sendMessage(id, text);
  }
};

const sendMessage = async (id, text) => {
  const res = await axios.post(`${TELEGRAM_API}/sendMessage`, {
    chat_id: id,
    text,
  });
};

module.exports = controller;
