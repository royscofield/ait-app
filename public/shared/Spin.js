import React, { useEffect, useState, useMemo } from "react";
import ParticipantAvt from "./ParticipantAvatar";

const cssSet = [
    {
        transform: "translateY(-120px) scale(0.8)",
        zIndex: 6
    }, {
        transform: "translateY(-110px) scale(0.85)",
        zIndex: 7
    }, {
        transform: "translateY(-90px) scale(0.9)",
        zIndex: 8
    }, {
        transform: "translateY(-55px) scale(0.95)",
        zIndex: 9
    }, {
        transform: "translateY(0px) scale(1)",
        zIndex: 10
    }, {
        transform: "translateY(55px) scale(0.95)",
        zIndex: 9
    }, {
        transform: "translateY(90px) scale(0.9)",
        zIndex: 8
    }, {
        transform: "translateY(110px) scale(0.85)",
        zIndex: 7
    }, {
        transform: "translateY(120px) scale(0.8)",
        zIndex: 6
    }
]

export default function Spin({listPlayer}) {
    const [showcase, setShowcase] = useState([...listPlayer])

    useEffect(() => {
        setShowcase([...listPlayer]);
    }, [listPlayer])
    
    const listPlayerShowcase = (
        <div className="flex flex-col h-full justify-center w-full z-0 relative overflow-hidden">
            {/* <div className="animate-move-down-0 animate-move-down-1 animate-move-down-2 animate-move-down-3 animate-move-down-4 animate-move-down-5 animate-move-down-6 animate-move-down-7" /> */}
            {/* <div className="animate-slow-move-down-0 animate-slow-move-down-1 animate-slow-move-down-2 animate-slow-move-down-3 animate-slow-move-down-4 animate-slow-move-down-5 animate-slow-move-down-6 animate-slow-move-down-7" /> */}
            {
                Array.from({length: 9}, (_, index) => index).map(idx => {
                    return (
                        <div key={idx} className="h-0" style={cssSet[idx]} id={"spin-idx-"+idx}>
                            <div className="bg-[#E9E9E9] h-28 -translate-y-[50%] flex items-center rounded-lg shadow-[0_0_10px_0_rgba(0,0,0,0.25)] py-4 px-6 gap-2">
                                {
                                    showcase.length?
                                    <>
                                        <div className="h-20 w-20">
                                            <ParticipantAvt player={showcase[idx]} />
                                        </div>
                                        <p className="text-center grow font-bold text-[20px] truncate">{showcase[idx].nameDisplay}</p>
                                    </>:
                                    <></>
                                }
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )

    return (
        <>
            <div className="flex flex-col h-full justify-center w-full mt-2 z-0 relative">
                {listPlayerShowcase}
                <div className="flex flex-col w-full h-full absolute top-0 z-30">
                    <div className="grow bg-gradient-to-b from-white"></div>
                    <div className="w-[104%] border-4 rounded-sm z-20 h-32 -ml-[2%] border-[#FFCE1F]"></div>
                    <span className="absolute top-[50%] -mt-5 -ml-5">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 fill-[#FFCE1F]">
                            <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                        </svg>
                    </span>
                    <div className="grow bg-gradient-to-t from-white"></div>
                    <span className="absolute top-[50%] right-0 -mt-5 -mr-5 rotate-180">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 fill-[#FFCE1F]">
                            <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                        </svg>
                    </span>
                </div>
            </div>
        </>
    );
}
