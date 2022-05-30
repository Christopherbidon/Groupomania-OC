import axios from "axios";
import React, { useEffect, useState } from "react";

const Comment = ({ comment, user, functionGetCommentData }) => {
   const [ownerData, setOwnerData] = useState("");
   const [isActive, setIsActive] = useState(false);
   const [onUpdateComment, setOnUpdateComment] = useState(false);
   const [commentContent, setCommentContent] = useState(comment.content);

   useEffect(() => {
      axios
         .get(`http://localhost:4000/users/${comment.owner_id}`, {
            headers: {
               Authorization: `beared ${user.token}`,
            },
         })
         .then((res) => setOwnerData(res.data));
      console.log(comment);
   }, []);

   const handleClick = () => {
      if (isActive) {
         setIsActive(false);
         if (onUpdateComment) {
            setOnUpdateComment(false);
         }
      } else {
         setIsActive(true);
      }
   };

   const handleDelete = async () => {
      await axios
         .delete(`http://localhost:4000/comments/${comment.comment_id}`, {
            headers: { Authorization: `beared ${user.token}` },
         })
         .then((res) => {
            console.log(res);
            if (res.status == 200) {
               functionGetCommentData();
            }
         })
         .catch((err) => {
            console.log(err);
         });
   };

   const handleEdit = async () => {
      const data = { ownerId: comment.owner_id, content: commentContent };
      if (commentContent != comment.content) {
         await axios
            .put(`http://localhost:4000/comments/${comment.comment_id}`, data, {
               headers: { Authorization: `beared ${user.token}` },
            })
            .then((res) => {
               console.log(res.data.message);
               setOnUpdateComment(false);
               setIsActive(true);
            })
            .catch((err) => {
               console.log(err);
            });
      }
   };

   return (
      <li className="comment">
         <div className="comment__avatarBox">
            <img src={ownerData.avatar_url} alt="" />
         </div>
         {onUpdateComment ? (
            <textarea
               onChange={(e) => setCommentContent(e.target.value)}
               className="comment__content"
               value={commentContent}
            ></textarea>
         ) : (
            <p className="comment__content">
               <span className="comment__ownerText">
                  {ownerData.name + " " + ownerData.firstname}
               </span>
               <br />
               {commentContent}
            </p>
         )}
         {comment.owner_id == user.userId || user.admin ? (
            <div className="containerOptions">
               <div
                  className="buttonOptionsComment"
                  onClick={() => handleClick()}
               >
                  <div className="buttonOptionsComment__point"></div>
               </div>

               {isActive ? (
                  <>
                     <ul className="listOptionsComment">
                        {onUpdateComment ? (
                           <>
                              <li
                                 className="optionComment optionComment__valid"
                                 onClick={() => handleEdit()}
                              >
                                 <p>Valider</p>
                              </li>
                              <li
                                 className="optionComment optionComment__cancel"
                                 onClick={() => handleClick()}
                              >
                                 <p>Annuler</p>
                              </li>
                           </>
                        ) : (
                           <>
                              <li
                                 className="optionComment optionComment__edit"
                                 onClick={() => setOnUpdateComment(true)}
                              >
                                 <p>Modifier</p>
                              </li>
                              <li
                                 className="optionComment optionComment__delete"
                                 onClick={() => handleDelete()}
                              >
                                 <p>Supprimer</p>
                              </li>
                              <li
                                 className="optionComment optionComment__cancel"
                                 onClick={() => handleClick()}
                              >
                                 <p>Fermer</p>
                              </li>
                           </>
                        )}
                     </ul>
                     <div
                        className="listOptionsComment__background"
                        onClick={() => handleClick()}
                     ></div>
                  </>
               ) : null}
            </div>
         ) : null}
      </li>
   );
};

export default Comment;
