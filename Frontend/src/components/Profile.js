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

   return (
      <div className="popupProfile">
         <div className="popupProfileContainer">
            <p>Votre Profil</p>

            <div
               className="crossPopupProfile"
               onClick={() => functionHandleClickProfile()}
            ></div>
         </div>
         <div className="avatarContainer">
            <img
               src={
                  selectedImage
                     ? window.URL.createObjectURL(selectedImage)
                     : avatar
               }
               alt="Photo de profil"
            />
            {selectedImage ? null : (
               <>
                  <div className="avatarModifier avatarModifier__edit">
                     <FontAwesomeIcon icon="fa-solid fa-pencil" />
                  </div>
                  <input
                     type="file"
                     id="image"
                     name="image"
                     accept=".jpg,.jpeg,.png,.gif"
                     onChange={(e) => setSelectedImage(e.target.files[0])}
                  />
               </>
            )}
         </div>
         {selectedImage ? (
            <div className="buttonAvatarChange">
               <button onClick={(e) => handleUpdate(e)}>Valider</button>
               <button
                  onClick={() => {
                     setSelectedImage(null);
                  }}
               >
                  Annuler
               </button>
            </div>
         ) : null}
         <ChangeIdentity user={user} functionNewPopup={functionNewPopup} />
         <ChangePassword user={user} functionNewPopup={functionNewPopup} />
      </div>
   );
};

export default Profile;
