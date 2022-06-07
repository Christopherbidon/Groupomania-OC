const pool = require("../config/db-config");
const fs = require("fs");

exports.createPost = async (req, res, next) => {
   try {
      const ownerId = req.auth.userId;
      const content = req.body.content;
      const date = Date.now();
      const imageUrl = req.file
         ? `${req.protocol}://${req.get("host")}/medias/${req.file.filename}`
         : null;
      await pool.query(
         "INSERT INTO posts (owner_id, content, date, image_url) VALUES ($1, $2, $3, $4)",
         [ownerId, content, date, imageUrl]
      );
      res.status(201).json({ message: "Post créer avec succès" });
   } catch (err) {
      console.log(err.message);
   }
};

exports.getAllPosts = async (req, res, next) => {
   await pool
      .query("SELECT * FROM posts")
      .then((posts) => res.status(200).json(posts.rows))
      .catch((err) => res.status(400).json(err));
};

exports.getOnePost = async (req, res, next) => {
   const { id } = req.params;
   await pool
      .query("SELECT * FROM posts WHERE post_id = $1", [id])
      .then((post) => res.status(200).json(post.rows))
      .catch((err) => res.status(404).json({ err }));
};

exports.modifyPost = async (req, res, next) => {
   const postId = req.params.id;
   const content = req.body.content;
   const imageUrl = req.file
      ? `${req.protocol}://${req.get("host")}/medias/${req.file.filename}`
      : req.body.imageUrl;

   await pool
      .query("SELECT * FROM posts WHERE post_id = $1", [postId])
      .then((post) => {
         const oldImageUrl = post.rows[0].image_url;
         console.log(oldImageUrl);
         if (oldImageUrl != null) {
            if (req.file || req.body.imageUrl == null) {
               fs.unlink(
                  `medias/${oldImageUrl.split("/medias/")[1]}`,
                  (err) => {
                     if (err) console.log(err);
                  }
               );
            }
         }
         if (!post.rows[0]) {
            return res.status(404).json({
               error: "Post non trouvé !",
            });
         }
         if (
            post.rows[0].owner_id !== req.auth.userId &&
            req.auth.userAdmin !== true
         ) {
            return res.status(401).json({
               error: "Requête non autorisée !",
            });
         }
         pool
            .query(
               "UPDATE posts set content = $1, image_url = $2 WHERE post_id = $3",
               [content, imageUrl, postId]
            )
            .then(
               res.status(200).json({ message: "Post mis à jour avec succès" })
            )
            .catch((err) => console.error(err));
      })
      .catch((err) => console.log(err));
};

exports.deletePost = async (req, res, next) => {
   const { id } = req.params;

   await pool
      .query("SELECT * FROM posts WHERE post_id = $1", [id])
      .then((post) => {
         try {
            const imageUrl = post.rows[0].image_url;

            if (!post) {
               return res.status(404).json({
                  error: "Post non trouvé !",
               });
            }
            if (
               post.rows[0].owner_id !== req.auth.userId &&
               req.auth.userAdmin !== true
            ) {
               return res.status(401).json({
                  error: "Requête non autorisée !",
               });
            }
            if (imageUrl != null) {
               fs.unlink(`medias/${imageUrl.split("/medias/")[1]}`, (err) => {
                  if (err) console.log(err);
               });
            }
            if (post.rows[0].likes != 0) {
               pool.query("DELETE FROM likes WHERE post_id = $1", [id]);
            }
            pool.query("DELETE FROM comments WHERE post_id = $1", [id]);
            pool.query("DELETE FROM posts WHERE post_id = $1", [id]);

            return res.status(200).json({ message: "Post et like supprimé" });
         } catch (err) {
            return res.status(400).json(err);
         }
      })
      .catch((err) => console.log(err));
};
