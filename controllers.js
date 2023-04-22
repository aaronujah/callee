const User = require("./models/Users");
const Contact = require("./models/Contacts");
const { newSuggestion } = require("./suggest");
require("dotenv").config({ path: "./config.env" });
const axios = require("axios");

const { TOKEN } = process.env;
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;
let text = "";

const controller = async (body) => {
  const bodyText = body.message.text.toLowerCase();
  console.log(body.message);

  if (bodyText === "/start") {
    await start(body);
    sendMessage(body.message.from.id, text);
  } else if (bodyText === "/contacts") {
    await contacts(body);
  } else if (bodyText === "/timer") {
    await timer(body);
  } else if (bodyText === "/suggest") {
    await suggest(body);
  } else if (bodyText === "/help") {
    await help(body);
  } else if (
    bodyText == "high priority" ||
    bodyText == "medium priority" ||
    bodyText == "low priority"
  ) {
    await addContactPriority(body);
  } else if (
    bodyText == "8am" ||
    bodyText == "12noon" ||
    bodyText == "3pm" ||
    bodyText == "6pm"
  ) {
    await setAutoTime(body);
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

const suggest = async (body) => {
  let id = body.message.from.id;
  text = ``;

  text = newSuggestion(id);
  return sendMessage(id, text);
};

const help = async (body) => {
  let id = body.message.from.id;
  text = ``;
  return sendMessage(id, text);
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
      `Reply the contact you just sent with the category it should be added to...`
    );
  }
};

const addContactPriority = async (body) => {
  let id = body.message.from.id;

  user = await User.findOne({ chatId: id });

  if (!user) {
    text = `You don't have an account yet. Create an account using  /start`;
    return sendMessage(id, text);
  }

  category = body.message.reply_to_message;
  if (category) {
    const { first_name, last_name, phone_number } = category.contact;

    let contact = {
      name: `${first_name} ${last_name === undefined ? "" : last_name}`,
      phoneNumber: phone_number,
      createdBy: user._id,
    };

    switch (body.message.text) {
      case "high priority":
        contact.priority = "High";
        break;
      case "medium priority":
        contact.priority = "Medium";
        break;
      case "low priority":
        contact.priority = "Low";
        break;
    }

    await Contact.create(contact);
    await sendMessage(
      id,
      `Contact has been added to ${body.message.text}.\n\nAdd another contact by repeating the process...`
    );
  }
};

const timer = async (body) => {
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

const setAutoTime = async (body) => {
  let id = body.message.from.id;
  textTime = body.message.text.toLowerCase();

  switch (textTime) {
    case "8am":
      autoTime = new Date(0, 0, 0, 8, 0, 0);
      break;
    case "12noon":
      autoTime = new Date(0, 0, 0, 12, 0, 0);
      break;
    case "3pm":
      autoTime = new Date(0, 0, 0, 13, 0, 0);
      break;
    case "6pm":
      autoTime = new Date(0, 0, 0, 18, 0, 0);
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
};

const sendMessage = async (id, text, extensions) => {
  const res = await axios.post(`${TELEGRAM_API}/sendMessage`, {
    chat_id: id,
    text,
    ...extensions,
  });
};

module.exports = controller;
