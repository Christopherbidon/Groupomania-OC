import React, { useState } from "react";
import Login from "./Login";
import SignUp from "./SignUp";
import logo from "../assets/images/icon-left-font-monochrome-white.png";

const Connexion = ({ functionUpdateDataUser, functionNewPopup }) => {
   const [isSignUp, setIsSignUp] = useState(false);
   return (
      <div className="containerConnexion">
         <div className="containerConnexion__logo">
            <img src={logo} alt="logo de Groupomania"></img>
         </div>
         <div className="containerConnexion__form">
            <div className="containerForm">
               <div className="containerForm__containerButton">
                  <button
                     className={isSignUp ? "" : "buttonActive"}
                     onClick={() => setIsSignUp(false)}
                  >
                     Se connecter
                  </button>
                  <button
                     className={isSignUp ? "buttonActive" : ""}
                     onClick={() => setIsSignUp(true)}
                  >
                     S'inscrire
                  </button>
               </div>
               {isSignUp ? (
                  <SignUp
                     functionNewPopup={functionNewPopup}
                     functionSetIsSignup={setIsSignUp}
                  />
               ) : (
                  <Login
                     functionUpdateDataUser={functionUpdateDataUser}
                     functionNewPopup={functionNewPopup}
                  />
               )}
            </div>
         </div>
      </div>
   );
};

export default Connexion;
