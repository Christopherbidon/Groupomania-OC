import axios from "axios";
import React, { useState } from "react";
import Popup from "./Popup";

const API_URL = "http://localhost:4000/users/";

const Login = () => {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [messageError, setMessageError] = useState("");
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

   const handleLogin = (e) => {
      e.preventDefault();
      axios
         .post(API_URL + "login", {
            email,
            password,
         })
         .then((response) => {
            if (response.data.token) {
               sessionStorage.setItem("user", JSON.stringify(response.data));
               window.location.reload();
            }
         })
         .catch((err) => {
            console.log(err);
            setMessagePopup(err.response.data.error);
            setValuePopup("error");
            popupTimeOut();
         });
   };

   return (
      <div className="form form__login">
         {popup ? <Popup value={valuePopup} popupText={messagePopup} /> : null}
         <form onSubmit={(e) => handleLogin(e)}>
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
            <input type="submit" value="Se Connecter" />
         </form>
      </div>
   );
};

export default Login;
