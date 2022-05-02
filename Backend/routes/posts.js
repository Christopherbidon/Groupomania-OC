const express = require("express");
const router = express.Router();

const postCtrl = require("../controllers/posts");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer");

/*Route pour la création de sauce*/
router.post("/", auth, multer, postCtrl.createPost);
/* Route pour récupérer toute les sauces */
router.get("/", auth, postCtrl.getAllPosts);
/* Route pour récupérer une seul sauce */
router.get("/:id", auth, postCtrl.getOnePost);
/* Route pour modifier une sauce */
router.put("/:id", auth, multer, postCtrl.modifyPost);
/* Route pour supprimer une sauce */
router.delete("/:id", auth, postCtrl.deletePost);

module.exports = router;
