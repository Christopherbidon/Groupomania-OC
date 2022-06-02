import React, { useEffect, useState } from "react";
import Blog from "./components/Blog";
import Connexion from "./components/Connexion";
import Popup from "./components/Popup";

const App = () => {
   const [user, setUser] = useState(null);
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

   const newPopup = (message, value) => {
      setMessagePopup(message);
      setValuePopup(value);
      popupTimeOut();
   };

   const getDataUser = () => {
      setUser(JSON.parse(sessionStorage.getItem("user")));
   };

   useEffect(() => {
      getDataUser();
   }, []);

   return (
      <>
         {popup ? <Popup value={valuePopup} popupText={messagePopup} /> : null}
         <div className="main">
            {user ? (
               <Blog functionNewPopup={newPopup} user={user} />
            ) : (
               <Connexion
                  functionUpdateDataUser={getDataUser}
                  functionNewPopup={newPopup}
               />
            )}
         </div>
      </>
   );
};

export default App;
