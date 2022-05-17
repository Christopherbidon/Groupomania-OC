import React, { useEffect, useState } from "react";
import Connexion from "./components/Connexion";
import Main from "./components/Main";

const App = () => {
   const [user, setUser] = useState(null);
   useEffect(() => {
      setUser(JSON.parse(sessionStorage.getItem("user")));
   }, []);

   return (
      <div className="main">{user ? <Main user={user} /> : <Connexion />}</div>
   );
};

export default App;
