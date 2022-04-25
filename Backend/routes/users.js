const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/users");

/* Route pour inscrire un utilisateur */
router.post("/signup", userCtrl.signupUser);
/* Route pour connecter un utilisateur */
router.post("/login", userCtrl.loginUser);
/* Route pour modifier un utilisateur */
router.put("/modify", userCtrl.modifyUser);
/* Route pour supprimer un utilisateur */
router.delete("/delete", userCtrl.deleteUser);

module.exports = router;
