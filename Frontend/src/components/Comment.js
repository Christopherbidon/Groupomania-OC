import React from "react";

const Comment = ({ comment, user, functionGetCommentData }) => {
   console.log(comment);
   return (
      <li className="comment">
         <div className="comment__avatarContainer"></div>
         <p className="comment__content">{comment.content}</p>
      </li>
   );
};

export default Comment;
