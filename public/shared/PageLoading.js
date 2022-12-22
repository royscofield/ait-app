import React, { useEffect, useState } from "react";
// Hiển thị màn hình chờ
// Dùng khi chưa load được dữ liệu hoặc khi chưa muốn hiển thị nội dung trang

export default function PageLoading() {
    return (
        <section className="relative h-screen px-5 py-5 mx-auto flex flex-col justify-center items-center w-full bg-gradient-to-t from-[#003B93] to-[#00F0FF]">
            <div className="flex mb-5 logoLoading">
                <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                    width="170.000000pt" height="163.000000pt" viewBox="0 0 170.000000 163.000000"
                    preserveAspectRatio="xMidYMid meet"
                    className="fill_white">
                        <g transform="translate(0.000000,163.000000) scale(0.100000,-0.100000)"
                        fill="#004599" stroke="#000">
                        <path d="M717 1610 c-333 -56 -578 -286 -652 -611 -20 -92 -20 -245 0 -340 36
                        -161 156 -355 278 -447 50 -37 193 -121 207 -122 3 0 5 39 6 88 1 140 55 269
                        164 397 197 229 241 300 282 450 31 114 31 307 0 422 -12 45 -31 102 -42 127
                        l-19 46 -88 -1 c-48 -1 -110 -5 -136 -9z"/>
                        <path d="M1344 1277 c-1 -134 -4 -162 -28 -240 -55 -183 -124 -282 -310 -442
                        -72 -61 -148 -131 -169 -154 -75 -83 -123 -228 -115 -347 l3 -49 64 -3 c70 -3
                        81 3 81 50 0 50 42 141 87 189 50 54 102 79 240 115 130 35 185 64 258 138
                        179 179 205 460 64 699 -36 61 -152 197 -168 197 -3 0 -6 -69 -7 -153z"/>
                        </g>
                </svg>
            </div>
            <div className="flex">

                <p className="text-white font-bold text-2xl">
                    ĐANG TẢI
                </p>
                <span><p className="animate-[bounce_0.75s_ease-in-out_infinite] delay-200 ml-1 text-white font-[900] text-2xl">.</p></span>
                <span><p className="animate-[bounce_0.75s_ease-in-out_infinite_0.25s] ml-1 text-white font-[900] text-2xl">.</p></span>
                <span><p className="animate-[bounce_0.75s_ease-in-out_infinite_0.5s] ml-1 text-white font-[900] text-2xl">.</p></span>
            </div>
        </section>
    )
}