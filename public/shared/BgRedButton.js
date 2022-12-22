import React from "react";

export default function BgBlueButton({content, onClick}) {
    return (
        <>
            <button className="w-full h-[50px] bg-gradient-to-r from-[#ff0026] to-[#f37070] rounded-[50px]"
            onClick={onClick}>
                <div className="font-[900] text-[24px] text-white">
                    {content}
                </div>
            </button>
        </>
    )
}