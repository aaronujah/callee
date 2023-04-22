const cron = require("node-cron");
const { newSuggestion } = require("./suggest");
const Users = require("./models/Users");

cron.schedule("0 8 * * *", cronTask("8am"));
cron.schedule("0 12 * * *", cronTask("12noon"));
cron.schedule("0 15 * * *", cronTask("3pm"));
cron.schedule("0 18 * * *", cronTask("6pm"));

const cronTask = async (timer) => {
  users = await Users.find({ autoUpdateTime: timer });
  users.array.forEach((element) => {
    newSuggestion(element.chatId, element);
  });
};
