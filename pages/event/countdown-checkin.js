import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router"

import Line from "public/shared/Line";
import PlayerList from "public/shared/PlayerList";
import { ShowMethod } from "public/util/popup";
import { messagesSuccess } from "public/util/messages";

import { usePlayerEventHook } from "public/redux/hooks"
import { useDispatch } from "react-redux"

import { db } from "src/firebase"
import {ref, onValue, query, orderByChild, equalTo} from "firebase/database"
import { RewardList } from "public/shared";

function UserCountdownCheckin () {

    // router
    const router = useRouter()
    // dispatch
    const dispatch = useDispatch()
    // event object
    const event = usePlayerEventHook()  // event state that player join
    const eventName = event.title  // event title
    const eventID = event.eventId  // event id
    const eventMaxTicket = event.maxTicket // max player
    const pinCode = event.pinCode  // pin code
    const countdown = event.waitingTime // countdown time
    const deadline = event.startAt  // start at (time)

    // state
    const [minutes, setMinutes] = useState(0)  // store minutes of countdown
    const [seconds, setSeconds] = useState(0) // store seconds of countdown
    const [rewards, setRewards] = useState([]) // store rewards of event
    const [player, setPlayer] = useState(0)  // number of player
    const [playerList, setPlayerList] = useState([])  // list of plater
    const isActive = true  // countdown
    const [isStop, setIsStop] = useState(false)  // countdown

    // get reward from firebase
    const getReward = query(ref(db, "event_rewards"), orderByChild("eventId"), equalTo(eventID))

    useEffect(() =>
    {
        onValue(getReward,(snapshot) =>
        {
                const data = snapshot.val()
                if(data !== null)
                {
                    setRewards(Object.values(data))
                }
        })
    },[])

    // get realtime number of player

    const getNumberPlayer = query(ref(db, "event"), orderByChild("evenId"), equalTo(eventID))

    useEffect(() =>
    {
        onValue(getNumberPlayer, (snapshot) =>
        {
            const data = snapshot.val()
            if(data !== null)
            {
                const rawData  = Object.values(data)
                setPlayer(rawData[0].userJoined)
            }
        })
    })

    // get realtime participants from firebase
    const que2 = query(ref(db, "event_participants"), orderByChild("eventId"), equalTo(eventID));
    useEffect(() =>
    {
        onValue(que2, (snapshot) => {
            if (snapshot.exists()) {
                const rawData = snapshot.val();
                setPlayerList(Object.values(rawData));
                const data = Object.values(rawData)
                setPlayer(data.length)
            }
        });
    },[])

    //countdown
    useEffect(() =>
    {
            let deadlineCountdown = deadline + ((countdown + 2) * 1000)
            let countdownTimer = null
    
            if(isActive && isStop === false)
            {
                countdownTimer = setInterval(() => {
                    let nowDate = new Date()
                    let left = deadlineCountdown - nowDate
                    let nowSeconds = Math.floor((left / 1000) % 60);
                    let nowMinutes = Math.floor((left / 1000 / 60) % 60);
                    if(nowMinutes === 0 && nowSeconds === 0)
                    {
                        clearInterval(countdownTimer)
                        setIsStop(true)
                        ShowMethod(dispatch, messagesSuccess.I0009, true)
                        setTimeout(() => {
                            router.push(`/event/luckyspin/${pinCode}`)
                        },2000)
                    }
                    else {
                        setMinutes(nowMinutes)
                        setSeconds(nowSeconds)
                    }   
                }, 1000)
            }
            else {
                clearInterval(countdownTimer)
            }
            return () => clearInterval(countdownTimer)
    },[isActive, isStop, dispatch])

    const BG_COLOR ="bg-gradient-to-tr from-[#C8EFF1] via-[#B3D2E9] to-[#B9E4A7]";

    const countDownNumber = {background: "#3B88C3"}

    // render component
    const renderTitle = useMemo(() =>
    {
        return (
            <div className="flex flex-col">
                <h1 className={`font-[900] uppercase text-[#004599] text-[36px] text-center`}>{eventName}</h1>
                <h1 className={`font-[900] uppercase text-[#004599] text-[18px] text-center mb-2`}>bắt đầu sau ...</h1>
            </div>
        )
    },[])

    const renderCountdownTime = useMemo(() =>
    {
        return (
            <div className="flex justify-center items-center max-w-xl w-4/5 mb-3">
                
                <div className="w-[65px] h-[80px] rounded-[10px] mr-1 text-white text-6xl flex justify-center items-center drop-shadow-lg" style={countDownNumber}>
                    {minutes > 9 ? (Math.floor(minutes / 10)) : 0}
                </div>
                <div className="w-[65px] h-[80px] rounded-[10px] mr-1 text-white text-6xl flex justify-center items-center drop-shadow-lg" style={countDownNumber}>
                    {minutes > 9 ? (Math.floor(minutes % 10)) : minutes}
                </div>
                <div className="mr-1 text-6xl flex justify-center items-center">
                    <span className="flex justify-center items-center text-[#3B88C3]">:</span>
                </div>
                <div className="w-[65px] h-[80px] rounded-[10px] mr-1 text-white text-6xl flex justify-center items-center drop-shadow-lg" style={countDownNumber}>
                    {seconds > 9 ? Math.floor(seconds / 10) : 0}
                </div>
                <div className="w-[65px] h-[80px] rounded-[10px] mr-1 text-white text-6xl flex justify-center items-center drop-shadow-lg" style={countDownNumber}>
                    {seconds > 9 ? Math.floor(seconds % 10) : seconds}
                </div>

            </div>)
    },[minutes, seconds])

    const renderTitle2 = useMemo(() =>
    {
        return (
            <div className="flex">
                <h1 className={`font-[900] uppercase text-[#004599] text-[18px] text-center mb-2`}>thông tin giải thưởng</h1>
            </div>
        )
    },[])

    const renderLine = useMemo(() =>
    {
        return (
            <div className="max-w-xl w-4/5 mb-2 z-0"> <Line /> </div>
        )
    },[])

    const renderRewards = useMemo(() =>
    {
        return (
            <section className="flex flex-col overflow-x-hidden overflow-y-auto scrollbar-hide justify-center items-center w-4/5 max-w-xl h-[300px] my-2">
                <div className="my-2 w-full h-full flex flex-col max-h-[300px]">
                    <RewardList listReward={rewards}/>
                </div>
            </section>
        )
    },[rewards])

    const renderTitle3 = useMemo(() =>
    {
        return (
            <div className="flex flex-col">    
                <h1 className={`font-[900] uppercase text-[#004599] text-[18px] text-center mb-2`}>danh sách người chơi</h1>
                <h1 className={`font-[900] uppercase text-[#004599] text-[18px] text-center mb-2`}>{`số người tham gia: ${player}/${eventMaxTicket}`}</h1>
            </div>
        )
    },[player])

    const renderPlayerList = useMemo(() =>
    {
        return (
            <div className="max-w-xl w-4/5 h-[200px] overflow-x-hidden overflow-y-auto scrollbar-hide">
                <div className="w-full h-full flex flex-col items-center">
                    <PlayerList listPlayer={playerList} />
                </div>
            </div>
        )
    },[playerList])

    return (
        <section className={`h-screen w-screen flex flex-col items-center justify-center ${BG_COLOR}`}>
            {renderTitle}
            {renderCountdownTime}
            {renderTitle2}
            {renderLine}
            {renderRewards}
            {renderTitle3}
            {renderPlayerList}
        </section>
    )
}

export default UserCountdownCheckin