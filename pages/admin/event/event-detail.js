/* eslint-disable no-unused-vars */
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

import Line from "public/shared/Line";
import { HideMethod } from "public/util/popup";
import Title from "public/shared/Title";

import { useUserCurrEventCreatingHook, useUserCurrEventHostingHook, useUserPackageHook } from "public/redux/hooks";
import { useDispatch } from "react-redux"

import { db } from "src/firebase"
import {ref, onValue, query, orderByChild, equalTo, update} from "firebase/database"
import { Button, PageLoading, RewardList } from "public/shared";

function EventDetail() {
    // router
    const router = useRouter();
    // user
    const user = useUserPackageHook()
    // eventID get from redux
    const { query: {statusEvent} } = router
    const props = {statusEvent}
    let event
    const creatingEvent = useUserCurrEventCreatingHook()
    const hostingEvent = useUserCurrEventHostingHook()
    if(statusEvent === "1")
    {
        event = creatingEvent
    }
    else 
    {
        event = hostingEvent
    }
    const beforeID = event.eventId
    const eventID = beforeID.slice(0,8)
    // dispatch
    const dispatch = useDispatch()
    // state
    const [loadedData, setLoadedData] = useState(false)  // load page
    const [countdown, setCountdown] = useState(300); // countdown time
    const [title, setTitle] = useState("") // name event
    const [rewards, setRewards] = useState([]) // store rewards get from firebase

    const optionStyles = { background: "#40BEE5" };

    setTimeout(() => setLoadedData(true), 2500)  // load page

    // check admin
    useEffect(() =>
    {
        if(user.userId !== event.createBy) { router.push("/") }
    },[])

    // get name event from firebase
    const getName = query(ref(db, "event"), orderByChild("eventId"), equalTo(beforeID))
    useEffect(() =>
    {
        onValue(getName, (snapshot) =>
        {
            const value = snapshot.val()
            if(value != null)
            {
                let eventObject = Object.values(value)
                setTitle(eventObject[0].title)
            }
        })
    },[])

    // get reward from firebase
    const reward = query(ref(db, "event_rewards"), orderByChild("eventId"), equalTo(beforeID))
    useEffect(() =>
    {
        onValue(reward,(snapshot) =>
        {
                const data = snapshot.val()
                if(data !== null)
                {
                    setRewards(Object.values(data))
                }
        })
    },[])

    // get countdown value from option
    const onSetCoundownTime = () => {
        let select = document.getElementById("timer").value;
        setCountdown(select);
    };

    // navigate to countdown-checkin
    const handlePrepare = useCallback(() => {
        HideMethod(dispatch)
        if(countdown !== undefined)
        {
            update(ref(db, `event/${beforeID}`),
            {
                status: 2,
                waitingTime:countdown,
                startAt: new Date().getTime()
            })
            router.push({
                pathname:"/admin/event/countdown-checkin",
                query: { countdown, statusEvent }
            })
        }
    },[countdown, dispatch]);

    // navigate to edit-page
    const handleEditPageNavigation = useCallback(() => {
        HideMethod(dispatch)
        router.push({
            pathname:"/admin/event/edit-event-reward-register",
            query: {statusEvent}
        });
    },[router, dispatch]);

    // render component
    const renderTitle = useMemo(() =>
    {
        return ( <Title title={title}/> )
    },[title])

    const renderEventID = useMemo(() =>
    {
        return (
            <div className="flex justify-between w-4/5 max-w-xl text-lg">
                <h1 className="font-[700] uppercase text-[#004599] text-[18px] text-center mb-2">mã sự kiện</h1>
                <h1 className="font-[700] uppercase text-[#004599] text-[18px] text-center mb-2 tracking-[5px]">{eventID}</h1>
            </div>
        )
    },[eventID])

    const renderH1andLine = useMemo(() =>
    {
        return (
            <>
                <h1 className="font-[800] uppercase text-[#004599] text-[20px] text-center mb-2">thông tin giải thưởng</h1>
                <div className="w-4/5 max-w-xl"> <Line /> </div>
            </>
        )
    },[])

    const renderAward = useMemo(() =>
    {
        return (
            <section className="flex flex-col overflow-x-hidden overflow-y-auto scrollbar-hide justify-center items-center w-4/5 max-w-xl h-[350px] my-2">
                <div className="my-2 w-full h-full flex flex-col max-h-[350px]">
                    <RewardList listReward={rewards}/>
                </div>
            </section>
        )
    },[rewards])

    const renderLine2 = useMemo(() =>
    {
        return ( <div className="w-4/5 max-w-xl mb-2"> <Line /> </div> )
    },[])

    const renderCheckinTime = useMemo(() =>
    {
        return (
            <div className="flex items-center w-4/5 max-w-xl justify-center mb-2">
                <div className="flex items-center justify-center h-[40px]">
                    <h1 className="font-[800] uppercase text-[#004599] text-[18px] text-center mb-2">thời gian check in</h1>
                </div>
                <div className="text-white font-bold ml-3 w-[110px] h-[40px] flex justify-center items-center rounded-[10px] " style={optionStyles}>
                    <select
                        className="w-[90px] h-[30px] bg-transparent outline-none"
                        style={optionStyles}
                        id={"timer"}
                        onChange={onSetCoundownTime}
                    >
                        <option value={"300"}>5 phút</option>
                        <option value={"600"}>10 phút</option>
                        <option value={"900"}>15 phút</option>
                        <option value={"1200"}>20 phút</option>
                    </select>
                </div>
            </div>
        )
    },[onSetCoundownTime])

    const renderPrepareButton = useMemo(() =>
    {
        return (
            <div className="w-full mr-1 drop-shadow-lg">
                <Button content={"CHUẨN BỊ"} primaryColor={"#003B93"} secondaryColor={"#00F0FF"} onClick={handlePrepare} />
            </div>
        )
    },[handlePrepare])

    const renderEditPageButton = useMemo(() =>
    {
        return (
            <div className="w-[50px] h-[50px] bg-gradient-to-r from-[#003B93] to-[#00F0FF] rounded-[50px] ml-1 cursor-pointer drop-shadow-lg" onClick={handleEditPageNavigation}>
                <i className="fas fa-pen text-white flex justify-center items-center w-full h-full"></i>
            </div>
        )
    },[handleEditPageNavigation])

    return (
        <>
        {
            loadedData ?
            (
                <div className="flex flex-col justify-evenly items-center h-screen w-screen">
                    {/* test event name */}
                    {renderTitle}
                    {renderEventID}
                    {/* rewards information */}
                    {renderH1andLine}
                    {renderAward}
                    {renderLine2}
                    {renderCheckinTime}
                    <div className="w-4/5 max-w-xl flex justify-center items-center">
                        {renderPrepareButton}
                        {renderEditPageButton}
                    </div>
                </div>
            )
            :
            (
                <PageLoading />
            )
        }  
        </>
    );
    }

    export default EventDetail;