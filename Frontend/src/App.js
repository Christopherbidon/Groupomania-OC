import React, { useEffect, useState } from "react";
import Blog from "./components/Blog";
import Connexion from "./components/Connexion";

const App = () => {
   const [user, setUser] = useState(null);
   useEffect(() => {
      setUser(JSON.parse(sessionStorage.getItem("user")));
   }, []);

   return (
      <div className="main">{user ? <Blog user={user} /> : <Connexion />}</div>
   );
};

export default App;
