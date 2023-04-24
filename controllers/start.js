exports.start = async (body) => {
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
