import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";

library.add(fas);

const Popup = ({ value, popupText }) => {
   const valueCheck = () => {
      if (value == "valid") {
         return <FontAwesomeIcon icon="check" />;
      } else if (value == "error") {
         return <FontAwesomeIcon icon="xmark" />;
      } else {
         return;
      }
   };
   return (
      <div className={`popup popup__${value} `}>
         <div className="popup__iconContainer">{valueCheck()}</div>
         <div className="popup__textContainer">
            <p className="popup__text">{popupText}</p>
         </div>
      </div>
   );
};

export default Popup;
