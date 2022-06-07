import React, { useEffect, useState } from "react";
import axios from "axios";
import Post from "../components/Post";

const AllPosts = ({ user }) => {
   const [postsData, setPostsData] = useState([]);

   const getData = async () => {
      await axios
         .get("http://localhost:4000/posts", {
            headers: {
               Authorization: `beared ${user.token}`,
            },
         })
         .then((res) => {
            setPostsData(null);
            setPostsData(res.data);
         })
         .catch((err) => console.log(err));
   };

   useEffect(() => {
      getData();
   }, []);

   const handleLogout = () => {
      sessionStorage.removeItem("user");
      window.location.reload();
   };

   return (
      <div className="postContainer">
         <ul>
            {postsData
               .sort((a, b) => b.date - a.date)
               .map((post, index) => (
                  <Post
                     key={index}
                     post={post}
                     user={user}
                     functionGetData={getData}
                  />
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
