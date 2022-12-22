import React, { useEffect, useState } from "react";
import { render } from "react-dom";
import PlayerDetail from "./PlayerDetail";
import OverlayBlock from "./OverlayBlock";
import ParticipantAvt from "./ParticipantAvatar";

export default function PlayerList({listPlayer = undefined, listType = "List", changeButton = true, listReward = [], isAdmin = false}) {
    const [typeList, setTypeList] = useState(listType);
    const [playerChosing, setPlayerChosing] = useState(undefined);

    const PlayerList_List = (
        <div className="flex flex-col divide-y divide-white/50">
            {
                listPlayer!==undefined?listPlayer.map((player, idx) => {
                    const reward = listReward.find((val) => val.idReward === player.idReward);
                    return (
                        <div key={idx} className="relative group h-fit flex py-2 px-6 gap-4 text-[#004599] text-base hover:text-lg cursor-pointer" onClick={() => openPlayerDetailByIndex(idx)}>
                            <div className="transition-all relative h-16 w-20 group-hover:w-20 group-hover:h-20 group-hover:-ml-1">
                                <span className="block absolute right-4 bottom-1 h-3 w-3 rounded-full group-hover:right-2 group-hover:bottom-2 group-hover:h-4 group-hover:w-4"
                                    style={{backgroundColor: (player.status === 1 ? "green" : "gray")}}></span>
                                <div className="transition-all h-16 w-16 border-2 rounded-full group-hover:h-20 group-hover:w-20 group-hover:-ml-2" src={player.pic}
                                    style={{borderColor: (player.idReward !== ""?"yellow":"gray")}}>
                                        <ParticipantAvt player={player} />
                                </div>
                            </div>
                            <div className="flex flex-col justify-center ">
                                <p className="h-fit text-left uppercase font-bold mt-2 group-hover:mt-4 truncate">{player.nameDisplay}</p>
                                {reward?<p className="h-fit text-left font-semibold">{reward.nameReward}</p>:<></>}
                            </div>
                        </div>
                    )
                }):<></>
            }
        </div>
    )
    
    const openPlayerDetailByIndex = (idx) => {
        if (document.getElementById("playerDetail").classList.contains("hidden"))
            document.getElementById("playerDetail").classList.remove("hidden");
        document.getElementById("playerDetailOverlay").classList.toggle("hidden");
        setPlayerChosing(idx);
    }

    const PlayerList_Menu = (
        <div className="grid grid-flow-row grid-cols-4 mt-2 grow min-h-fit h-28">
            {
                listPlayer!==undefined?listPlayer.map((player, idx) => {
                    return (
                        <div key={idx} className="group min-h-26 w-full py-2 flex flex-col justify-start items-center cursor-pointer" onClick={() => openPlayerDetailByIndex(idx)}>
                            <div className="transition-all relative h-16 w-16 group-hover:w-16 group-hover:h-16 group-hover:-ml-1">
                                <span className="block absolute right-1 bottom-1 h-3 w-3 rounded-full group-hover:right-0 group-hover:-bottom-1 group-hover:h-4 group-hover:w-4"
                                    style={{backgroundColor: (player.status === 1 ? "green" : "gray")}}></span>
                                <div className="transition-all h-16 w-16 border-2 rounded-full group-hover:h-20 group-hover:w-20 group-hover:-ml-2 group-hover:-mt-2" src={player.pic}
                                    style={{borderColor: (player.idReward !== ""?"yellow":"gray")}}>
                                        <ParticipantAvt player={player} />
                                </div>
                            </div>
                            <p className="px-2 w-full text-center h-5 mt-2 text-[#004599] font-bold uppercase truncate">{player.nameDisplay?player.nameDisplay.split(" ").pop():""}</p>
                        </div>
                    )
                }):<></>
            }
        </div>
    )

    useEffect(() => {
        if (listPlayer[playerChosing] === undefined) return;
        const detail = (<PlayerDetail player={listPlayer[playerChosing]} reward={listReward.filter((val) => val.idReward === listPlayer[playerChosing].idReward)} isAdmin={isAdmin} />);
        if (playerChosing!==undefined) render(detail, document.getElementById('playerDetail'));
    }, [playerChosing])

    return (
        <>
            {changeButton?
            <div className="flex justify-end w-full -mt-3 gap-2">
                <span className="cursor-pointer" onClick={() => setTypeList("Menu")}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" style={{fill: typeList!=="List"?"white":"gray"}}>
                        <path fillRule="evenodd" d="M3 6a3 3 0 013-3h2.25a3 3 0 013 3v2.25a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm9.75 0a3 3 0 013-3H18a3 3 0 013 3v2.25a3 3 0 01-3 3h-2.25a3 3 0 01-3-3V6zM3 15.75a3 3 0 013-3h2.25a3 3 0 013 3V18a3 3 0 01-3 3H6a3 3 0 01-3-3v-2.25zm9.75 0a3 3 0 013-3H18a3 3 0 013 3V18a3 3 0 01-3 3h-2.25a3 3 0 01-3-3v-2.25z" clipRule="evenodd" />
                    </svg>
                </span>
                <span className="cursor-pointer" onClick={() => setTypeList("List")}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" style={{fill: typeList==="List"?"white":"gray"}}>
                        <path fillRule="evenodd" d="M2.625 6.75a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875 0A.75.75 0 018.25 6h12a.75.75 0 010 1.5h-12a.75.75 0 01-.75-.75zM2.625 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zM7.5 12a.75.75 0 01.75-.75h12a.75.75 0 010 1.5h-12A.75.75 0 017.5 12zm-4.875 5.25a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875 0a.75.75 0 01.75-.75h12a.75.75 0 010 1.5h-12a.75.75 0 01-.75-.75z" clipRule="evenodd" />
                    </svg>
                </span>
            </div>:<></>}
            <div className="overflow-auto grow">
                {typeList==="List"?PlayerList_List:PlayerList_Menu}
            </div>
            {listPlayer.length?<OverlayBlock childDiv={<div className="hidden" id="playerDetail"></div>} id={"playerDetailOverlay"} manual={true} />:<></>}
        </>
    )
}