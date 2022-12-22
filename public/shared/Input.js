import React from "react";
import { LEFT_COLOR, RIGHT_COLOR } from "public/util/colors";

export default function Input({
  content, // Nội dung hiển thị trên Input
  isTextGradient = true,
  labelFor, // Nội dung được điền vào input sẽ được gán cho label này
  noContent = false, // Nếu là True thì Input sẽ không có label và placeHolder được hiển thị ở giữa Input
  placeHolder = "", // Mô tả/giải thích cho nội dung được nhập vào input
  type, // Loại input
  primaryColor = LEFT_COLOR, // Thay thế cho leftColor ở component AuthInput cũ
  secondaryColor = RIGHT_COLOR, // Thay thế cho rightColor ở component AuthInput cũ
  maxLength = 100,
  value,
  onChange,
  row = 1,
  children,
  isMultiLine = false,
}) {
  const contentCSS = {
    background: "-webkit-linear-gradient(45deg, #003B93, #00F0FF)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  };
  return (
    <div
      className={`p-[2px] rounded-[10px] w-full min-h-[60px] my-4 outline-none relative flex flex-col
      bg-gradient-to-r from-[${primaryColor}] to-[${secondaryColor}]`}
    >
      <div className="h-full grow flex flex-col">
        <input
          type={type}
          className={`min-h-[60px] w-full rounded-lg text-lg px-4 outline-none border-none 
          ${noContent ? "text-center" : ""} 
          ${children ? "hidden" : ""} ${!isMultiLine ? "" : "hidden"}`}
          placeholder={placeHolder}
          onChange={onChange}
          value={value}
          maxLength = {maxLength}
          required
        />
        <textarea
          className={`min-h-[60px] w-full rounded-lg px-4 py-4 text-lg outline-none border-none 
            ${isMultiLine ? "" : "hidden"}`}
          rows={row}
          value={value}
          onChange={onChange}
          maxLength = {maxLength}
          required
        />
        <div className="bg-white absolute w-full top-0">
          <label
            htmlFor={labelFor}
            className="absolute px-[10px] mx-[15px] bg-white transform translate-y-[-50%] left-0"
          >
            <p
              style={isTextGradient ? contentCSS : {}}
              className={`font-bold text-base 
                ${noContent ? "hidden" : ""}`}
            >
              {content}
            </p>
          </label>
        </div>
        <div className={children ? "bg-white rounded-lg px-5" : ""}>
          {children}
        </div>
      </div>
    </div>
  );
}
