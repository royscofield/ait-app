import React, { useEffect, useState } from "react";

export default function ParticipantAvt({player}) {
    return (
        <>
            {
                player.pic && player.pic !== ""?
                <img className="h-full w-full object-cover rounded-full m-auto"
                    src={player.pic}
                    alt={player.nameDisplay} />
                :<div className="h-full w-full rounded-full bg-[#9A79E3] flex items-center justify-center">
                    <p className="text-white text-4xl font-bold text-center items-center uppercase">
                        {player.nameDisplay?player.nameDisplay.split(" ").pop()[0]:""}
                    </p>
                </div>
            }
        </>
    )
}