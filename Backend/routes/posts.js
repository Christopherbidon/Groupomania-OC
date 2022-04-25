const express = require("express");
const router = express.Router();

const postCtrl = require("../controllers/posts");

/*Route pour la création de sauce*/
router.post("/", postCtrl.createPost);
/* Route pour récupérer toute les sauces */
router.get("/", postCtrl.getAllPosts);

module.exports = router;
