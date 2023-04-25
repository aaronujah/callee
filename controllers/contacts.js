const User = require("./models/Users");
const Contact = require("./models/Contacts");
const { sendMessage } = require("./sendMessage");

exports.contacts = async (body) => {
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

exports.saveContact = async (body) => {
  let id = body.message.from.id;

  user = await User.findOne({ chatId: id });

  if (!user) {
    text = `You don't have an account yet. Create an account using  /start`;
    return sendMessage(id, text);
  }

  category = body.message.reply_to_message;
  if (category) {
    const { first_name, last_name, phone_number } = body.message.contact;
    date = new Date();

    let contact = {
      name: `${first_name} ${last_name === undefined ? "" : last_name}`,
      phoneNumber: phone_number,
      createdBy: user._id,
    };

    switch (category.text) {
      case "high priority":
        contact.priority = "High";
        contact.lastContact = new Date(new Date().setDate(date.getDate() - 14))
          .toISOString()
          .split("T")[0];
        break;
      case "medium priority":
        contact.priority = "Medium";
        contact.lastContact = new Date(new Date().setDate(date.getDate() - 30))
          .toISOString()
          .split("T")[0];
        break;
      case "low priority":
        contact.priority = "Low";
        contact.lastContact = new Date(new Date().setDate(date.getDate() - 60))
          .toISOString()
          .split("T")[0];
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

exports.addContactPriority = async (body) => {
  let id = body.message.from.id;

  user = await User.findOne({ chatId: id });

  if (!user) {
    text = `You don't have an account yet. Create an account using  /start`;
    return sendMessage(id, text);
  }

  category = body.message.reply_to_message;
  if (category) {
    const { first_name, last_name, phone_number } = category.contact;
    date = new Date();

    let contact = {
      name: `${first_name} ${last_name === undefined ? "" : last_name}`,
      phoneNumber: phone_number,
      createdBy: user._id,
    };

    switch (body.message.text.toLowerCase()) {
      case "high priority":
        contact.priority = "High";
        contact.lastContact = new Date(new Date().setDate(date.getDate() - 15))
          .toISOString()
          .split("T")[0];
        break;
      case "medium priority":
        contact.priority = "Medium";
        contact.lastContact = new Date(new Date().setDate(date.getDate() - 31))
          .toISOString()
          .split("T")[0];
        break;
      case "low priority":
        contact.priority = "Low";
        contact.lastContact = new Date(new Date().setDate(date.getDate() - 61))
          .toISOString()
          .split("T")[0];
        break;
    }

    await Contact.create(contact);
    await sendMessage(
      id,
      `Contact has been added to ${body.message.text}.\n\nAdd another contact by repeating the process...`
    );
  }
};
