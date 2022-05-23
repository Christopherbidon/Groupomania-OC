import axios from "axios";
import React, { useEffect, useState } from "react";
import Popup from "./Popup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import LikesBar from "./LikesBar";

library.add(fas);

const Post = ({ post, user, functionGetData }) => {
   const [messagePopup, setMessagePopup] = useState("");
   const [valuePopup, setValuePopup] = useState("");
   const [popup, setPopup] = useState(false);
   const [onUpdatePost, setOnUpdatePost] = useState(false);
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
               window.location.reload();
            }
         })
         .catch((err) => {
            console.log(err);
         });
   };

   return (
      <>
         <li className="post">
            {popup ? (
               <Popup value={valuePopup} popupText={messagePopup} />
            ) : null}
            <div className="post__header">
               <div className="postOwner">
                  <div className="postOwner__avatar"></div>
                  <p className="postOwner__text">
                     {`Créer par ` +
                        ownerData.firstname +
                        " " +
                        ownerData.name +
                        "."}
                  </p>
               </div>
               {post.owner_id == user.userId || user.admin ? (
                  <div className="buttonPostContainer">
                     {!onUpdatePost ? (
                        <button
                           className="buttonPost buttonPost__update"
                           onClick={() => setOnUpdatePost(true)}
                        >
                           <FontAwesomeIcon icon="fa-solid fa-pencil" />
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
                           <FontAwesomeIcon icon="fa-solid fa-trash" />
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
               <div className="post__content">
                  <p className="post__text">{newContent}</p>
               </div>
            ) : (
               <div className="post__content">
                  <textarea
                     value={newContent}
                     className="post__text post__text__update"
                     onChange={(e) => setNewContent(e.target.value)}
                     autoFocus
                  ></textarea>
               </div>
            )}
            <LikesBar
               post={post}
               user={user}
               functionGetData={functionGetData}
            />
         </li>
      </>
   );
};

export default Post;
