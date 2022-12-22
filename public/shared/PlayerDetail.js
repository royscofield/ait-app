/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect } from "react";

import Line from "public/shared/Line";
import Title from "public/shared/Title";
import RewardList from "./RewardList";
import CloseButton from "./CloseButton";
import ParticipantAvt from "./ParticipantAvatar";
import Button from "./Button";

export default function PlayerDetail({player, reward, isAdmin = false}) {
    const content = (
        <div className="absolute bottom-0 left-0 h-[70%] w-full bg-white rounded-t-2xl p-4 z-30"
            onClick={(e) => e.stopPropagation()}>
            {player?<div>
                <div className="mx-auto mb-4 h-20 w-20 object-cover rounded-full" src={player.pic}>
                    <ParticipantAvt player={player} />
                </div>
                <Title title={player.nameDisplay} fontSize={"text-[20px]"} />
                {isAdmin?
                    <div className="h-10 w-60 mx-auto">
                        <Button content={"ĐUỔI KHỎI SỰ KIỆN"} primaryColor={"#FF6262"} isSquare={false} margin={"my-2"} fontSize={"text-sm"} />
                    </div>:<></>}
            </div>:<></>}
            <Line content="Giải thưởng" margin="my-2" />
            {reward.length > 0 ? <>
                <RewardList listReward={reward} />
                {isAdmin?<Button content={"HỦY GIẢI THƯỞNG"} primaryColor={"#FF6262"} isSquare={true} margin={"my-2"} />:<></>}
            </>:
            <div className="flex items-center justify-between h-8 rounded-full px-4 mb-2 bg-[#D9D9D9]">
                <p className="w-full items-center text-center text-[#004599] text-[18px] font-extrabold">KHÔNG CÓ</p>
            </div>}
            <CloseButton parentDivID={"playerDetailOverlay"} />
        </div>
    )

    return (
        <>
            {content}
        </>
    )
}
