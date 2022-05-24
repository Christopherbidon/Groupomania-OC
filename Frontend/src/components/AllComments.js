import axios from "axios";
import React, { useEffect, useState } from "react";
import Comment from "./Comment";
import InputComment from "./InputComment";

const AllComments = ({ postId, user }) => {
   const [allCommentsData, setAllCommentsData] = useState([]);

   const getAllComments = async () => {
      await axios
         .get(`http://localhost:4000/comments/${postId}`, {
            headers: {
               Authorization: `beared ${user.token}`,
            },
         })
         .then((res) => setAllCommentsData(res.data))
         .catch((err) => console.log(err));
   };

   useEffect(() => {
      getAllComments();
      console.log(allCommentsData);
   }, []);

   return (
      <>
         <ul className="AllComments__container">
            {allCommentsData
               .sort((a, b) => a.date - b.date)
               .map((comment, index) => (
                  <Comment
                     key={index}
                     comment={comment}
                     user={user}
                     functionGetCommentData={getAllComments}
                  />
               ))}
         </ul>
         <InputComment
            postId={postId}
            user={user}
            functionGetCommentData={getAllComments}
         />
      </>
   );
};

export default AllComments;
