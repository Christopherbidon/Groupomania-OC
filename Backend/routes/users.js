const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/users");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer");

/* Route pour récupérer un utilisateur */
router.get("/:id", auth, userCtrl.getUser);
/* Route pour inscrire un utilisateur */
router.post("/signup", userCtrl.signupUser);
/* Route pour connecter un utilisateur */
router.post("/login", userCtrl.loginUser);
/* Route pour modifier un utilisateur */
router.put("/modifyPassword", auth, userCtrl.modifyUserPassword);
/*Route pour modifier l'avatar d'un utilisateur */
router.put("/modifyAvatar", auth, multer, userCtrl.modifyUserAvatar);
/* Route pour supprimer un utilisateur */
router.delete("/delete", auth, userCtrl.deleteUser);

module.exports = router;
