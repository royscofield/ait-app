import React from "react";

export default function GradientLine({color1, color2, content}) {
    const gradientCSS = `bg-gradient-to-r from-[${color1}] to-[${color2}]`
    let bgColor = "bg-white"
    if(content === "") {
        bgColor = ""
    }

    return (
        <div className={`w-full h-[2px] my-4 ${gradientCSS} relative flex justify-center`}>
            <p className={`absolute top-[-50%] transform translate-y-[-50%] px-[10px] text-[#003B93] font-semibold ${bgColor}`}>{content}</p>
        </div>
    )
}