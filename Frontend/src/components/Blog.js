import axios from "axios";
import React, { useEffect, useState } from "react";
import InputPost from "./InputPost";
import Post from "./Post";

const Blog = ({ user }) => {
   const [postsData, setPostsData] = useState([]);

   const getData = async () => {
      await axios
         .get("http://localhost:4000/posts", {
            headers: {
               Authorization: `beared ${user.token}`,
            },
         })
         .then((res) => {
            setPostsData(res.data);
         })
         .catch((err) => console.log(err));
      console.log(postsData);
   };

   useEffect(() => {
      getData();
   }, []);

   const handleLogout = () => {
      sessionStorage.removeItem("user");
      window.location.reload();
   };

   return (
      <>
         <InputPost functionGetData={getData} />
         <div className="postContainer">
            <ul>
               {postsData
                  .sort((a, b) => b.date - a.date)
                  .map((post) => (
                     <Post
                        key={post.post_id}
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
      </>
   );
};

export default Blog;
