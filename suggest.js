const Contact = require("./models/Contacts");
const { sendMessage } = require("./controllers");
require("dotenv").config({ path: "./config.env" });
const axios = require("axios");

const { TOKEN } = process.env;
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;

exports.newSuggestion = async (id, user) => {
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

  console.log(today, highDate, lowDate, mediumDate);
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

  //   now = sendMessage(id, "Here is your suggestion: High , Medium , Low");
  sendContact(id, high, "High");
  sendContact(id, medium, "Medium");
  sendContact(id, low, "Low");
  return { high, medium, low };
};

const sendContact = async (id, contact, priority) => {
  try {
    const res = await axios.post(`${TELEGRAM_API}/sendContact`, {
      chat_id: id,
      phone_number: contact.phoneNumber,
      first_name: contact.name,
    });
  } catch (error) {
    const res = await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: id,
      text: `You don't have contacts in your ${priority} priority list`,
    });
  }
};
