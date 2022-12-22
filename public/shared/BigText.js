import React from "react";
import { TEXT } from "../util/colors";
export default function BigText({text, font}) {
  return (
    <p className={`text-[${TEXT}] ${font} font-bold uppercase mb-5`}>{text}</p>
  );
}
