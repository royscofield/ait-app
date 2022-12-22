import React from "react";
import { TEXT } from "../util/colors";

export default function AuthFooter({ normalContent, boldContent, href }) {
  return (
    <p
      className={`text-[16px] text-[${TEXT}] self-center mt-8 text-center`}
    >
      <span>{normalContent + " "}</span>
      <a href={href} className="font-bold">
        {boldContent}
      </a>
    </p>
  );
}
