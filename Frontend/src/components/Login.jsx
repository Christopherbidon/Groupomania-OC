import axios from "axios";
import React, { useState } from "react";

const API_URL = "http://localhost:4000/users/";

const Login = ({ functionUpdateDataUser, functionNewPopup }) => {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");

   const handleLogin = (e) => {
      e.preventDefault();
      axios
         .post(API_URL + "login", {
            email,
            password,
         })
         .then((res) => {
            if (res.data.token) {
               sessionStorage.setItem("user", JSON.stringify(res.data));
               functionUpdateDataUser();
            }
         })
         .catch((err) => {
            console.log(err);
            functionNewPopup(err.response.data.message, "error");
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
            <input type="submit" value="Se Connecter" />
         </form>
      </div>
   );
};

export default Login;
