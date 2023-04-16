const telegramBot = require("node-telegram-bot-api");
require("dotenv").config({ path: "./config.env" });
const express = require("express");

const TOKEN = process.env.TOKEN;
const url = "";
const port = process.env.PORT || 5500;

const bot = new telegramBot(TOKEN);
bot.setWebHook(`$url/bot${TOKEN}`);

const app = express();
const connectDB = require("./dbConnect");

app.use(express.json());

app.post(`/bot${TOKEN}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
