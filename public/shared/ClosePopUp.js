// layout for page
import Auth from "layouts/Auth.js";
import React, { useState, useEffect } from "react";

export default function ClosePopUp({
  addBackground = true,
  clickOutClose = true,
  closeAction,
}) {
  // const closeParentDiv = (e) => {
  //   e.target.parentNode.parentNode.classList.remove("bg-slate-600");
  //   e.target.parentNode.parentNode.classList.add("hidden");
  //   document.getElementById("popUpBG").classList.add("hidden");
  // };

  useEffect(() => {
    const popUpBG = document.createElement("div");
    popUpBG.classList = "absolute h-full w-full top-0 left-0 z-40 hidden";
    popUpBG.id = "popUpBG";
    document.querySelector("section").appendChild(popUpBG);

    if (addBackground) popUpBG.classList.add("bg-[#00000080]");
    if (clickOutClose) {
      const popUpBlock = document.getElementById("close-btn").parentNode;
      popUpBG.addEventListener("click", () => {
        popUpBlock.classList.add("hidden");
        popUpBG.classList.add("hidden");
      });
    }

    return () => {
      popUpBG.remove();
    };
  }, []);

  return (
    <>
      <button
        type="button"
        className="flex justify-end place-self-end
        items-end self-end justify-self-end"
        onClick={closeAction}
        id="close-btn"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-6 h-6 fill-[#FF0000] pointer-events-none"
        >
          <path
            fillRule="evenodd"
            d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </>
  );
}
