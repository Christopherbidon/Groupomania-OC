import axios from "axios";
import React, { useEffect, useState } from "react";
import Post from "../components/Post";
const AuthService = require("../services/AuthService");

const Home = () => {
   const [user, setUser] = useState(null);
   const [postsData, setPostsData] = useState([]);

   useEffect(() => {
      setUser(AuthService.getCurrentUser());
      axios
         .get("http://localhost:4000/posts", {
            headers: {
               Authorization: `beared ${AuthService.getCurrentUser().token}`,
            },
         })
         .then((res) => {
            setPostsData(res.data);
         })
         .catch((err) => console.log(err));
   }, []);

   return (
      <div>
         <ul>
            {postsData.map((post, index) => (
               <Post key={index} post={post} />
            ))}
         </ul>
         <button onClick={AuthService.logout}></button>
      </div>
   );
};

export default Home;
