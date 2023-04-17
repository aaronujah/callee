const User = require("./models/Users");
const Contact = require("./models/Contacts");
require("dotenv").config({ path: "./config.env" });
const axios = require("axios");

const { TOKEN } = process.env;
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;
let text = "";

const controller = async (body) => {
  console.log(body.message);
  if (body.message.text === "/start") {
    await start(body);
    sendMessage(body.message.from.id, text);
  } else if (body.message.text === "/contacts") {
    await contacts(body);
  } else if (body.message.contact) {
    await saveContact(body);
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
    return sendMessage(id, text);
  }

  text = `Select which contact category you want to add`;
  let buttonDisplay = {
    reply_markup: {
      keyboard: [["High Priority"], ["Medium Priority"], ["Low Priority"]],
      one_time_keyboard: true,
    },
  };
  return sendMessage(id, text, buttonDisplay);
};

const saveContact = async (body) => {
  let id = body.message.from.id;

  user = await User.findOne({ chatId: id });

  if (!user) {
    text = `You don't have an account yet. Create an account using  /start`;
    return sendMessage(id, text);
  }

  category = body.message.reply_to_message;
  if (category) {
    const { first_name, last_name, phone_number } = body.message.contact;

    let contact = {
      name: `${first_name} ${last_name === undefined ? "" : last_name}`,
      phoneNumber: phone_number,
      createdBy: user._id,
    };

    switch (category.text) {
      case "High Priority":
        contact.priority = "High";
        break;
      case "Medium Priority":
        contact.priority = "Medium";
        break;
      case "Low Priority":
        contact.priority = "Low";
        break;
    }

    await Contact.create(contact);
    await sendMessage(
      id,
      `Contact has been added to ${category.text}.\n\nAdd another contact by repeating the process...`
    );
  } else {
    await sendMessage(
      id,
      `Reply the contact your just sent with the category it should be added to...`
    );
  }
};

const sendMessage = async (id, text, extensions) => {
  const res = await axios.post(`${TELEGRAM_API}/sendMessage`, {
    chat_id: id,
    text,
    ...extensions,
  });
};

module.exports = controller;
