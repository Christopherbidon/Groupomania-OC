import axios from "axios";
import React, { useState } from "react";

const API_URL = "http://localhost:4000/users/";
const SignUp = () => {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [secondPassword, setSecondPassword] = useState("");
   const [civilite, setCivilite] = useState("");
   const [name, setName] = useState("");
   const [firstname, setFirstname] = useState("");
   const [messageError, setMessageError] = useState("");

   const handleSignup = (e) => {
      e.preventDefault();
      if (password === secondPassword) {
         axios
            .post(API_URL + "signup", {
               email,
               password,
               name,
               firstname,
               civilite,
            })
            .then((res) => console.log(res))
            .catch((err) => {
               const codeError = err.response.data.err.code;
               console.log(codeError);
               if (codeError == 23505) {
                  setMessageError("Cette adresse e-mail est deja utilisée");
                  console.log("ok");
               }
            });
      } else {
         setMessageError("Les mots de passes ne sont pas identique");
      }
   };

   return (
      <div className="form form__signup">
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
               placeholder="Retaper votre Mot de passe"
               required
            />
            <p className="message_error">{messageError}</p>
            <input type="submit" value="S'inscrire" />
         </form>
      </div>
   );
};

export default SignUp;
