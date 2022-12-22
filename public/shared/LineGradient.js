import React from "react";

export default function LineGradient({color}) {
  return (
    <div className="w-1/2 max-w-sm justify-center items-center flex mb-5 flex-row">
      <div className={`flex-grow h-px ${color}`}></div>
    </div>
  );
}
