import React from "react";
import AllPosts from "./AllPosts";
import InputPost from "./InputPost";

const Main = ({ user }) => {
   return (
      <main>
         <InputPost />
         <AllPosts user={user} />
      </main>
   );
};

export default Main;
