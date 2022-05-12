import React, { useEffect, useState } from "react";
import AllPosts from "./components/AllPosts";
import Connexion from "./components/Connexion";

const App = () => {
   const [user, setUser] = useState(null);
   useEffect(() => {
      setUser(JSON.parse(sessionStorage.getItem("user")));
   }, []);

   return (
      <div className="main">
         {user ? <AllPosts user={user} /> : <Connexion />}
      </div>
   );
};

export default App;
