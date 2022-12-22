/* eslint-disable jsx-a11y/alt-text */
import { logo } from "public/util/functions";
import React from "react";

export default function Logo() {
  return (
    <div className="flex flex-col justify-center mb-2 h-1/3 w-auto">
      <img className=" w-full h-auto mb-2 motion-safe:animate-bounce" src={logo}></img>
    </div>
  );
}
