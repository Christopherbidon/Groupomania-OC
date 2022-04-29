const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db-config");

/* Controleur pour l'inscription d'une personne */
exports.signupUser = (req, res, next) => {
   bcrypt
      .hash(req.body.password, 10)
      .then((hash) => {
         const userInfo = req.body;
         pool
            .query(
               "INSERT INTO users (email, password, name, firstname, civilite) VALUES ($1, $2, $3, $4, $5)",
               [
                  userInfo.email,
                  hash,
                  userInfo.name,
                  userInfo.firstname,
                  userInfo.civilite,
               ]
            )
            .then(() => res.status(201).json({ message: "Utilisateur créé" }))
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
         console.log(user);
         if (!user) {
            return res.status(401).json({ error: "Utilisateur non trouvé !" });
         }
         bcrypt
            .compare(req.body.password, user.password)
            .then((valid) => {
               if (!valid) {
                  return res
                     .status(401)
                     .json({ error: "Mot de passe incorecte !" });
               }
               res.status(200).json({
                  userId: user.user_id,
                  admin: user.admin,
                  token: jwt.sign(
                     { userId: user.user_id, admin: user.admin },
                     "7781e9b987b943a1d7bec478a41b02f0",
                     { expiresIn: "24h" }
                  ),
               });
            })
            .catch((err) => res.status(500).json(console.log(err)));
      })
      .catch((err) => res.status(500).json({ err }));
};

exports.modifyUser = (req, res, next) => {
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
                        .then(() => res.status(200).json("Compte mis à jour"))
                        .catch((err) => res.status(500).json({ err }));
                  })
                  .catch((err) => res.status(500).json({ err }));
            })
            .catch((err) => res.status(500).json({ err }));
      })
      .catch((err) => res.status(500).json({ err }));
};

exports.deleteUser = (req, res, next) => {
   const userId = req.auth.userId;
   pool
      .query("DELETE FROM users WHERE user_id = $1", [userId])
      .then(() => res.status(200).json("Utilisateur supprimer"))
      .catch((err) => res.status(500).json({ err }));
};
