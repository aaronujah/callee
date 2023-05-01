const { sendMessage } = require("./sendMessage");
const { start } = require("./controllers/start");
const {
  contacts,
  saveContact,
  addContactPriority,
  addRemark,
  seeList,
} = require("./controllers/contacts");
const { timer, setAutoTime } = require("./controllers/timer");
const { help } = require("./controllers/help");
const { suggest } = require("./controllers/suggest");

exports.router = async (body) => {
  const bodyText = body.message.text?.toLowerCase();
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
  } else if (bodyText === "/seelist") {
    await seeList(body);
  } else if (bodyText === "/help") {
    await help(body);
  } else if (
    bodyText === "high priority" ||
    bodyText === "medium priority" ||
    bodyText === "low priority"
  ) {
    await addContactPriority(body);
  } else if (
    bodyText === "8am" ||
    bodyText === "12noon" ||
    bodyText === "3pm" ||
    bodyText === "6pm"
  ) {
    await setAutoTime(body);
  } else if (bodyText.split(":")[0] === "remark") {
    await addRemark(body);
  } else if (body.message.contact) {
    await saveContact(body);
  }
};
