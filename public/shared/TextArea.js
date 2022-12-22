import React, { useImperativeHandle, useRef, forwardRef } from "react";

function AuthInput(props, ref) {

    const contentCSS = {
        background: "-webkit-linear-gradient(45deg, #003B93, #00F0FF)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
    };

    return (
        <div className="bg-gradient-to-r from-[#003B93] to-[#00F0FF] p-[2px] h-full w-full rounded-[10px] py-[2px] outline-none relative">
            <div className="h-full w-full">
                <textarea
                    ref={ref}
                    className="h-full w-full rounded-lg px-2 py-2 outline-none border-none"
                    rows={props.row}
                    value={props.value}
                    onChange={props.onChange}
                    maxLength={props.maxLength}
                    required
                />
                <div className="bg-white absolute w-full top-0">
                    <label
                        htmlFor=""
                        className="absolute px-[10px] mx-[15px] bg-white transform translate-y-[-50%] left-0"
                    >
                        <p style={contentCSS} className="font-bold text-[16px]">
                            {props.content}
                        </p>
                    </label>
                </div>
            </div>
        </div>
    );
}

export default forwardRef(AuthInput)