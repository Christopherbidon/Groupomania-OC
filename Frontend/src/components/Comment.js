import axios from "axios";
import React, { useEffect, useState } from "react";

const Comment = ({ comment, user, functionGetCommentData }) => {
   const [ownerData, setOwnerData] = useState("");

   useEffect(() => {
      axios
         .get(`http://localhost:4000/users/${comment.owner_id}`, {
            headers: {
               Authorization: `beared ${user.token}`,
            },
         })
         .then((res) => setOwnerData(res.data));
   }, []);

   return (
      <li className="comment">
         <div className="comment__avatarBox"></div>
         <p className="comment__content">
            <span className="comment__ownerText">
               {ownerData.name + " " + ownerData.firstname}
            </span>
            <br />
            {comment.content}
         </p>
      </li>
   );
};

export default Comment;
