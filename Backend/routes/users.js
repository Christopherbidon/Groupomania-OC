const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/users");

/* Route pour l'inscription */
router.post("/signup", userCtrl.signup);
/* Route pour la connection */
router.post("/login", userCtrl.login);
/* Route pour la modification */
router.put("/modify", userCtrl.modify);

module.exports = router;
