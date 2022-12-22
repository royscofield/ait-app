import React from "react";

export default function BgBlueButton({ content, onClick }) {
  return (
    <>
      <button
        className="w-full h-[50px] my-4 bg-gradient-to-r from-[#003B93] to-[#00F0FF] rounded-[50px]"
        onClick={onClick}
      >
        <div className="font-[900] text-[24px] text-white">{content}</div>
      </button>
    </>
  );
}
