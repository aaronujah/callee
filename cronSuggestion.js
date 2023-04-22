const cron = require("node-cron");
const { newSuggestion } = require("./suggest");
const Users = require("./models/Users");

cron.schedule("* * * * *", cronTask("8am"));

const cronTask = async (timer) => {
  users = await Users.find({ autoUpdateTime: timer });
  users.array.forEach((element) => {
    newSuggestion(element.chatId, element);
  });
};
