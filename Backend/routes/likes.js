const express = require("express");
const router = express.Router();
const likeCtrl = require("../controllers/likes");
const auth = require("../middleware/auth");

/* Route pour inscrire un utilisateur */
router.post("/:idPost/like", auth, likeCtrl.addLike);
/* Route pour supprimer un utilisateur */
router.post("/:idPost/dislike", auth, likeCtrl.addDislike);

module.exports = router;
