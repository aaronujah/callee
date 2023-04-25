const telegramBot = require("node-telegram-bot-api");
require("dotenv").config({ path: "./config.env" });
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const { router } = require("./router");

const { TOKEN, SERVER_URL } = process.env;
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;
const URI = `/webhook/${TOKEN}`;
const WEBHOOK_URL = SERVER_URL + URI;
const port = process.env.PORT || 5500;

// const bot = new telegramBot(TOKEN);
// bot.setWebHook(WEBHOOK_URL);

const app = express();
app.use(bodyParser.json());
const connectDB = require("./dbConnect");

const init = async () => {
  const res = await axios.get(`${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`);
  console.log(res.data);
};

app.get(URI, (req, res) => {
  res.send("Welcome to Frend API");
});

app.post(URI, async (req, res) => {
  await router(req.body);
  return res.send();
});

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, async () => {
      console.log(`Server is listening on port ${port}...`);
      await init();
    });
  } catch (error) {
    console.log(error);
  }
};

start();
