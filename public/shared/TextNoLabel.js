import React from "react";

export default function TextNoLabel({type, placeholder, onChange, id}) {

  return (
    <div className="bg-gradient-to-r from-[#003B93] to-[#00F0FF] 
      p-[2px] rounded-lg w-full
      h-[60px] py-[2px] my-2
      ">
      <div className="h-full">
        <input
          type={type}
          id={id}
          placeholder={placeholder}
          onChange={onChange}
          className="
          placeholder-[#656565] text-center text-xl font-normal text-black bg-white
          h-full w-full rounded-lg outline-none border-none"
        />
      </div>
    </div>
  );
}
