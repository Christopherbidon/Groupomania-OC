import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";

library.add(fas);

const Profile = ({ user, functionHandleClickProfile }) => {
   const [selectedImage, setSelectedImage] = useState(null);
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
               src={selectedImage ? selectedImage : user.avatarUrl}
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
                     onChange={(e) =>
                        setSelectedImage(
                           window.URL.createObjectURL(e.target.files[0])
                        )
                     }
                  />
               </>
            )}
         </div>
         {selectedImage ? (
            <div className="buttonAvatarChange">
               <button>Valider</button>
               <button
                  onClick={() => {
                     setSelectedImage(null);
                  }}
               >
                  Annuler
               </button>
            </div>
         ) : null}
      </div>
   );
};

export default Profile;
