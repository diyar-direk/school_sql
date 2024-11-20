import React, { useContext } from "react";
import errorImg from "./error.png";
import completeImg from "./complete.png";
import "./overlay.css";
import { Context } from "../../context/Context";
const SendData = (props) => {
  const context = useContext(Context);
  const language = context && context.selectedLang;
  return (
    <div className="center response">
      <img
        src={props.response === true ? completeImg : errorImg}
        alt=""
        loading="lazy"
      />
      <h1>
        {props.response === true
          ? `${language.error && language.error.sent_successfully}`
          : props.response === 400
          ? `${props.data}${language.error && language.error.allready_exisits}`
          : `$${language.error && language.error.network_error}`}
      </h1>
    </div>
  );
};

export default SendData;
