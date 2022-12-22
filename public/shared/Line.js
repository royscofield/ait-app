import React from "react";
import { LEFT_GRADIENT, RIGHT_GRADIENT } from "public/util/colors";

export default function Line({
  content, // nội dung được hiển thị trên Line
  isLineWhite = false, // nếu line màu trắng thì true
  lineWeight = true, // mặc đinh line dày 2px, nếu false thì dày 1px
  margin = "", // truyền margin theo class tailwindcss
}) {
  return (
    <div
      className={`w-full justify-center items-center flex flex-row
        ${margin}`}
    >
      <div
        className={`flex-grow relative flex justify-center
          ${lineWeight ? "h-[2px]" : "h-[1px]"}  
          ${isLineWhite ? "bg-white" : LEFT_GRADIENT}`}
      ></div>
      <span
        className={`mx-2 relative bottom-[3px] text-transparent text-base bg-clip-text font-semibold 
          ${isLineWhite ? "bg-white" : LEFT_GRADIENT} 
          ${content ? "" : "hidden"}`}
      >
        {content}
      </span>
      <div
        className={`flex-grow relative flex justify-center
          ${lineWeight ? "h-[2px]" : "h-[1px]"}  
          ${isLineWhite ? "bg-white" : RIGHT_GRADIENT}`}
      ></div>
    </div>
  );
}
