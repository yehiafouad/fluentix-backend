const contactsRoutes = require("./contacts.routes");
const router = require("express").Router();

router.use("/contacts", contactsRoutes);

module.exports = router;
