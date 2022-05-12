import axios from "axios";
import React, { useState } from "react";

const API_URL = "http://localhost:4000/users/";

const Login = () => {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [messageError, setMessageError] = useState("");

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
            setMessageError(err.response.data.error);
         });
   };

   return (
      <div className="form form__login">
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
            {messageError ? (
               <p className="message_error">{messageError}</p>
            ) : null}
            <input type="submit" value="Se Connecter" />
         </form>
      </div>
   );
};

export default Login;
