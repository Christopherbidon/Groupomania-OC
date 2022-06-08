import axios from "axios";
import React, { useEffect, useState } from "react";

const ChangeIdentity = ({ user, functionNewPopup }) => {
   const [name, setName] = useState("");
   const [firstname, setFristname] = useState("");

   useEffect(() => {
      axios
         .get(`http://localhost:4000/users/${user.userId}`, {
            headers: {
               Authorization: `beared ${user.token}`,
            },
         })
         .then((res) => {
            setFristname(res.data.firstname);
            setName(res.data.name);
         });
   }, []);

   const handleChangeIdentity = (e) => {
      e.preventDefault();
      console.log("identité changer");

      const data = { name: name, firstname: firstname };

      axios
         .put("http://localhost:4000/users/modifyIdentity", data, {
            headers: {
               Authorization: `beared ${user.token}`,
            },
         })
         .then((res) => {
            functionNewPopup(res.data.message, "valid");
         })
         .catch((err) => {
            functionNewPopup(err.response.data.error, "error");
         });
   };

   return (
      <div className="changeIdentityContainer">
         <form onSubmit={(e) => handleChangeIdentity(e)}>
            <label htmlFor="name">Nom :</label>
            <input
               type="text"
               name="name"
               placeholder="Nouveau Mot de Passe"
               value={name}
               onChange={(e) => setName(e.target.value)}
               required
            />
            <label htmlFor="firstname">Prénom :</label>
            <input
               type="text"
               name="firstname"
               placeholder="Retapez votre nouveau Mot de Passe"
               value={firstname}
               onChange={(e) => setFristname(e.target.value)}
               required
            />
            <input type="submit" value="Valider" />
         </form>
      </div>
   );
};

export default ChangeIdentity;
