const pool = require("../config/db-config");

/* Controlleur qui permet de récupérer le like d'un utilisateur */

exports.getLike = async (req, res, next) => {
   const { userId } = req.auth;
   const postId = req.params.idPost;

   await pool
      .query("SELECT * FROM likes WHERE (owner_id = $1) AND (post_id = $2)", [
         userId,
         postId,
      ])
      .then((like) => {
         if (like.rows.length >= 1) {
            return res.status(200).json(like.rows[0].like_value);
         } else {
            return res.status(200).json({ message: "Aucun like pour ce post" });
         }
      })
      .catch((err) => console.log(err));
};

/* Controlleur qui permet de liker */

exports.addLike = async (req, res, next) => {
   const { userId } = req.auth;
   const postId = req.params.idPost;

   await pool
      .query("SELECT * FROM likes WHERE (owner_id = $1) AND (post_id = $2)", [
         userId,
         postId,
      ])
      .then((like) => {
         if (like.rows.length >= 1) {
            const likeId = like.rows[0].like_id;
            if (like.rows[0].like_value == false) {
               try {
                  pool.query(
                     "UPDATE likes set like_value = $1 WHERE like_id = $2",
                     [true, likeId]
                  );
                  pool.query(
                     "UPDATE posts set dislikes = dislikes - 1 WHERE post_id = $1",
                     [postId]
                  );
                  pool.query(
                     "UPDATE posts set likes = likes + 1 WHERE post_id = $1",
                     [postId]
                  );
                  return res.status(200).json({ message: "Like mis à jour" });
               } catch (err) {
                  return res.status(400).json(err.message);
               }
            }
            return res.status(200).json("tout est ok");
         }
         try {
            pool.query(
               "INSERT INTO likes (owner_id, post_id, like_value) VALUES ($1, $2, $3)",
               [userId, postId, true]
            );
            pool.query(
               "UPDATE posts set likes = likes + 1 WHERE post_id = $1",
               [postId]
            );

            return res.status(200).json({ message: "Like ajouté" });
         } catch (err) {
            return res.status(400).json(err.message);
         }
      })
      .catch((err) => console.log(err));
};

/* Controlleur qui permet de disliker */

exports.addDislike = async (req, res, next) => {
   const { userId } = req.auth;
   const postId = req.params.idPost;

   await pool
      .query("SELECT * FROM likes WHERE (owner_id = $1) AND (post_id = $2)", [
         userId,
         postId,
      ])
      .then((like) => {
         if (like.rows.length >= 1) {
            const likeId = like.rows[0].like_id;
            if (like.rows[0].like_value == true) {
               try {
                  pool.query(
                     "UPDATE likes set like_value = $1 WHERE like_id = $2",
                     [false, likeId]
                  );
                  pool.query(
                     "UPDATE posts set dislikes = dislikes + 1 WHERE post_id = $1",
                     [postId]
                  );
                  pool.query(
                     "UPDATE posts set likes = likes - 1 WHERE post_id = $1",
                     [postId]
                  );

                  return res.status(200).json({ message: "Like mis à jour" });
               } catch (err) {
                  return res.status(400).json(err.message);
               }
            }
            return res.status(200).json("tout est ok");
         }
         try {
            pool.query(
               "INSERT INTO likes (owner_id, post_id, like_value) VALUES ($1, $2, $3)",
               [userId, postId, false]
            );
            pool.query(
               "UPDATE posts set dislikes = dislikes + 1 WHERE post_id = $1",
               [postId]
            );

            return res.status(200).json({ message: "Like ajouté" });
         } catch (err) {
            return res.status(400).json(err.message);
         }
      })
      .catch((err) => console.log(err));
};

/* Controlleur qui permet supprimer un like ou un dislike */

exports.deleteLike = async (req, res, next) => {
   const { userId } = req.auth;
   const postId = req.params.idPost;

   await pool
      .query("SELECT * FROM likes WHERE (owner_id = $1) AND (post_id = $2)", [
         userId,
         postId,
      ])
      .then((like) => {
         const like_value = like.rows[0].like_value;
         if (like_value == true) {
            pool.query(
               "UPDATE posts set likes = likes - 1 WHERE post_id = $1",
               [postId]
            );
         } else {
            pool.query(
               "UPDATE posts set dislikes = dislikes - 1 WHERE post_id = $1",
               [postId]
            );
         }

         pool
            .query(
               "DELETE FROM likes WHERE (owner_id = $1) AND (post_id = $2)",
               [userId, postId]
            )
            .then(() => {
               return res
                  .status(200)
                  .json({ message: "Like supprimé avec succès" });
            })
            .catch(() => {
               return res
                  .status(400)
                  .json({ message: "Suppression du like échoué" });
            });
      });
};
