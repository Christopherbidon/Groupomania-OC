const pool = require("../config/db-config");

exports.getAllComments = async (req, res, next) => {
   const { postId } = req.params;

   await pool
      .query("SELECT * FROM comments WHERE post_id = $1", [postId])
      .then((comments) => {
         return res.status(200).json(comments.rows);
      })
      .catch((err) => console.log(err));
};

exports.createComment = async (req, res, next) => {
   try {
      const ownerId = req.auth.userId;
      const { postId } = req.params;
      const content = req.body.content;
      const date = Date.now();
      console.log(content);
      await pool.query(
         "INSERT INTO comments (owner_id, post_id, content, date) VALUES ($1, $2, $3, $4)",
         [ownerId, postId, content, date]
      );
      res.status(201).json({ message: "Commentaire posté avec succès" });
   } catch (err) {
      res.status(400).json({
         message: "Impossible de créer ce commentaire" + err,
      });
   }
};

exports.modifyComment = async (req, res, next) => {
   const commentId = req.params.commentId;
   const content = req.body.content;
   const ownerId = req.body.ownerId;
   await pool
      .query("SELECT * FROM comments WHERE comment_id = $1 AND owner_id = $2", [
         commentId,
         ownerId,
      ])
      .then((comment) => {
         console.log(comment.rows[0]);
         if (!comment.rows[0]) {
            return res.status(404).json({
               error: "Commentaire non trouvé !",
            });
         }
         if (
            comment.rows[0].owner_id !== req.auth.userId &&
            req.auth.userAdmin !== true
         ) {
            return res.status(401).json({
               error: "Requête non autorisée !",
            });
         }
         pool
            .query("UPDATE comments set content = $1 WHERE comment_id = $2", [
               content,
               commentId,
            ])
            .then(() => {
               res.status(200).json({ message: "Commentaire mis à jour" });
            })
            .catch((err) =>
               res.status(400).json({
                  message: "Impossible de mettre à jour le commentaire" + err,
               })
            );
      })
      .catch((err) => console.log("coucou" + err));
};

exports.deleteComment = async (req, res, next) => {
   const { commentId } = req.params;

   await pool
      .query("SELECT * FROM comments WHERE comment_id = $1", [commentId])
      .then((comment) => {
         try {
            if (!comment) {
               return res.status(404).json({
                  error: "Commentaire non trouvé !",
               });
            }
            if (
               comment.rows[0].owner_id !== req.auth.userId &&
               req.auth.userAdmin !== true
            ) {
               return res.status(401).json({
                  error: "Requête non autorisée !",
               });
            }
            pool.query("DELETE FROM comments WHERE comment_id = $1", [
               commentId,
            ]);

            return res.status(200).json({ message: "Commentaire supprimé" });
         } catch (err) {
            return res.status(400).json(err);
         }
      })
      .catch((err) => console.log(err));
};
