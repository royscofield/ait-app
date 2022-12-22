import React, { useState, forwardRef } from "react";

function AuthInput(props, ref) {
  const contentCSS = {
    background: "-webkit-linear-gradient(45deg, #003B93, #00F0FF)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  };

  return (
    <div
      className={`bg-gradient-to-r from-[${props.leftColor}] to-[${props.rightColor}] p-[2px] rounded-[10px] w-full h-[60px] py-[2px] my-4 outline-none relative`}
    >
      <div className="h-full">
        <input
          ref={ref}
          type={props.type}
          className="h-full w-full rounded-lg text-lg px-4 outline-none border-none"
          onChange={props.onChange}
          value={props.value}
          required
        />
        <div className="bg-white absolute w-full top-0">
          <label
            htmlFor=""
            className="absolute px-[10px] mx-[15px] bg-white transform translate-y-[-50%] left-0"
          >
            <p style={contentCSS} className="font-bold text-base">
              {props.content}
            </p>
          </label>
        </div>
      </div>
    </div>
  );
}

export default forwardRef(AuthInput)
