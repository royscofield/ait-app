// layout for page
import Auth from "layouts/Auth.js";
import React, { useState, useEffect } from "react";


export default function CloseButton({parentDivID, fillColor="#FF0000"}) {
    const closeParentDiv = (e) => {
        // console.log(parentDivID);
        if (parentDivID === undefined) e.target.parentNode.classList.add("hidden");
        else document.getElementById(parentDivID).classList.add("hidden");
    }

    return (
        <>
            <button type="button" className="absolute top-[10px] right-[10px] z-40" onClick={closeParentDiv} id="close-btn">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={fillColor} className="w-6 h-6 pointer-events-none">
                    <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                </svg>
            </button>
        </>
    )
}