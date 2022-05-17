import axios from "axios";
import React, { useEffect, useState } from "react";
import Popup from "./Popup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";

library.add(fas);

const InputPost = () => {
   const [selectedImage, setSelectedImage] = useState();
   const [textImage, setTextImage] = useState(
      "Veuillez selectionner une image"
   );
   const [content, setContent] = useState("");
   const [user, setUser] = useState(null);
   useEffect(() => {
      setUser(JSON.parse(sessionStorage.getItem("user")));
   }, []);
   const [messagePopup, setMessagePopup] = useState("");
   const [valuePopup, setValuePopup] = useState("");
   const [popup, setPopup] = useState(false);

   const popupTimeOut = () => {
      setPopup(true);
      const popupTime = setInterval(() => {
         setPopup(false);
         clearInterval(popupTime);
      }, 6000);
   };

   const returnFileSize = (number) => {
      if (number < 1024) {
         return number + " octets";
      } else if (number >= 1024 && number < 1048576) {
         return (number / 1024).toFixed(1) + " Ko";
      } else if (number >= 1048576) {
         return (number / 1048576).toFixed(1) + " Mo";
      }
   };
   const updateImageDisplay = (e) => {
      const file = e.target.files[0];
      if (file.length === 0) {
         console.log("no file");
      } else {
         setTextImage(
            `Nom du Fichier : "` +
               file.name +
               `", taille du fichier ` +
               returnFileSize(file.size) +
               "."
         );
         setSelectedImage(file);
      }
   };
   const handleSubmit = (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append("content", content);
      formData.append("image", selectedImage);
      axios
         .post("http://localhost:4000/posts", formData, {
            headers: { Authorization: `beared ${user.token}` },
         })
         .then((res) => {
            if (res.status == 201) {
               handleResetImage();
               setContent("");
               setMessagePopup("Post créer avec succès !");
               setValuePopup("valid");
               popupTimeOut();
            }
         })
         .catch((err) => {
            console.log(err);
         });
   };

   const handleResetImage = () => {
      console.log("ok");
      setTextImage(null);
      setSelectedImage(null);
   };
   return (
      <div className="containerInputPost">
         {popup ? <Popup value={valuePopup} popupText={messagePopup} /> : null}
         <form
            className="containerInputPost__form"
            onSubmit={(e) => handleSubmit(e)}
         >
            <textarea
               className="containerInputPost__text"
               placeholder="Tapez votre message ici !"
               value={content}
               onChange={(e) => setContent(e.target.value)}
            ></textarea>
            <div className="preview">
               <div className="containerInputFile">
                  <button className="btnUploadFile">
                     {selectedImage
                        ? "Modifier le fichier"
                        : "Choisir le fichier"}
                  </button>
                  <input
                     type="file"
                     id="image"
                     name="image"
                     accept=".jpg,.jpeg,.png,.gif"
                     onChange={(e) => updateImageDisplay(e)}
                  />
               </div>
               {selectedImage ? (
                  <img src={window.URL.createObjectURL(selectedImage)} />
               ) : null}
               <p>{textImage}</p>
               {selectedImage ? (
                  <div
                     className="deleteImage"
                     onClick={() => handleResetImage()}
                  >
                     <FontAwesomeIcon icon="xmark" />
                  </div>
               ) : null}
            </div>
            <input
               className="containerInputPost__buttonSubmit"
               type="submit"
               value="Envoyer"
            />
         </form>
      </div>
   );
};

export default InputPost;
