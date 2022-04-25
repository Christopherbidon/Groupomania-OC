const jwt = require("jsonwebtoken");

/* vérification que l'utilisateur est bien connecter */
module.exports = (req, res, next) => {
   try {
      if (!req.headers.authorization) {
         return res.status(401).json({ error: "Merci de vous identifier" });
      }
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(
         token,
         "7781e9b987b943a1d7bec478a41b02f0"
      );
      const userId = decodedToken.userId;
      req.auth = { userId };
      if (req.body.userId && req.body.userId !== userId) {
         throw "User ID non valable";
      } else {
         next();
      }
   } catch (err) {
      res.status(401).json(`Requête non authentifié (${err}) `);
   }
};
