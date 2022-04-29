const express = require("express");
const app = express();
const postRoutes = require("./routes/posts");
const userRoutes = require("./routes/users");
const likeRoutes = require("./routes/likes");

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

app.use("/posts", postRoutes);

app.use("/users", userRoutes);

app.use("/likes", likeRoutes);

module.exports = app;
