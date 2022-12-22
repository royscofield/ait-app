import React, { useCallback, useEffect, useState } from "react";
import Button from "public/shared/Button";
import Title from "public/shared/Title";
import { useMemo } from "react/cjs/react.development";
import Spin from "public/shared/Spin";
import CurrentEventDetail from "public/shared/CurrentEventDetail";
import OverlayBlock from "public/shared/OverlayBlock";
import LuckySpinSetting from "public/shared/LuckySpinSetting";
import { useRouter } from "next/router";

import { useDispatch } from "react-redux";
import { userEvent, incognitoEvent } from "public/redux/actions";
import { useUserPackageHook } from "public/redux/hooks";
// firebase
import { auth, db } from "../../../src/firebase";
import { getDatabase, ref, set, child, get, onValue, update, query, orderByChild, equalTo } from "firebase/database";
import PageLoading from "public/shared/PageLoading";
import { render } from "react-dom";

export default function LuckySpinAdmin() {
    const [loadedData, setLoadedData] = useState(false);
    const dispatch = useDispatch()

    const router = useRouter();
    // Mã event
    const EventID = router.query.eventId;
    // Thông tin admin
    const adminInfo = useUserPackageHook();
    // Mã admin
    const adminId = adminInfo.userId
    
    // Event
    const [eventInfo, setEventInfo] = useState({})

    // Danh sách giải thưởng
    const [rewardList, setRewardList] = useState([]);
    // Index giải thưởng đang được chọn
    const [rewardChosing, setRewardChosing] = useState(0);
    // ID của giải thưởng được chọn
    const [idRewardChosing, setIDRewardChosing] = useState("");
    // Danh sách phần quà còn lại
    const [remainRewardList, setRemainRewardList] = useState([]);
    
    // Danh sách người chơi
    const [playerList, setPlayerList] = useState([]);
    // Danh sách người chơi quay thưởng
    const [remainPlayerList, setRemainPlayerList] = useState([]);
    // Danh sách người chơi được điều chỉnh
    const [editedPlayerList, setEditedPlayerList] = useState([]);
    // Danh sách người chơi dùng để hiển thị trên vòng quay
    const [playerShowList, setPlayerShowList] = useState([]);
    
    // Đang quay thưởng
    const [spinClicked, setSpinClicked] = useState(false);
    // Số người chơi online
    const [onlinePlayerAmount, setOnlinePlayerAmount] = useState(0);
    // Id người trúng thưởng
    const [awardedId, setAwardedId] = useState("");
    // Thời gian cho animate quay thưởng
    const [spinTime, setSpinTime] = useState(4);

    // Firebase
    const dbRef = ref(db)

    const fetchDB = () => {
        // kiểm tra sự tồn tại trường dữ liệu playingData
        get(child(ref(db), "event/" + EventID + "/playingData")).then((snapshot) => {
            if (!snapshot.exists()) {
                update(ref(db, "event/" + EventID + "/playingData"),
                        {
                            isSpinning: false,
                            lastAwardedIndex: 0,
                            lastAwardedId: "",
                            rewardChosingId: "",
                            rewardChosingIndex: 0,
                            spinTime: 4,
                            confirmStatus: 0 // 0: Waiting; 1: Confirm; 2: Cancel
                        });
            }})
        
        const que3 = query(ref(db, "event"), orderByChild("eventId"), equalTo(EventID));
        onValue(que3, (snapshot) => {
            if (snapshot.exists()) {
                const data = Object.values(snapshot.val())[0];
                if (data["status"] === 1) router.push('/');
                if (data["status"] === 2) router.push('/admin/event/countdown-checkin');
                if (data["status"] === 4) router.push('/event/event-result/' + EventID);
                setEventInfo(data);
                // Nếu không phải admin sự kiện, đưa về trang chủ.
                if (adminId !== data.createBy) router.push('/');
                const rewardChosingIndex = data['playingData']['rewardChosingIndex'];
                const rewardChosingId = data['playingData']['rewardChosingId'];
                const spin_time = data['playingData']['spinTime'];
                setRewardChosing(rewardChosingIndex);
                setIDRewardChosing(rewardChosingId);
                setSpinTime(spin_time);
            } else {
                router.back();
            }
        });

        const que1 = query(ref(db, "event_rewards"), orderByChild("eventId"), equalTo(EventID));
        onValue(que1, (snapshot) => {
            if (snapshot.exists()) {
                const data = Object.values(snapshot.val());
                data.sort(compare);
                setRewardList(data);
                setRemainRewardList(data.filter((val) => (val.quantityRemain > 0)));
            }
        });
        
        const que2 = query(ref(db, "event_participants"), orderByChild("eventId"), equalTo(EventID));
        onValue(que2, (snapshot) => {
            if (snapshot.exists()) {
                const rawData = snapshot.val();
                const data = Object.values(rawData);
                data.forEach((val, idx) => {
                    val.ID = Object.keys(rawData)[idx];
                    get(child(ref(db), "users/" + val.participantId)).then((snapshot) => {
                        if (snapshot.exists()) {
                            val['pic'] = snapshot.val().pic;
                        }
                    })
                })
                setTimeout(function()
                {
                    const online = data.filter(val => val.status === 1).length;
                    const filted = data.filter(val => (val.idReward === "" && val.status === 1));
                    setPlayerList(rawData);
                    setRemainPlayerList(filted);
                    setOnlinePlayerAmount(online);
                }, 200)
            }
        });
        setTimeout(() => setLoadedData(true), 2500)
    }

    // ------------------------------------------------ Function
    const compare = (a, b) => {
        if (a.sortNo > b.sortNo) return 1;
        if (b.sortNo > a.sortNo) return -1;
        return 0;
    }

    const setSpinningFB = (statusSpin = false, awardIndex = 0, lastAwardedId="") => {
        update(ref(db, 'event/' + EventID + '/playingData'),
                        {
                            isSpinning: statusSpin,
                            lastAwardedIndex: awardIndex,
                            lastAwardedId: lastAwardedId
                        });
    }

    // Sử lý sự kiện quay
    const spining = () => {
        if (remainRewardList.length <= 0 || remainPlayerList.length <= 0) return;
        // ngăn sự kiện khi quay thưởng
        setSpinClicked(true);
        setAwardedId("");
        updateFB('event/' + EventID + '/playingData', { confirmStatus: 0 });
        // Random đối tượng
        const randomNum = Math.floor(Math.random() * (remainPlayerList.length));
        setSpinningFB(true, randomNum, remainPlayerList[randomNum].ID);
        Array.from({length: 9}, (_, index) => index).forEach(idx => {
            document.getElementById("spin-idx-" + idx).classList.add("animate-move-down-"+idx)
        })
        document.getElementById("gameSound").play();
        
        const phase1 = setInterval(() => {
            setPlayerShowList((list) => [list.pop(), ...list]);
            document.getElementById("gameSound").play();
        }, 50);
        
        const timeoutPhase1 = setTimeout(() => {
            clearInterval(phase1);
            setPlayerShowList([...editedPlayerList, ...editedPlayerList, ...editedPlayerList].slice(randomNum, randomNum + 18))
            Array.from({length: 9}, (_, index) => index).forEach(idx => {
                document.getElementById("spin-idx-" + idx).classList.remove("animate-move-down-"+idx)
                document.getElementById("spin-idx-" + idx).classList.add("animate-slow-move-down-"+idx)
            })
            document.getElementById("gameSound").play();
                        
            const phase2 = setInterval(() => {
                setPlayerShowList((list) => [list.pop(), ...list]);
                document.getElementById("gameSound").play();
            }, 500);

            const timeoutPhase2 = setTimeout(() => {
                clearInterval(phase2);
                Array.from({length: 9}, (_, index) => index).forEach(idx => {
                    document.getElementById("spin-idx-" + idx).classList.remove("animate-slow-move-down-"+idx)
                })
                setSpinningFB(false, randomNum, remainPlayerList[randomNum].ID);
                setSpinClicked(false);
                document.getElementById("gameSound").play();
                const timeoutPhase3 = setTimeout(() => {
                    document.getElementById("awardedOverlay").classList.toggle('hidden');
                    document.getElementById("awaredPlayerName").innerHTML = remainPlayerList[randomNum].nameDisplay;
                    document.getElementById("awaredRewardName").innerHTML = remainRewardList[rewardChosing].nameReward;
                    setAwardedId(remainPlayerList[randomNum].ID);
                    // updateFB('event_participants/'+ remainPlayerList[randomNum].ID, { idReward: idRewardChosing });
                    // updateFB('event_rewards/' + idRewardChosing, { quantityRemain: (remainRewardList[rewardChosing].quantityRemain -= 1) });
                    document.getElementById("gameSound").pause();
                }, (1000))
            }, ((spinTime-1)*250))

        }, ((spinTime-1)*750))
    }

    // Chọn phần quà
    const chooseReward = (idx) => {
        setRewardChosing(idx);
        setIDRewardChosing(remainRewardList[idx].idReward);
        document.getElementById("selectRewardPopUp").classList.toggle("hidden");
        updateFB('event/' + EventID + '/playingData', {
            rewardChosingId: remainRewardList[idx].idReward,
            rewardChosingIndex: idx
        });
    }

    const updateFB = (path, changeData) => {
        update(ref(db, path), changeData);
    }

    // --------------------------------------------------- useEffect
    // Real time
    useEffect(() => {
        dispatch(incognitoEvent({eventId: EventID}));
    }, [dispatch])

    useEffect(() => {
        fetchDB();

        window.addEventListener('beforeunload',
            () => updateFB('event/' + EventID + '/playingData', {isSpinning: false}));

        return () => {
            updateFB('event/' + EventID + '/playingData', {isSpinning: false});
            window.removeEventListener('beforeunload',
                () => updateFB('event/' + EventID + '/playingData', {isSpinning: false}));
        }
    }, [])

    // Điều chỉnh danh sách người chơi được điều chỉnh
    useEffect(() => {
        // Làm đầy danh sách
        if (editedPlayerList.length === 0) {
            setPlayerShowList(editedPlayerList.slice(0, 9))
            return;
        };
        if (editedPlayerList.length < 9 && remainPlayerList.length < 9)
            setEditedPlayerList((list) => [...list, ...remainPlayerList]);
        else setPlayerShowList(editedPlayerList.slice(0, 9));
    }, [editedPlayerList])

    // Điều chỉnh danh sách người chơi quay thưởng
    useEffect(() => {
        setEditedPlayerList([...remainPlayerList]);
    }, [remainPlayerList]);

    useEffect(() => {
        updateFB('event/' + EventID + '/playingData', { spinTime: spinTime });
    }, [spinTime]);

    // -------------------------------------------------------------------- useMemo
    const spinBlock = useMemo(() => {
        return <Spin listPlayer={playerShowList} />
    }, [playerShowList])

    const renderCurrEventDetail = useMemo(() => {
        return <CurrentEventDetail listPlayer={playerList} listReward={rewardList} remainReward={true} isAdmin={true}></CurrentEventDetail>
    }, [playerList, rewardList]);

    const renderSetting = useMemo(() => {
        return <OverlayBlock childDiv={<LuckySpinSetting router={router} />}  id={"settingOverlay"}></OverlayBlock>
    }, []);

    const renderFinishNotification = useMemo(() => {
        return <OverlayBlock childDiv={<>
            <p className="text-[#004599] text-xl text-center w-full font-bold">Bạn có chắc chắn muốn <br /><span className="text-[#FF6262] uppercase">kết thúc</span> sự kiện?</p>
            <div className="mt-2 w-full flex gap-4 px-2">
                <Button fontSize={"20px"} content={"CÓ"} primaryColor={"#FF6262"} isSquare={true} marginY={0} onClick={() => {
                    updateFB('event/' + EventID, { status: 4 });
                }} />
                <Button fontSize={"20px"} content={"HỦY"} primaryColor={"#3B88C3"} isSquare={true} marginY={0} onClick={() => {document.getElementById("exitOverlay").classList.toggle('hidden')}} />
            </div>
        </>}  id={"finishOverlay"}></OverlayBlock>
    }, []);

    const confirmButton = useMemo(() => {
        return <>
            <Button fontSize={"20px"} content={"XÁC NHẬN"} primaryColor={"#3B88C3"} isSquare={true} marginY={0} onClick={() => {
                document.getElementById("awardedOverlay").classList.toggle('hidden');
                get(child(ref(db), "event/" + EventID + "/playingData")).then((snapshot) => {
                    if (snapshot.exists()) {
                        const data = snapshot.val();
                        const rewardChosingId = data['rewardChosingId'];
                        const lastAwardedId = data['lastAwardedId'];
                        updateFB('event_participants/'+ lastAwardedId, { idReward: rewardChosingId });
                        updateFB('event/' + EventID + '/playingData', { confirmStatus: 1 });
                        get(child(ref(db), "event_rewards/" + rewardChosingId)).then((snapshot) => {
                            if (snapshot.exists()) {
                                const reward = snapshot.val();
                                updateFB('event_rewards/' + rewardChosingId, { quantityRemain: (reward.quantityRemain -= 1) });
                            }})
                    }})
            }}></Button>
        </>
    }, [awardedId])

    const renderAwardNotification = useMemo(() => {
        return <OverlayBlock childDiv={
            <div className="flex flex-col items-center text-center text-[#004599]">
                <p className="font-[900] text-lg" id="awaredPlayerName"></p>
                <p className="font-semibold">sẽ nhận được giải:</p>
                <p className="font-[900] text-lg" id="awaredRewardName"></p>
                <div className="mt-2 relative w-full before:absolute before:left-0 before:border-b-transparent before:border-l-transparent before:border-r-transparent before:border-t-slate-300 before:border-2 before:w-full"></div>
                <p className="mt-2 font-bold">Xác nhận trao giải?</p>
                <div className="mt-2 w-full flex gap-4 px-2">
                    {confirmButton}
                    <Button fontSize={"20px"} content={"HỦY"} primaryColor={"#FF6262"} isSquare={true} marginY={0} onClick={() => {
                        document.getElementById("awardedOverlay").classList.toggle('hidden');
                        updateFB('event/' + EventID + '/playingData', { confirmStatus: 2 });
                    }} />
                </div>
            </div>
        }  id={"awardedOverlay"}
            clickOutClose={false}></OverlayBlock>
    }, [awardedId]);

    return (
        <>
            {loadedData?
            <section className="relative h-screen px-5 py-5 mx-auto flex justify-center items-center w-3/4 max-w-md max-sm:w-full">
                <div className="flex flex-col justify-start items-center w-full h-full">
                    <div className="flex flex-col w-full pt-5">
                        <Title title="QUAY THƯỞNG MAY MẮN" fontSize="text-[24px]" fontWeight="font-semibold"></Title>
                        <Title title={eventInfo.title} fontSize="text-[32px]" />
                        <div className="flex w-full justify-between -mt-3 mb-1">
                            <p className="font-[900] text-[#004599] text-[16px] text-left items-center h-6">Số người trực tuyến</p>
                            <span className="flex gap-1">
                                <p className="items-center text-center bg-[#3B88C3] text-white font-[900] rounded-md w-6 h-6">
                                    {Math.floor(onlinePlayerAmount/100)}
                                </p>
                                <p className="items-center text-center bg-[#3B88C3] text-white font-[900] rounded-md w-6 h-6">
                                    {Math.floor((onlinePlayerAmount%100)/10)}
                                </p>
                                <p className="items-center text-center bg-[#3B88C3] text-white font-[900] rounded-md w-6 h-6">
                                    {Math.floor((onlinePlayerAmount%100)%10)}
                                </p>
                            </span>
                        </div>
                        <div className="flex w-full justify-between">
                            <p className="font-[900] text-[#004599] text-[16px] text-left items-center h-6">Số người quay thưởng</p>
                            <span className="flex gap-1">
                                <p className="items-center text-center bg-[#3B88C3] text-white font-[900] rounded-md w-6 h-6">{Math.floor(remainPlayerList.length/100)}</p>
                                <p className="items-center text-center bg-[#3B88C3] text-white font-[900] rounded-md w-6 h-6">{Math.floor((remainPlayerList.length%100)/10)}</p>
                                <p className="items-center text-center bg-[#3B88C3] text-white font-[900] rounded-md w-6 h-6">{Math.floor((remainPlayerList.length%100)%10)}</p>
                            </span>
                        </div>
                    </div>
                    {spinBlock}
                    <div className="w-full mb-16">
                        <p className="font-[900] text-[#004599] uppercase text-[16px] text-center items-center">giải thưởng hiện tại</p>
                        <div className="h-50 px-4 py-2 relative">
                            <div>
                                <div className="relative mt-1 before:block before:absolute before:-inset-0.5 before:bg-gradient-to-r before:from-[#003B93] before:to-[#00F0FF] before:rounded-md">
                                    <button type="button" className="relative w-full cursor-default rounded-md border border-gray-300 bg-white p-2 shadow-sm border-none sm:text-sm outline-0"
                                        aria-haspopup="listbox" aria-expanded="true" aria-labelledby="listbox-label"
                                        onClick={!spinClicked?
                                            () => document.getElementById("selectRewardPopUp").classList.toggle("hidden"):() => {}}>
                                        <div className="flex">
                                            <p className="text-[#004599] font-bold text-base text-left w-full ml-4 truncate">{remainRewardList.length > 0?remainRewardList[rewardChosing].nameReward:"KHÔNG CÓ"}</p>
                                            <p className="w-full font-bold text-[#004599] text-right mr-7 ml-2">Còn lại: {remainRewardList.length > 0?remainRewardList[rewardChosing].quantityRemain:0}</p>
                                        </div>
                                        <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 absolute right-2 origin-center fill-[#004599]">
                                                <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z" clipRule="evenodd" />
                                            </svg>
                                        </span>
                                    </button>
                                    <ul className="absolute z-10 mt-1 max-h-28 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm hidden"
                                        tabIndex="-1" role="listbox" aria-labelledby="listbox-label" aria-activedescendant="listbox-option-3" id="selectRewardPopUp">
                                        {
                                            remainRewardList.length>0?remainRewardList.map((reward, idx) => {
                                                if (reward.quantityRemain === 0) return;
                                                return (
                                                    <li key={idx} className="relative cursor-default select-none px-4 py-2 flex flex-row justify-between text-[#004599] font-normal hover:bg-[#40BEE5] hover:text-white hover:font-semibold" id={"listbox-option-"+idx} role="option"
                                                        style={{background: (idx===rewardChosing?"#3B88C3":""), color: (idx===rewardChosing?"white":""), fontWeight: (idx===rewardChosing?"700":"")}}
                                                        onClick={() => {chooseReward(idx)}}>
                                                        <span className="ml-3 block truncate grow">{reward.nameReward}</span>
                                                        <span className="min-w-[150px] ml-3 block truncate text-right">Số lượng còn lại: {reward.quantityRemain}</span>
                                                    </li>
                                                )
                                            }):<></>
                                        }
                                    </ul>
                                </div>
                            </div>
                            <div className="flex justify-center h-fit items-center mt-4 gap-4">
                                <label className="font-bold text-[#004599]" htmlFor="spinTime">Thời gian animation: </label>
                                <input id="spinTime" name="spinTime" defaultValue={spinTime} type={"number"} className={"text-sky-500 font-bold text-center w-20 h-10 border border-slate-300 rounded-md py-1 pl-2 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"}
                                    onChange={() => {
                                        if (document.getElementById("spinTime").value && document.getElementById("spinTime").value >= 0)
                                            setSpinTime(parseInt(document.getElementById("spinTime").value));
                                        else {
                                            setSpinTime(0);
                                            document.getElementById("spinTime").value = 0;
                                        };
                                    }}></input>
                                <p className="font-bold text-[#004599]">giây</p>
                            </div>
                            <Button content={"QUAY THƯỞNG"} onClick={!spinClicked?spining:() => {}} primaryColor={"#003B93"} secondaryColor={"#00F0FF"} />
                            <Button content={"KẾT THÚC SỰ KIỆN"} primaryColor={"#FF6262"} isSquare={true} margin={"my-0"} onClick={() => {document.getElementById("finishOverlay").classList.toggle('hidden')}} />
                        </div>
                    </div>
                    <div className="absolute right-2 top-2 rounded-full h-10 w-10 bg-gradient-to-r from-[#003B93] to-[#00F0FF] p-1"
                        onClick={() => {document.getElementById("settingOverlay").classList.toggle('hidden')}}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 fill-white  hover:animate-[spin_1s_linear]">
                            <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 00-2.282.819l-.922 1.597a1.875 1.875 0 00.432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 000 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 00-.432 2.385l.922 1.597a1.875 1.875 0 002.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 002.28-.819l.923-1.597a1.875 1.875 0 00-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 000-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 00-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 00-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 00-1.85-1.567h-1.843zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" clipRule="evenodd" />
                        </svg>
                    </div>
                    {renderCurrEventDetail}
                    {renderSetting}
                    {renderAwardNotification}
                    {renderFinishNotification}
                </div>
            </section>
            :<PageLoading />
        }
        </>
    );
}
