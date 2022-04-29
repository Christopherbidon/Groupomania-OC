const pool = require("../config/db-config");

exports.addLike = async (req, res, next) => {
   const { userId } = req.auth;
   const postId = req.params.idPost;

   await pool
      .query("SELECT * FROM likes WHERE (owner_id = $1) AND (post_id = $2)", [
         userId,
         postId,
      ])
      .then((like) => {
         console.log(like.rows.length);
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
