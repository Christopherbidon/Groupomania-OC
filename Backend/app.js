const express = require("express");
const app = express();
const pool = require("./config/db-config");
const postRoutes = require("./routes/posts");

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

module.exports = app;
