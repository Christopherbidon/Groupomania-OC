import React, { useState } from "react";
import axios from "axios";

const ChangePassword = ({ user, functionNewPopup }) => {
   const [oldPassword, setOldPassword] = useState("");
   const [newPassword, setNewPassword] = useState("");
   const [secondNewPassword, setSecondNewPassword] = useState("");

   const changePassword = (e) => {
      e.preventDefault();
      const data = { password: oldPassword, newPassword: newPassword };
      if (newPassword !== secondNewPassword) {
         functionNewPopup(
            "Les nouveaux mot de passe ne sont pas identique",
            "error"
         );
         return;
      }
      if (newPassword === oldPassword) {
         functionNewPopup(
            "Votre nouveau mot de passe est identique à l'ancien",
            "error"
         );
         return;
      }
      console.log(user);
      axios
         .put("http://localhost:4000/users/modifyPassword", data, {
            headers: {
               Authorization: `beared ${user.token}`,
            },
         })
         .then((res) => {
            functionNewPopup(res.data.message, "valid");
            setNewPassword("");
            setOldPassword("");
            setSecondNewPassword("");
         })
         .catch((err) => {
            functionNewPopup(err.response.data.error, "error");
         });
   };

   return (
      <div className="changePasswordContainer">
         <form onSubmit={(e) => changePassword(e)}>
            <input
               type="password"
               placeholder="Ancier Mot de Passe"
               value={oldPassword}
               onChange={(e) => setOldPassword(e.target.value)}
               required
            />
            <input
               type="password"
               placeholder="Nouveau Mot de Passe"
               value={newPassword}
               onChange={(e) => setNewPassword(e.target.value)}
               required
            />
            <input
               type="password"
               placeholder="Retapez votre nouveau Mot de Passe"
               value={secondNewPassword}
               onChange={(e) => setSecondNewPassword(e.target.value)}
               required
            />
            <input type="submit" value="Valider" />
         </form>
      </div>
   );
};

export default ChangePassword;
