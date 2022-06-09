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

app.use("/medias", express.static(path.join(__dirname, "medias")));

app.use("/posts", postRoutes);

app.use("/users", userRoutes);

app.use("/likes", likeRoutes);

app.use("/comments", commentRoutes);

module.exports = app;
