import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import axios from "axios";

library.add(fas);

const InputComment = ({
   postId,
   user,
   functionGetCommentData,
   functionNewPopup,
}) => {
   const [content, setContent] = useState("");

   const handleSubmitComment = async (e) => {
      e.preventDefault();
      await axios
         .post(
            `http://localhost:4000/comments/${postId}`,
            {
               content,
            },
            {
               headers: { Authorization: `beared ${user.token}` },
            }
         )
         .then((res) => {
            functionNewPopup(res.data.message, "valid");
            functionGetCommentData();
            setContent("");
         })
         .catch((err) => {
            console.log(err);
         });
   };

   return (
      <form className="inputComment">
         <div className="inputComment__avatarBox">
            <img src={user.avatarUrl} alt="" />
         </div>
         <textarea
            onChange={(e) => setContent(e.target.value)}
            className="inputComment__textArea"
            value={content}
            placeholder="Tapez votre commentaire ici !"
         ></textarea>
         <button
            className="inputComment__btnSubmit"
            type="submit"
            onClick={(e) => handleSubmitComment(e)}
         >
            <FontAwesomeIcon icon="fa-regular fa-paper-plane" />
         </button>
      </form>
   );
};

export default InputComment;
