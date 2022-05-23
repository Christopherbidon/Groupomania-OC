const express = require("express");
const router = express.Router();
const commentCtrl = require("../controllers/comments");
const auth = require("../middleware/auth");

/* Route pour récupérer les commentaires */
router.get("/:postId", auth, commentCtrl.getAllComments);
/* Route pour créer un commentaire */
router.post("/:postId", auth, commentCtrl.createComment);
/* Route pour modifié un commentaire */
router.put("/:commentId", auth, commentCtrl.modifyComment);
/* Route pour supprimer un commentaire */
router.delete("/:commentId", auth, commentCtrl.deleteComment);

module.exports = router;
