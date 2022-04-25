const express = require("express");
const router = express.Router();

const postCtrl = require("../controllers/posts");

/*Route pour la création de sauce*/
router.post("/", postCtrl.createPost);
/* Route pour récupérer toute les sauces */
router.get("/", postCtrl.getAllPosts);
/* Route pour récupérer une seul sauce */
router.get("/:id", postCtrl.getOnePost);
/* Route pour modifier une sauce */
router.put("/:id", postCtrl.modifyPost);
/* Route pour supprimer une sauce */
router.delete("/:id", postCtrl.deletePost);

module.exports = router;
