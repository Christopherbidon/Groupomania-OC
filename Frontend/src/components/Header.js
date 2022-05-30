import axios from "axios";
import React, { useEffect, useState } from "react";
import logo from "../assets/images/icon-left-font-monochrome-white.svg";

const Header = ({ user }) => {
   const handleLogout = () => {
      sessionStorage.removeItem("user");
      window.location.reload();
   };
   return (
      <header className="header">
         <div className="header__logoContainer">
            <img src={logo} alt="logo de Groupomania" />
         </div>
         <nav className="navbar">
            <ul>
               <li>
                  <div className="headerAvatar">
                     <img src={user.avatarUrl} alt="" />
                  </div>
                  Profil
               </li>
               <li onClick={() => handleLogout()}>Se déconnecter</li>
            </ul>
         </nav>
      </header>
   );
};

export default Header;
