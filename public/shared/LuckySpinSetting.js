import React, { useEffect, useState } from "react";
import Button from "./Button";

// Fire base
import { db } from "src/firebase";
import { getDatabase, ref, set, child, get, onValue, update, query, orderByChild, equalTo } from "firebase/database";

export default function LuckySpinSetting({router}) {
    // const linkPath = router.pathname.split("/");
    // const [isAdmin, setIsAdmin] = useState(false);
    const [musicVol, setMusicVol] = useState(80);
    const [soundVol, setSoundVol] = useState(0);
    const [muteMusic, setMuteMusic] = useState(true);
    const [muteSound, setMuteSound] = useState(true);

    useEffect(() => {
        document.getElementById("gameSound").volume = soundVol/100;
        document.getElementById("gameMusic").volume = musicVol/100;
    }, [])

    useEffect(() => {
        if (!muteMusic && musicVol > 0) {
            document.getElementById("gameMusicVolume").classList.remove("muteInput");
            document.getElementById("gameMusic").play();
        } else if (musicVol === 0 || muteMusic) {
            document.getElementById("gameMusicVolume").classList.add("muteInput");
            setMuteMusic(true)
            document.getElementById("gameMusic").pause();
        };
    }, [musicVol, muteMusic])

    useEffect(() => {
        if (!muteSound && soundVol > 0) {
            document.getElementById("gameSoundVolume").classList.remove("muteInput");
        } else if (soundVol === 0 || muteSound) {
            document.getElementById("gameSoundVolume").classList.add("muteInput");
            setMuteSound(true)
        };
    }, [soundVol, muteSound])

    function setBackgroundSize(id) {
        const input = document.getElementById(id + "Volume");
        const value = getBackgroundSize(input);
        // input.style.setProperty("--background-size", `${value}%`);
        if (id === "gameMusic") {
            setMuteMusic(false);
            setMusicVol(value)
        } else {
            setMuteSound(false);
            setSoundVol(value)
        };
        document.getElementById(id).volume = value/100;
    }

    function getBackgroundSize(input) {
        const min = +input.min || 0;
        const max = +input.max || 100;
        const value = +input.value;
        const size = (value - min) / (max - min) * 100;
        return size;
    }

    return (
        <div className="flex flex-col px-3 gap-4">
            <audio loop className="hidden" id="gameMusic" volume={8}>
                <source src="https://joeybabcock.me/blog/wp-content/uploads/2019/05/lobby-classic-game-halloween.mp3" type="audio/mpeg"></source>
            </audio>
            <audio className="hidden" id="gameSound" volume={0}>
                <source src="https://wheelofnames.com/sounds/ding.mp3" type="audio/mpeg"></source>
            </audio>
            <div className="flex gap-2">
                <label htmlFor="gameSoundVolume" className={!muteMusic?"bg-[#40BEE5] w-10 h-10 p-2 rounded-full":"bg-[#888] w-10 h-10 p-2 rounded-full"}
                    onClick={() => setMuteMusic(value => !value)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 fill-white pointer-events-none">
                        {
                            !muteMusic?
                            <path fillRule="evenodd" d="M19.952 1.651a.75.75 0 01.298.599V16.303a3 3 0 01-2.176 2.884l-1.32.377a2.553 2.553 0 11-1.403-4.909l2.311-.66a1.5 1.5 0 001.088-1.442V6.994l-9 2.572v9.737a3 3 0 01-2.176 2.884l-1.32.377a2.553 2.553 0 11-1.402-4.909l2.31-.66a1.5 1.5 0 001.088-1.442V9.017 5.25a.75.75 0 01.544-.721l10.5-3a.75.75 0 01.658.122z" clipRule="evenodd" />
                            :<>
                            <path fillRule="evenodd" d="M19.952 1.651a.75.75 0 01.298.599V16.303a3 3 0 01-2.176 2.884l-1.32.377a2.553 2.553 0 11-1.403-4.909l2.311-.66a1.5 1.5 0 001.088-1.442V6.994l-9 2.572v9.737a3 3 0 01-2.176 2.884l-1.32.377a2.553 2.553 0 11-1.402-4.909l2.31-.66a1.5 1.5 0 001.088-1.442V9.017 5.25a.75.75 0 01.544-.721l10.5-3a.75.75 0 01.658.122z" clipRule="evenodd" />
                            <path fillRule="evenodd" d="M0 1.5 L22.5 24 L24 22.5 L1.5 0 L0 1.5" clipRule="evenodd" />
                            </>
                        }
                    </svg>
                </label>
                <input type="range" id="gameMusicVolume" name="gameMusicVolume" min="0" max="10" defaultValue="8" className="grow muteInput"
                    style={{"--background-size": musicVol + "%"}}
                    onInput={() => setBackgroundSize("gameMusic")}></input>
            </div>
            <div className="flex gap-2">
                <label htmlFor="gameMusicVolume" className={!muteSound?"bg-[#40BEE5] w-10 h-10 p-2 rounded-full":"bg-[#888] w-10 h-10 p-2 rounded-full"}
                    onClick={() => setMuteSound(value => !value)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 fill-white pointer-events-none">
                        {
                            !muteSound?
                            <>
                                <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
                                <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
                            </>:
                            <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM17.78 9.22a.75.75 0 10-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 001.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 101.06-1.06L20.56 12l1.72-1.72a.75.75 0 00-1.06-1.06l-1.72 1.72-1.72-1.72z" />                        }
                    </svg>
                </label>
                <input type="range" id="gameSoundVolume" name="gameSoundVolume" min="0" max="10" defaultValue="0" className="grow muteInput"
                    style={{"--background-size": soundVol + "%"}}
                    onInput={() => setBackgroundSize("gameSound")}></input>
            </div>
            {/* <Button content={isAdmin?"KẾT THÚC SỰ KIỆN":"THOÁT"} primaryColor={"#FF6262"} isSquare={true} marginY={2} onClick={isAdmin?finishEvent:exitEvent} /> */}
        </div>
    )
}