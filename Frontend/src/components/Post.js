import axios from "axios";
import React, { useEffect, useState } from "react";
import Popup from "./Popup";

const Post = ({ post, user, functionGetData }) => {
   const [messagePopup, setMessagePopup] = useState("");
   const [valuePopup, setValuePopup] = useState("");
   const [popup, setPopup] = useState(false);
   const [onUpdatePost, setOnUpdatePost] = useState(false);
   const [content, setContent] = useState(post.content);
   const [newContent, setNewContent] = useState(post.content);
   const [newImage, setNewImage] = useState();
   const [ownerData, setOwnerData] = useState("");

   useEffect(() => {
      axios
         .get(`http://localhost:4000/users/${post.owner_id}`, {
            headers: {
               Authorization: `beared ${user.token}`,
            },
         })
         .then((res) => setOwnerData(res.data));
   }, []);

   const popupTimeOut = () => {
      setPopup(true);
      const popupTime = setInterval(() => {
         setPopup(false);
         clearInterval(popupTime);
      }, 6000);
   };

   const handleCancel = () => {
      setOnUpdatePost(false);
      setNewContent(post.content);
   };

   const handleUpdate = async (e) => {
      const formData = new FormData();
      formData.append("content", newContent);
      formData.append("image", newImage);
      await axios
         .put(`http://localhost:4000/posts/${post.post_id}`, formData, {
            headers: { Authorization: `beared ${user.token}` },
         })
         .then((res) => {
            if (res.status == 200) {
               setMessagePopup("Post mis à jour avec succès !");
               setValuePopup("valid");
               popupTimeOut();
               setOnUpdatePost(false);
            }
            functionGetData();
         })
         .catch((err) => {
            console.log(err);
         });
   };

   const handleDelete = async () => {
      await axios
         .delete(`http://localhost:4000/posts/${post.post_id}`, {
            headers: { Authorization: `beared ${user.token}` },
         })
         .then((res) => {
            if (res.status == 200) {
               setMessagePopup("Post supprimé avec succès !");
               setValuePopup("valid");
               popupTimeOut();
            }
            functionGetData();
         })
         .catch((err) => {
            console.log(err);
         });
   };

   return (
      <>
         <div className="post">
            {popup ? (
               <Popup value={valuePopup} popupText={messagePopup} />
            ) : null}
            <div className="post__header">
               <p className="postOwner">
                  {`Créer par ` +
                     ownerData.firstname +
                     " " +
                     ownerData.name +
                     "."}
               </p>
               {post.owner_id == user.userId || user.admin ? (
                  <div className="buttonPostContainer">
                     {!onUpdatePost ? (
                        <button
                           className="buttonPost buttonPost__update"
                           onClick={() => setOnUpdatePost(true)}
                        >
                           Modifier
                        </button>
                     ) : (
                        <button
                           className="buttonPost buttonPost__confirm"
                           onClick={(e) => handleUpdate(e)}
                        >
                           Valider
                        </button>
                     )}
                     {!onUpdatePost ? (
                        <button
                           className="buttonPost buttonPost__delete"
                           onClick={() => handleDelete()}
                        >
                           Supprimer
                        </button>
                     ) : (
                        <button
                           className="buttonPost buttonPost__cancel"
                           onClick={() => handleCancel()}
                        >
                           Annuler
                        </button>
                     )}
                  </div>
               ) : null}
            </div>
            {!onUpdatePost ? (
               <li>
                  <p className="post__content">{newContent}</p>
               </li>
            ) : (
               <li>
                  <textarea
                     value={newContent}
                     className="post__content"
                     onChange={(e) => setNewContent(e.target.value)}
                  ></textarea>
               </li>
            )}
         </div>
      </>
   );
};

export default Post;
