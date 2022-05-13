import axios from "axios";
import React, { useState } from "react";
import Popup from "./Popup";

const API_URL = "http://localhost:4000/users/";
const SignUp = () => {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [secondPassword, setSecondPassword] = useState("");
   const [name, setName] = useState("");
   const [firstname, setFirstname] = useState("");
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

   const handleSignup = (e) => {
      e.preventDefault();
      if (password === secondPassword) {
         axios
            .post(API_URL + "signup", {
               email,
               password,
               name,
               firstname,
            })
            .then((res) => {
               console.log(res);
               setMessagePopup("Utilisateur créer avec succès !");
               setValuePopup("valid");
               popupTimeOut();
            })
            .catch((err) => {
               const codeError = err.response.data.err.code;
               console.log(codeError);
               if (codeError == 23505) {
                  setMessagePopup("Cette adresse e-mail est deja utilisée");
                  setValuePopup("error");
                  popupTimeOut();
                  console.log("ok");
               }
            });
      } else {
         setMessagePopup("Les mots de passes ne sont pas identique");
         setValuePopup("error");
         popupTimeOut();
      }
   };

   return (
      <div className="form form__signup">
         {popup ? <Popup value={valuePopup} popupText={messagePopup} /> : null}
         <form onSubmit={(e) => handleSignup(e)}>
            <input
               onChange={(e) => setName(e.target.value)}
               type="text"
               placeholder="Nom"
            />
            <input
               onChange={(e) => setFirstname(e.target.value)}
               type="text"
               placeholder="Prenom"
            />
            <input
               onChange={(e) => setEmail(e.target.value)}
               type="email"
               placeholder="Email"
               required
            />
            <input
               onChange={(e) => setPassword(e.target.value)}
               type="password"
               placeholder="Mot de passe"
               required
            />
            <input
               onChange={(e) => setSecondPassword(e.target.value)}
               type="password"
               placeholder="Retapez votre mot de passe"
               required
            />
            <p className="message_error"></p>
            <input type="submit" value="S'inscrire" />
         </form>
      </div>
   );
};

export default SignUp;
