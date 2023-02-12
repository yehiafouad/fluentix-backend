const { newContact } = require("../controllers/contacts.controllers");
const { validateNewContact } = require("../middleware/validation.middleware");
const router = require("express").Router();

router.post("/newContact", validateNewContact(), newContactHandler);

async function newContactHandler(req, res) {
  await newContact({ body: req.body });

  return res.json({ message: "Contact sent successfully" });
}

module.exports = router;
