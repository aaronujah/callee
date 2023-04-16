const controller = async (body) => {
  if (body.message.text == "/start") {
    await start();
  }
};

module.exports = controller;
