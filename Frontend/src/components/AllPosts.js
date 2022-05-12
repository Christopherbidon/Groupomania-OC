import React, { useEffect, useState } from "react";
import axios from "axios";
import Post from "../components/Post";

const AllPosts = ({ user }) => {
   const [postsData, setPostsData] = useState([]);

   useEffect(() => {
      axios
         .get("http://localhost:4000/posts", {
            headers: {
               Authorization: `beared ${user.token}`,
            },
         })
         .then((res) => {
            setPostsData(res.data);
         })
         .catch((err) => console.log(err));
   }, []);

   const handleLogout = () => {
      sessionStorage.removeItem("user");
      window.location.reload();
   };

   return (
      <div>
         <ul>
            {postsData.map((post, index) => (
               <Post key={index} post={post} />
            ))}
         </ul>
         <input
            type="button"
            value="Se Déconnecter"
            onClick={() => handleLogout()}
         />
      </div>
   );
};

export default AllPosts;
