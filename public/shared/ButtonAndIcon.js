import React from "react";
export default function ButtonAndIcon({ content, onClick, classIcon, colorHex }) {

    const iconStyle = {
        color:"white",
        fontSize:"24px"
    }

    const buttonColor = {
        background:`${colorHex}`
    }

  return (
    <>
        <button className="flex justify-evenly items-center w-full h-[50px] rounded-[5px]" style={buttonColor}
        onClick={onClick}>
            <div className="font-[900] text-[24px] text-white">
                {content}
            </div>
            <i className={classIcon} style={iconStyle}></i>
        </button>
    </>
  );
}
