const Contacts = require("../model/contacts.model");

const newContact = async ({ body }) => {
    const newContact = new Contacts(body);
    
  await newContact.save();

  return newContact;
};

module.exports = { newContact };
