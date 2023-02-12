const { body } = require("express-validator");
const { handleError } = require("../errors/handle-error");
const Contacts = require("../model/contacts.model");

// Validate whatsapp number
const validateNewContact = () => {
  return [
    body("phoneNumber")
      .isMobilePhone().withMessage('Invalid Phone Number').bail(),
      body('email').isEmail().withMessage('Invalid Email Address').bail().custom(async (email, {req}) => {
          const contact = await Contacts.findOne({ $or: [{email: email.toLowerCase()}, {phoneNumber: req.body.phoneNumber}] })
          
          if (contact)
              throw 'You already sent your application, we will contact you shortly.'
    }),
    handleError,
  ];
};

module.exports = {validateNewContact}