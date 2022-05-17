import axios from "axios";
import React, { useEffect, useState } from "react";

const Post = ({ post, user }) => {
   const [onUpdatePost, setOnUpdatePost] = useState(false);
   const [newContent, setNewContent] = useState("");
   const [ownerData, setOwnerData] = useState("");

   useEffect(() => {
      axios
         .get(`http://localhost:4000/users/${post.owner_id}`, {
            headers: {
               Authorization: `beared ${user.token}`,
            },
         })
         .then((res) => setOwnerData(res.data));
      console.log(ownerData.name);
   }, []);
   return (
      <>
         <div className="post">
            <p className="postOwner">
               {`Créer par ` + ownerData.firstname + " " + ownerData.name + "."}
            </p>
            {!onUpdatePost ? (
               <li>
                  <p className="post__content">{post.content}</p>
               </li>
            ) : (
               <li>
                  <textarea
                     value={post.content}
                     className="post__content"
                  ></textarea>
               </li>
            )}
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
                     <button className="buttonPost buttonPost__confirm">
                        Valider
                     </button>
                  )}
                  {!onUpdatePost ? (
                     <button className="buttonPost buttonPost__delete">
                        Supprimer
                     </button>
                  ) : (
                     <button
                        className="buttonPost buttonPost__cancel"
                        onClick={() => setOnUpdatePost(false)}
                     >
                        Annuler
                     </button>
                  )}
               </div>
            ) : (
               console.log("nope")
            )}
         </div>
      </>
   );
};

export default Post;
