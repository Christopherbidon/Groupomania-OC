const express = require("express");
const app = express();
const path = require("path");
const postRoutes = require("./routes/posts");
const userRoutes = require("./routes/users");
const likeRoutes = require("./routes/likes");
const commentRoutes = require("./routes/comments");

app.use(express.json());

app.use((req, res, next) => {
   res.setHeader("Access-Control-Allow-Origin", "*");
   res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
   );
   res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS"
   );
   next();
});

/* Url media qui envoie vers le bon dossier nomé medias*/
app.use("/medias", express.static(path.join(__dirname, "medias")));

/* Url posts qui envoie vers la routes posts.js*/
app.use("/posts", postRoutes);

/* Url users qui envoie vers la routes users.js*/
app.use("/users", userRoutes);

/* Url likes qui envoie vers la routes likes.js*/
app.use("/likes", likeRoutes);

/* Url comments qui envoie vers la routes comments.js*/
app.use("/comments", commentRoutes);

module.exports = app;
