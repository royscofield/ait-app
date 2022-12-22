import React from "react";
import { TEXT } from "../util/colors";
export default function LineWithText({ text, leftColor, rightColor }) {
  return (
    <div className="w-full h-2 justify-center items-center flex mb-5 flex-row">
      <div className={`flex-grow h-[2px] ${leftColor}`}></div>
      {text ? <span className={`mx-2 text-[${TEXT}]`}>{text}</span> : <></> }
      <div className={`flex-grow h-[2px] ${rightColor}`}></div>
    </div>
  );
}
