import React from "react";

export default function TickBox({ content, htmlFor, onChange }) {
  return (
    <>
      <input
        type="checkbox"
        className="border-[#004599] border"
        onChange={onChange}
      />
      <label htmlFor={htmlFor} className="ml-1 left-[-10px]">
        <p className="font-bold text-[#004599]">{content}</p>
      </label>
    </>
  );
}
