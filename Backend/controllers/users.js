const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db-config");
const fs = require("fs");

/* Controleur pour récupérer un utilisateur */
exports.getUser = (req, res, next) => {
   const { id } = req.params;
   pool
      .query("SELECT * FROM users WHERE user_id = $1", [id])
      .then((data) => {
         const exportsData = {
            name: data.rows[0].name,
            firstname: data.rows[0].firstname,
            avatar_url: data.rows[0].avatar_url,
         };
         res.status(200).json(exportsData);
      })
      .catch((err) => res.status(400).json({ err }));
};
/* Controleur pour l'inscription d'une personne */
exports.signupUser = (req, res, next) => {
   bcrypt
      .hash(req.body.password, 10)
      .then((hash) => {
         const userInfo = req.body;
         pool
            .query(
               "INSERT INTO users (email, password, name, firstname) VALUES ($1, $2, $3, $4)",
               [userInfo.email, hash, userInfo.name, userInfo.firstname]
            )
            .then(() =>
               res.status(201).json({ message: "Utilisateur créé avec succès" })
            )
            .catch((err) => res.status(400).json({ err }));
      })
      .catch((err) => res.status(500).json({ err }));
};

/* Controlleur pour la connexion d'une personne */
exports.loginUser = (req, res, next) => {
   const { email } = req.body;
   pool
      .query("SELECT * FROM users WHERE email = $1", [email])
      .then((data) => {
         const user = data.rows[0];
         if (!user) {
            return res
               .status(401)
               .json({ message: "Adresse e-mail incorrect !" });
         }
         bcrypt
            .compare(req.body.password, user.password)
            .then((valid) => {
               if (!valid) {
                  return res
                     .status(401)
                     .json({ message: "Mot de passe incorrect !" });
               }
               res.status(200).json({
                  userId: user.user_id,
                  admin: user.admin,
                  avatarUrl: user.avatar_url,
                  token: jwt.sign(
                     { userId: user.user_id, admin: user.admin },
                     process.env.JWT_PRIVATE_KEY,
                     { expiresIn: "24h" }
                  ),
               });
            })
            .catch((err) => res.status(500).json(console.log(err)));
      })
      .catch((err) => res.status(500).json({ err }));
};

exports.modifyUserPassword = (req, res, next) => {
   const userId = req.auth.userId;
   pool
      .query("SELECT * FROM users WHERE user_id = $1", [userId])
      .then((data) => {
         const user = data.rows[0];
         bcrypt
            .compare(req.body.password, user.password)
            .then((valid) => {
               if (!valid) {
                  return res
                     .status(401)
                     .json({ error: "Ancien mot de passe incorecte !" });
               }
               bcrypt
                  .hash(req.body.newPassword, 10)
                  .then((hash) => {
                     pool
                        .query(
                           "UPDATE users SET password = $1 WHERE user_id = $2",
                           [hash, userId]
                        )
                        .then(() =>
                           res
                              .status(200)
                              .json({ message: "Compte mis à jour" })
                        )
                        .catch((err) => res.status(500).json({ err }));
                  })
                  .catch((err) => res.status(500).json({ err }));
            })
            .catch((err) => res.status(500).json({ err }));
      })
      .catch((err) => res.status(500).json({ err }));
};

exports.modifyUserAvatar = async (req, res, next) => {
   const userId = req.auth.userId;
   const avatar_url = req.file
      ? `${req.protocol}://${req.get("host")}/medias/${req.file.filename}`
      : null;
   await pool
      .query("SELECT * FROM users WHERE user_id = $1", [userId])
      .then((user) => {
         const oldAvatarUrl = user.rows[0].avatar_url;
         if (oldAvatarUrl.search(/defaultMedia/) < 1) {
            fs.unlink(`medias/${oldAvatarUrl.split("/medias/")[1]}`, (err) => {
               if (err) console.log(err);
            });
         }
         pool
            .query("UPDATE users SET avatar_url = $1 WHERE user_id = $2", [
               avatar_url,
               userId,
            ])
            .then(() =>
               res.status(200).json({
                  message: "Avatar mis à jour",
                  avatar_url: avatar_url,
               })
            )
            .catch((err) => res.status(500).json({ err }));
      });
};

exports.modifyIdentity = async (req, res, next) => {
   const userId = req.auth.userId;
   const newName = req.body.name;
   const newFirstname = req.body.firstname;

   pool
      .query("UPDATE users set name = $1, firstname = $2 WHERE user_id = $3", [
         newName,
         newFirstname,
         userId,
      ])
      .then(() =>
         res.status(200).json({
            message: "Identité mis à jour",
         })
      )
      .catch((err) => res.status(500).json({ err }));
};

exports.deleteUser = async (req, res, next) => {
   const userId = req.auth.userId;

   await pool
      .query("SELECT * FROM users WHERE user_id = $1", [userId])
      .then((user) => {
         const avatarUrl = user.rows[0].avatar_url;
         if (avatarUrl.search(/defaultMedia/) < 1) {
            fs.unlink(`medias/${avatarUrl.split("/medias/")[1]}`, (err) => {
               if (err) console.log(err);
            });
         }
         try {
            pool
               .query("SELECT * FROM likes WHERE owner_id = $1", [userId])
               .then((likes) => {
                  if (likes.rows.length > 0) {
                     likes.rows.forEach((like) => {
                        pool.query(
                           "DELETE FROM likes WHERE (owner_id = $1) AND (post_id = $2)",
                           [userId, like.post_id]
                        );
                        if (like.like_value === true) {
                           pool.query(
                              "UPDATE posts set likes = likes - 1 WHERE post_id = $1",
                              [like.post_id]
                           );
                        } else {
                           pool.query(
                              "UPDATE posts set dislikes = dislikes - 1 WHERE post_id = $1",
                              [like.post_id]
                           );
                        }
                     });
                  }
               });
            pool.query("DELETE FROM comments WHERE owner_id = $1", [userId]);
            pool
               .query("SELECT * FROM posts WHERE owner_id = $1", [userId])
               .then((posts) => {
                  if (posts.rows.length > 0) {
                     posts.rows.forEach((post) => {
                        const postId = post.post_id;
                        const imageUrl = post.image_url;
                        if (imageUrl != null) {
                           fs.unlink(
                              `medias/${imageUrl.split("/medias/")[1]}`,
                              (err) => {
                                 if (err) console.log(err);
                              }
                           );
                        }
                        if (post.likes != 0 || post.dislikes != 0) {
                           pool.query("DELETE FROM likes WHERE post_id = $1", [
                              postId,
                           ]);
                        }
                        pool.query("DELETE FROM comments WHERE post_id = $1", [
                           postId,
                        ]);
                        pool.query("DELETE FROM posts WHERE post_id = $1", [
                           postId,
                        ]);
                     });
                  }
               });
            pool.query("DELETE FROM posts WHERE owner_id = $1", [userId]);
            pool
               .query("DELETE FROM users WHERE user_id = $1", [userId])
               .then(() => {
                  res.status(200).json({
                     message: "Utilisateur supprimé avec succès",
                  });
               });
         } catch (error) {
            res.status(500).json({ error });
         }
      });
};
