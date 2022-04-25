const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/users");
const auth = require("../middleware/auth");

/* Route pour inscrire un utilisateur */
router.post("/signup", userCtrl.signupUser);
/* Route pour connecter un utilisateur */
router.post("/login", userCtrl.loginUser);
/* Route pour modifier un utilisateur */
router.put("/modify", auth, userCtrl.modifyUser);
/* Route pour supprimer un utilisateur */
router.delete("/delete", auth, userCtrl.deleteUser);

module.exports = router;
