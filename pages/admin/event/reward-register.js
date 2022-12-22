import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/router";

import { HideMethod, ShowMethod } from "public/util/popup";
import PopUp from "public/shared/PopUp";
import Reward from "public/shared/Reward";
import { messagesError, messagesSuccess } from "public/util/messages"

import {v4 as uuidv4} from "uuid"

import { db } from "src/firebase"
import { storage } from "src/firebase"
import { set, ref } from "firebase/database"
import { ref as refStorage, uploadBytes, getDownloadURL } from "firebase/storage"

import { useUserCurrEventCreatingHook, usePopUpMessageHook, usePopUpStatusHook, usePopUpVisibleHook, useUserPackageHook } from "public/redux/hooks";
import { useDispatch } from "react-redux"
import Header from "public/shared/Header";
import { Button, PageLoading } from "public/shared";

function RewardRegister() {
    // router
    const router = useRouter();
    // status to pass to event detail
    const statusEvent = 1
    // user
    const user = useUserPackageHook()
    // eventID
    const event = useUserCurrEventCreatingHook()
    const eventID = event.eventId
    // state
    const [loadedData, setLoadedData] = useState(false)  // load page
    const [key, setKey] = useState([])
    const [rewardCount, setRewardCount] = useState([])
    
    setTimeout(() => setLoadedData(true), 2500)  // load page
    // state store data
    const [value, setValue] = useState([]) // value store object of reward when typing

    let uniqueKey = [] // uniqueKey store local id of reward

    const wrap = { height:"100%", zIndex: "20" }

    // message pop up
    const message = usePopUpMessageHook()
    const status = usePopUpStatusHook()
    const visible = usePopUpVisibleHook()

    const dispatch = useDispatch()

    // idea: each reward has its own id (render in the first time component called by uuid)
    // idea: output of reward data is array of object and it's update when has change with the key is id render by uuid
    // idea: so we only get the last value of reward of each id

    // check admin
    useEffect(() =>
    {
        if(user.userId !== event.createBy) { router.push("/") }
    },[])

    // get value of reward realtime
    const handleReceiveData = useCallback((data) =>
    {
        setValue(prev => [...prev, data])
    })

    // get array of reward id (has duplicate)
    useEffect(() =>
    {
        value.map((item, index) =>
        {   
            let key = item[0] ?? [];
            setKey(prev => [...prev, key.id])
            return <></>
        })
    },[value])

    // store array of reward id (not duplicate)
    useMemo(() =>
    {
        key.forEach((item) =>
        {
            if(!uniqueKey.includes(item) && typeof item !== "undefined")
            {
                uniqueKey.push(item)
            }
        })
    },[key])

    // add reward
    const handleAdd = useCallback(() =>
    {
        if(rewardCount.length > 0)
        {
            let valueLength = value.length - 1
            let lastValue = value[valueLength]

            if(lastValue[0].name !== "" && typeof lastValue[0].name !== "undefined")
            {
                setRewardCount(prev => [...prev, 1])
            }
            else 
            {
                ShowMethod(dispatch, messagesError.E0001("Tên giải thưởng"), false)
            }
        }
        else if(rewardCount.length === 0)
        {
            setRewardCount(prev => [...prev, 1])
        }
    },[rewardCount, value, dispatch])
    
    // navigate to event detail, push data to firebase and add to redux
    const handleNavigate = useCallback(() =>
    {
        set(ref(db, `event/${eventID}`), event)
            .catch((e) => {
                ShowMethod(dispatch, messagesError.E4444, false)
            });

        let valueLength = value.length - 1
        let lastValue = value[valueLength]

        if(uniqueKey.length === 0)
        {
            ShowMethod(dispatch, messagesError.E0001("Phần thưởng"), false)
        }
        else {
            if(lastValue[0].name !== "" && typeof lastValue[0].name !== "undefined") {
                // save value to data
                uniqueKey.map((item, index) =>
                {
                    for(let tempValueLength = valueLength; tempValueLength > 0; tempValueLength --)
                    {
                        const id = uuidv4()
                        let tempValue = value[tempValueLength]
                        let tempItem = tempValue[0] ?? []
                        let tempId = tempItem.id
                        let tempName = tempItem.name 
                        let tempAmount = tempItem.amount
                        let tempImg = tempItem.image

                        if(tempId === item)
                        {
                            if(tempAmount > 0)
                            {
                                let imgLength = tempImg.length - 1
                                for(let index = 1; index <= imgLength; index++)
                                {
                                    let imageRef = refStorage(storage, `rewards_image/${eventID}/${id}/${tempImg[index] + uuidv4()}`);
                                    uploadBytes(imageRef, tempImg[index]).then((snapshot) => {
                                        getDownloadURL(snapshot.ref)
                                            .then((url) =>
                                            {
                                                set(ref(db,`event_rewards/${id}/imgUrl/${index}`),url)
                                                    .catch((err) => ShowMethod(dispatch, messagesError.E4444, false))
                                            })
                                    })
                                }

                                const newReward = {
                                    idReward: id,
                                    nameReward:tempName,
                                    eventId:eventID,
                                    quantity: tempAmount,
                                    sortNo:index,
                                    quantityRemain:tempAmount,
                                    imgUrl: tempImg
                                }
                                set(ref(db, `event_rewards/${id}`),newReward)
                                    .then(() =>
                                    {
                                        ShowMethod(dispatch, messagesSuccess.I0001, true)
                                    })
                                    .catch((err) =>
                                    {
                                        ShowMethod(dispatch, messagesError.E4444, false)
                                    })
                            }
                            break;
                        }
                    }
                    return <></>
                })
                setTimeout(() =>
                {
                    HideMethod(dispatch)
                    router.push({
                        pathname:"/admin/event/event-detail",
                        query: {statusEvent}
                    })
                },2000)
            }
            else {
                ShowMethod(dispatch, messagesError.E0001("Tên giải thưởng"), false)
            }
        }
    },[dispatch, value, uniqueKey])

    // render component

    const renderHeader = useMemo(() =>
    {
        return( <div className="w-full h-[12%]"> <Header /> </div> )
    },[])

    const renderReward = useMemo(() =>
    {
        return (
            <div className="w-full flex flex-col items-center justify-center">
                {
                    rewardCount.map((item, index) =>
                    {
                        return (
                            <div key={index} className="flex w-full justify-center items-center">
                                <Reward
                                    fileID={`file${index}`}
                                    toggleID={`toggle${index}`}
                                    receiveData={handleReceiveData}
                                /> 
                            </div>
                        )
                    })
                }
            </div>
        )
    },[rewardCount])

    const renderAddRewardButton = useMemo(() =>
    {
        return (
            <div className="w-full">
                <Button content={"Thêm phần quà"} primaryColor={"#40BEE5"} onClick={handleAdd}/>
            </div>
        )
    },[handleAdd])

    const renderRewardRegisterButton = useMemo(() =>
    {
        return (
            <div className="pb-4 w-4/5 drop-shadow-lg max-w-xl">
                <Button content={"ĐĂNG KÝ SỰ KIỆN"} primaryColor={"#003B93"} secondaryColor={"#00F0FF"} onClick={() => handleNavigate(value, uniqueKey)} />
            </div>
        )
    },[handleNavigate, value, uniqueKey])

    const renderPopUp = useMemo(() =>
    {
        return (
            <div className={visible} style={wrap}> <PopUp text={message} status={status} isWarning={!status} /> </div>
        )
    },[visible, message, status])

    return (
        <>
        {
            loadedData?
            (
                <section className="w-screen h-screen">
                    <div className="flex flex-col items-center h-full">
                        {renderHeader}
                        <div className="flex flex-col items-center w-full justify-between h-[85%]">
                            <div className="w-4/5 max-w-xl my-2 flex flex-col items-center justify-center">
                                {renderReward}
                                {renderAddRewardButton}
                            </div>
                            {renderRewardRegisterButton}
                        </div>
                        {renderPopUp}
                    </div>
                </section>
            )
            :
            (
                <PageLoading />
            )
        }
        </>
  );
}

export default RewardRegister;