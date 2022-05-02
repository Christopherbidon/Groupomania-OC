const jwt = require("jsonwebtoken");
require("dotenv").config();

/* vérification que l'utilisateur est bien connecter */
module.exports = (req, res, next) => {
   try {
      if (!req.headers.authorization) {
         return res.status(401).json({ error: "Merci de vous identifier" });
      }
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
      const userId = decodedToken.userId;
      const userAdmin = decodedToken.admin;
      req.auth = { userId: userId, userAdmin: userAdmin };
      next();
   } catch (err) {
      res.status(401).json(`Requête non authentifié (${err}) `);
   }
};
