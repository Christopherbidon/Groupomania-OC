import React, { useState } from "react";
import logo from "../assets/images/icon-left-font-monochrome-white.svg";
import Profile from "./Profile";

const Header = ({ user }) => {
   const [popupProfile, setPopupProfile] = useState(false);

   const handleLogout = () => {
      sessionStorage.removeItem("user");
      window.location.reload();
   };

   const handleClickProfile = () => {
      popupProfile ? setPopupProfile(false) : setPopupProfile(true);
   };

   return (
      <header className="header">
         {popupProfile ? (
            <>
               <div className="popupProfileBackground">
                  <Profile
                     user={user}
                     functionHandleClickProfile={handleClickProfile}
                  />
               </div>
            </>
         ) : null}
         <div className="header__logoContainer">
            <img src={logo} alt="logo de Groupomania" />
         </div>
         <nav className="navbar">
            <ul>
               <li onClick={() => handleClickProfile()}>
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
