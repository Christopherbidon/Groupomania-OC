const express = require("express");
const router = express.Router();
const likeCtrl = require("../controllers/likes");
const auth = require("../middleware/auth");

/* Route pour récupérer les likes */
router.get("/:idPost", auth, likeCtrl.getLike);

/* Route pour inscrire un utilisateur */
router.post("/:idPost/like", auth, likeCtrl.addLike);
/* Route pour supprimer un utilisateur */
router.post("/:idPost/dislike", auth, likeCtrl.addDislike);
/* Route pour effacer un like */
router.delete("/:idPost", auth, likeCtrl.deleteLike);

module.exports = router;
