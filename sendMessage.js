require("dotenv").config({ path: "./config.env" });
const axios = require("axios");

const { TOKEN } = process.env;
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;
let text = "";

exports.sendMessage = async (id, text, extensions) => {
  const res = await axios.post(`${TELEGRAM_API}/sendMessage`, {
    chat_id: id,
    text,
    ...extensions,
  });
};

exports.sendContact = async (id, contact) => {
  const res = await axios.post(`${TELEGRAM_API}/sendContact`, {
    chat_id: id,
    phone_number: contact.phoneNumber,
    first_name: contact.name,
  });
};
