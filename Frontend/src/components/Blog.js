import axios from "axios";
import React, { useEffect, useState } from "react";
import Header from "./Header";
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
            console.log(postsData);
         })
         .catch((err) => console.log(err));
   };

   useEffect(() => {
      getData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   return (
      <>
         <Header />
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
         </div>
      </>
   );
};

export default Blog;
