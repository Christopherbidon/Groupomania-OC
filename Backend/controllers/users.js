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
         console.log(data);
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
         pool
            .query("DELETE FROM users WHERE user_id = $1", [userId])
            .then(() => res.status(200).json("Utilisateur supprimer !"))
            .catch((err) => res.status(500).json({ err }));
      });
};
