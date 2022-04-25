const pool = require("../config/db-config");

exports.createPost = async (req, res, next) => {
   try {
      console.log(req.body);
      const data = req.body;

      await pool.query(
         "INSERT INTO posts (owner_id, content, date) VALUES ($1, $2, $3)",
         [data.owner_id, data.content, data.date]
      );

      res.status(201).json();
   } catch (err) {
      console.log(err.message);
   }
};

exports.getAllPosts = async (req, res, next) => {
   await pool
      .query("SELECT * FROM posts")
      .then((posts) => res.status(200).json(posts.rows))
      .catch((err) => res.status(400).json(err));
};
