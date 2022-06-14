import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import AllComments from "./AllComments";
import LikesBar from "./LikesBar";

library.add(fas);

const Post = ({ post, user, functionGetData, functionNewPopup }) => {
   const [onUpdatePost, setOnUpdatePost] = useState(false);
   const [newContent, setNewContent] = useState(post.content);
   const [ownerData, setOwnerData] = useState("");
   const [postImage, setPostImage] = useState(post.image_url);
   const [selectedImage, setSelectedImage] = useState(null);
   const postRef = useRef();
   const date = new Date(parseInt(post.date)).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
   });

   const getDate = () => {
      const dateNow = Date.now();
      const ecard = Math.floor((dateNow - post.date) / 1000);
      if (ecard < 60) {
         return ecard + " s";
      } else if (ecard > 60 && ecard < 3600) {
         return Math.floor(ecard / 60) + " m";
      } else if (ecard > 3600 && ecard < 86400) {
         return Math.floor(ecard / 60 / 60) + " h";
      } else if (ecard > 86400 && ecard < 1296000) {
         return Math.floor(ecard / 60 / 60 / 24) + " j";
      } else {
         return date;
      }
   };

   /***********************************************************/
   /* Permet de récupérer les données su propriétaire du post */
   /***********************************************************/
   useEffect(() => {
      axios
         .get(`http://localhost:4000/users/${post.owner_id}`, {
            headers: {
               Authorization: `beared ${user.token}`,
            },
         })
         .then((res) => setOwnerData(res.data));
   }, []);

   /****************************************/
   /* Remet les states à leur état initial */
   /****************************************/
   const handleCancel = () => {
      setOnUpdatePost(false);
      setNewContent(post.content);
      setSelectedImage(null);
      setPostImage(post.image_url);
   };

   /***************************************************************************************************/
   /* Fonction qui met à jour les donnée après une modification de post et qui les envoies au backend */
   /***************************************************************************************************/
   const handleUpdate = async () => {
      const data = new FormData();
      data.append("content", newContent);

      if (selectedImage != null) {
         data.append("image", selectedImage);
      } else if (postImage != null) {
         data.append("imageUrl", post.image_url);
      }
      console.log(selectedImage, postImage);

      await axios
         .put(`http://localhost:4000/posts/${post.post_id}`, data, {
            headers: { Authorization: `beared ${user.token}` },
         })
         .then((res) => {
            if (res.status == 200) {
               functionNewPopup(res.data.message, "valid");
               setOnUpdatePost(false);
               if (selectedImage) {
                  setPostImage(window.URL.createObjectURL(selectedImage));
                  setSelectedImage(null);
               }
            }
            functionGetData();
         })
         .catch((err) => {
            console.log(err);
         });
   };

   /***********************************/
   /* Fonction de suppression de post */
   /***********************************/
   const handleDelete = async () => {
      await axios
         .delete(`http://localhost:4000/posts/${post.post_id}`, {
            headers: { Authorization: `beared ${user.token}` },
         })
         .then((res) => {
            if (res.status == 200) {
               functionGetData();
               window.location.reload();
            }
         })
         .catch((err) => {
            console.log(err);
         });
   };

   /*********************************************************************/
   /* Fonction d'affichage de l'image lors de la modification d'un post */
   /*********************************************************************/
   const ImageDisplay = () => {
      if (onUpdatePost) {
         return (
            <div className="previewUpdatePost">
               <div className="containerInputFile">
                  <button className="btnUploadFile">
                     {selectedImage || postImage ? (
                        <FontAwesomeIcon icon="fa-solid fa-pencil" />
                     ) : (
                        <FontAwesomeIcon icon="fa-solid fa-plus" />
                     )}
                  </button>
                  <input
                     type="file"
                     id="image"
                     name="image"
                     accept=".jpg,.jpeg,.png,.gif"
                     onChange={(e) => {
                        setPostImage(null);
                        setSelectedImage(e.target.files[0]);
                     }}
                  />
               </div>

               {selectedImage ? (
                  <img
                     src={window.URL.createObjectURL(selectedImage)}
                     alt="Fichier sélectionner"
                  />
               ) : null}
               {postImage ? <img src={postImage} /> : null}

               {selectedImage ? (
                  <div
                     className="deleteImage"
                     onClick={() => setSelectedImage(null)}
                  >
                     <FontAwesomeIcon icon="xmark" />
                  </div>
               ) : null}
               {postImage ? (
                  <div
                     className="deleteImage"
                     onClick={() => setPostImage(null)}
                  >
                     <FontAwesomeIcon icon="xmark" />
                  </div>
               ) : null}
            </div>
         );
      } else {
         if (postImage != null) {
            return (
               <div className="post__boxImage">
                  <img src={postImage} />
               </div>
            );
         }
      }
   };

   const sizeTextArea = () => {
      let height = parseInt(postRef.current.clientHeight) + 2;
      let width = parseInt(postRef.current.clientWidth) + 2;
      return {
         height: height + "px",
         width: width + "px",
      };
   };

   return (
      <>
         <li className="post">
            <div className="post__header">
               <div className="postOwner">
                  <div className="postOwner__avatar">
                     <img
                        src={
                           user.userId == post.owner_id
                              ? user.avatarUrl
                              : ownerData.avatar_url
                        }
                        alt=""
                     />
                  </div>
                  <p className="postOwner__text">
                     {`Créer par ` +
                        ownerData.firstname +
                        " " +
                        ownerData.name +
                        " • " +
                        getDate()}
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
                  <p ref={postRef} className="post__text">
                     {newContent}
                  </p>
               </div>
            ) : (
               <div className="post__content">
                  <textarea
                     style={sizeTextArea()}
                     ref={postRef}
                     value={newContent}
                     className="post__text post__text__update"
                     onChange={(e) => {
                        setNewContent(e.target.value);
                     }}
                     autoFocus
                  ></textarea>
               </div>
            )}

            <ImageDisplay />

            <LikesBar
               post={post}
               user={user}
               functionGetData={functionGetData}
            />
            <AllComments
               functionNewPopup={functionNewPopup}
               postId={post.post_id}
               user={user}
            />
         </li>
      </>
   );
};

export default Post;
