import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";

library.add(far, fas);

const LikesBar = ({ post, user }) => {
   const [isLiked, setIsLiked] = useState(false);
   const [isDisliked, setIsDisliked] = useState(false);
   const [likesNumber, setLikesNumber] = useState(post.likes);
   const [dislikesNumber, setDislikesNumber] = useState(post.dislikes);

   const getLikes = async () => {
      await axios
         .get(`http://localhost:4000/likes/${post.post_id}`, {
            headers: {
               Authorization: `beared ${user.token}`,
            },
         })
         .then((res) => {
            if (res.data == true) {
               setIsLiked(true);
            } else if (res.data == false) {
               setIsDisliked(true);
            }
         })
         .catch((err) => console.log(err));
   };

   useEffect(() => {
      getLikes();
   }, []);

   const addLikeToDataBase = () => {
      axios
         .post(`http://localhost:4000/likes/${post.post_id}/like`, "", {
            headers: {
               Authorization: `beared ${user.token}`,
            },
         })
         .then((res) => console.log(res));
   };
   const addDislikeToDataBase = () => {
      axios
         .post(`http://localhost:4000/likes/${post.post_id}/dislike`, "", {
            headers: {
               Authorization: `beared ${user.token}`,
            },
         })
         .then((res) => console.log(res));
   };

   const deleteLikeToDataBase = () => {
      axios
         .delete(`http://localhost:4000/likes/${post.post_id}`, {
            headers: {
               Authorization: `beared ${user.token}`,
            },
         })
         .then((res) => console.log(res));
   };

   const handleDislike = () => {
      if (isDisliked) {
         setIsDisliked(false);
         setDislikesNumber(dislikesNumber - 1);
         deleteLikeToDataBase();
      } else {
         setIsDisliked(true);
         setDislikesNumber(dislikesNumber + 1);
         addDislikeToDataBase();
         if (isLiked) {
            setIsLiked(false);
            setLikesNumber(likesNumber - 1);
         }
      }
   };

   const handleLike = () => {
      if (isLiked) {
         setIsLiked(false);
         setLikesNumber(likesNumber - 1);
         deleteLikeToDataBase();
      } else {
         setIsLiked(true);
         setLikesNumber(likesNumber + 1);
         addLikeToDataBase();
         if (isDisliked) {
            setIsDisliked(false);
            setDislikesNumber(dislikesNumber - 1);
         }
      }
   };

   return (
      <div className="likesBar">
         <div onClick={() => handleLike()}>
            {isLiked ? (
               <FontAwesomeIcon
                  className="like like__active"
                  icon="fa-solid fa-thumbs-up"
               />
            ) : (
               <FontAwesomeIcon
                  className="like"
                  icon="fa-regular fa-thumbs-up"
               />
            )}
            <p className="numberLike">{likesNumber}</p>
         </div>
         <div onClick={() => handleDislike()}>
            {isDisliked ? (
               <FontAwesomeIcon
                  className="dislike dislike__active"
                  icon="fa-solid fa-thumbs-down"
               />
            ) : (
               <FontAwesomeIcon
                  className="dislike"
                  icon="fa-regular fa-thumbs-down"
               />
            )}

            <p className="numberDislike">{dislikesNumber}</p>
         </div>
      </div>
   );
};

export default LikesBar;
