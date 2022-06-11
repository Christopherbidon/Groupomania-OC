import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import ChangePassword from "./ChangePassword";
import axios from "axios";
import ChangeIdentity from "./ChangeIdentity";

library.add(fas);

const Profile = ({
   functionUpdateDataUser,
   user,
   functionHandleClickProfile,
   functionNewPopup,
}) => {
   const [selectedImage, setSelectedImage] = useState(null);
   const [avatar, setAvatar] = useState(user.avatarUrl);

   const handleUpdate = async (e) => {
      e.preventDefault();
      const data = new FormData();
      data.append("image", selectedImage);

      await axios
         .put(`http://localhost:4000/users/modifyAvatar`, data, {
            headers: { Authorization: `beared ${user.token}` },
         })
         .then((res) => {
            user.avatarUrl = res.data.avatar_url;
            functionNewPopup(res.data.message, "valid");
            setAvatar(window.URL.createObjectURL(selectedImage));
            setSelectedImage(null);
            console.log(user);
            sessionStorage.setItem("user", JSON.stringify(user));
            functionUpdateDataUser();
         })
         .catch((err) => {
            console.log(err);
         });
   };

   const handleDeleteAccount = async (e) => {
      e.preventDefault();
      await axios
         .delete(`http://localhost:4000/users/delete`, {
            headers: { Authorization: `beared ${user.token}` },
         })
         .then((res) => {
            sessionStorage.removeItem("user");
            functionNewPopup(res.data.message, "valid");
            functionUpdateDataUser();
         });
   };

   return (
      <div className="popupProfile">
         <div className="popupProfileContainer">
            <p>Votre Profil</p>

            <div
               className="crossPopupProfile"
               onClick={() => functionHandleClickProfile()}
            ></div>
         </div>
         <div className="changeAvatar">
            <div className="avatarContainer">
               <img
                  src={
                     selectedImage
                        ? window.URL.createObjectURL(selectedImage)
                        : avatar
                  }
                  alt="Avatar de profil"
               />
            </div>
            <div className="containerButtonAvatarChange">
               <button className="buttonAvatar buttonAvatar__edit">
                  <FontAwesomeIcon icon="fa-solid fa-pencil" />
                  <input
                     type="file"
                     id="image"
                     name="image"
                     accept=".jpg,.jpeg,.png,.gif"
                     onChange={(e) => setSelectedImage(e.target.files[0])}
                  />
               </button>
               {selectedImage ? (
                  <>
                     <button
                        className="buttonAvatar buttonAvatar__valid"
                        onClick={(e) => handleUpdate(e)}
                     >
                        Valider
                     </button>
                     <button
                        className="buttonAvatar buttonAvatar__cancel"
                        onClick={() => {
                           setSelectedImage(null);
                        }}
                     >
                        Annuler
                     </button>
                  </>
               ) : null}
            </div>
         </div>
         <ChangeIdentity user={user} functionNewPopup={functionNewPopup} />
         <ChangePassword user={user} functionNewPopup={functionNewPopup} />
         <button
            onClick={(e) => handleDeleteAccount(e)}
            className="deleteAccount"
         >
            Supprimer compte
         </button>
      </div>
   );
};

export default Profile;
