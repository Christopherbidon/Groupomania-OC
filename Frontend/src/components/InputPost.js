import axios from "axios";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";

library.add(fas);

const InputPost = ({ user, functionGetData, functionNewPopup }) => {
   const [selectedImage, setSelectedImage] = useState();
   const [content, setContent] = useState("");
   const [textImage, setTextImage] = useState(
      "Veuillez sélectionner une image"
   );

   const updateImageDisplay = (e) => {
      const file = e.target.files[0];
      if (file.length === 0) {
         console.log("no file");
      } else {
         setTextImage(`Nom du Fichier : "` + file.name + ".");
         setSelectedImage(file);
      }
   };
   const handleSubmit = async (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append("content", content);
      formData.append("image", selectedImage);
      await axios
         .post("http://localhost:4000/posts", formData, {
            headers: { Authorization: `beared ${user.token}` },
         })
         .then((res) => {
            if (res.status == 201) {
               handleResetImage();
               setContent("");
               functionNewPopup(res.data.message, "valid");
            }
            functionGetData();
         })
         .catch((err) => {
            console.log(err);
         });
   };

   const handleResetImage = () => {
      setTextImage("Veuillez sélectionner une image");
      setSelectedImage(null);
   };
   return (
      <div className="containerInputPost">
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
                  <img
                     src={window.URL.createObjectURL(selectedImage)}
                     alt="Fichier sélectionner"
                  />
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
