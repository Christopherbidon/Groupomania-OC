import React, { useState } from "react";
import logo from "../assets/images/icon-left-font-monochrome-white.svg";
import Profile from "./Profile";

const Header = ({ functionUpdateDataUser, user, functionNewPopup }) => {
   const [popupProfile, setPopupProfile] = useState(false);
   const [hamburgerMenu, setHamburgerMenu] = useState(false);

   const handleLogout = () => {
      sessionStorage.removeItem("user");
      window.location.reload();
   };

   const handleClickProfile = () => {
      popupProfile ? setPopupProfile(false) : setPopupProfile(true);
   };

   const hamburgerMenuClick = () => {
      hamburgerMenu ? setHamburgerMenu(false) : setHamburgerMenu(true);
   };

   return (
      <header className="header">
         {popupProfile ? (
            <>
               <div className="popupProfileBackground">
                  <Profile
                     functionUpdateDataUser={functionUpdateDataUser}
                     user={user}
                     functionHandleClickProfile={handleClickProfile}
                     functionNewPopup={functionNewPopup}
                  />
               </div>
            </>
         ) : null}
         <div
            className={hamburgerMenu ? "hamburgerMenu active" : "hamburgerMenu"}
            onClick={() => hamburgerMenuClick()}
         >
            <span></span>
            <span></span>
            <span></span>
         </div>
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
