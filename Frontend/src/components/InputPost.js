import axios from "axios";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";

library.add(fas);

const InputPost = ({ user, functionGetData, functionNewPopup }) => {
   const [selectedImage, setSelectedImage] = useState(null);
   const [content, setContent] = useState("");

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
                     {selectedImage ? (
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
                     onChange={(e) => setSelectedImage(e.target.files[0])}
                  />
               </div>
               {selectedImage ? (
                  <>
                     <img
                        src={window.URL.createObjectURL(selectedImage)}
                        alt="Fichier sélectionner"
                     />
                     <div
                        className="deleteImage"
                        onClick={() => handleResetImage()}
                     >
                        <FontAwesomeIcon icon="xmark" />
                     </div>
                  </>
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
