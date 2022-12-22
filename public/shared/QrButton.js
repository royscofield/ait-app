import React from "react";
import { TEXT } from "../util/colors";
export default function QrButton({ onClick }) {
  return (
    <button
      type="button"
      className="w-1/2 max-w-sm flex-col items-center flex mb-5"
      onClick={onClick}
    >
      {/* <input type="file" accept="image/*;capture=camera" /> */}
      <img
        src={require("../img/qrCode.png")}
        className="w-12 h-12"
        alt="..."
      ></img>
      <span className={`font-medium text-[${TEXT}]`}>Quét mã QR</span>
    </button>
  );
}
