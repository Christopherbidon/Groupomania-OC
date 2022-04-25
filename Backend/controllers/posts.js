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

exports.getOnePost = async (req, res, next) => {
   const { id } = req.params;
   await pool
      .query("SELECT * FROM posts WHERE post_id = $1", [id])
      .then((post) => res.status(200).json(post.rows))
      .catch((err) => res.status(404).json({ err }));
};

exports.modifyPost = async (req, res, next) => {
   try {
      const { id } = req.params;
      const data = req.body;
      await pool.query("UPDATE posts SET content = $1 WHERE post_id = $2", [
         data.content,
         id,
      ]);

      res.status(200).json("Post mis à jour");
   } catch (err) {
      console.error(err.message);
   }
};

exports.deletePost = async (req, res, next) => {
   const { id } = req.params;
   await pool
      .query("DELETE FROM posts WHERE post_id = $1", [id])
      .then(() => res.status(200).json({ message: "Post Supprimé!" }))
      .catch((err) => res.status(400).json({ err }));
};
