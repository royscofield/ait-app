import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import {v4 as uuidv4} from "uuid"

import Header from "public/shared/Header";
import Reward from "public/shared/Reward";
import CheckBox from "public/shared/CheckBox";
import { messagesError, messagesSuccess } from "public/util/messages"
import PopUp from "public/shared/PopUp";
import { Button, Input, PageLoading } from "public/shared";
import { HideMethod, ShowMethod } from "public/util/popup";

import { db } from "src/firebase"
import {ref, set, onValue, query, orderByChild, equalTo, update, remove} from "firebase/database"
import { storage } from "src/firebase"
import { ref as refStorage, uploadBytes, getDownloadURL } from "firebase/storage"

import { usePopUpMessageHook, usePopUpStatusHook, usePopUpVisibleHook, useUserCurrEventCreatingHook, useUserCurrEventHostingHook, useUserPackageHook } from "public/redux/hooks";
import { useDispatch } from "react-redux"

function EditEventRewardRegister() {
    // router
    const router = useRouter();
    // user
    const user = useUserPackageHook()
    // eventID
    const { query: {statusEvent} } = router
    const props = {statusEvent}
    let eventStore
    const creatingEvent = useUserCurrEventCreatingHook()
    const hostingEvent = useUserCurrEventHostingHook()
    if(statusEvent === "1")
    {
        eventStore = creatingEvent
    }
    else 
    {
        eventStore = hostingEvent
    }
    const eventID = eventStore.eventId
    // dispatch
    const dispatch = useDispatch()
    // message
    const message = usePopUpMessageHook()
    const status = usePopUpStatusHook()
    const visible = usePopUpVisibleHook()
    // state
    const [loadedData, setLoadedData] = useState(false)
    const [event, setEvent] = useState({})  // store event get from firebase
    const [rewards, setRewards] = useState([])  // store rewards get from firebase
    const [nameEvent, setNameEvent] = useState("")  // name event state
    const [description, setDescription] = useState("")  // description state
    const [maxTicket, setMaxTicket] = useState("")  // maxTicket state
    const [publicFlag, setPublicFlag] = useState(true)

    const [rewardId, setRewardId] = useState([])  // store id of rewards when get from firebase
    const [nameReward, setNameReward] = useState([])  //store name rewards get from firebase
    const [quantity, setQuantity] = useState([])  // store quantity get from firebase
    const [imageFB, setImageFB] = useState([])  // store image get from firebase
    const [key, setKey] = useState([])  // store reward id when get value from Reward component
    const [value, setValue] = useState([]) // value store object of reward when typing

    const [rewardCount, setRewardCount] = useState([])

    let uniqueKey = [] // uniqueKey store local id of reward
    let diffKey = useRef([]) // store new rewards added id

    const contentCSS = {
        background: "-webkit-linear-gradient(45deg, #003B93, #00F0FF)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
    };

    const wrap = { zIndex: "20" }

    setTimeout(() => setLoadedData(true), 2500)  // load page

    // check admin
    useEffect(() =>
    {
        if(user.userId !== eventStore.createBy) { router.push("/") }
    },[])

    // get event from firebase
    const getEvent = query(ref(db, "event"), orderByChild("eventId"), equalTo(eventID))

    useEffect(() =>
    {
        onValue(getEvent, (snapshot) =>
        {
            const data = snapshot.val()
            if(data !== undefined)
            {
                setNameEvent(Object.values(data)[0].title)
                setDescription(Object.values(data)[0].description)
                setMaxTicket(Object.values(data)[0].maxTicket)
                Object.values(data)[0].publicFlag === 1 ? (setPublicFlag(true)) : (setPublicFlag(false))
                setEvent(Object.values(data)[0])
            }
        })
    },[])
    // get reward from firebase
    const getReward = query(ref(db, "event_rewards"), orderByChild("eventId"), equalTo(String(eventID)))
    useEffect(() =>
    {
        onValue(getReward, (snapshot) =>
        {
            const data = snapshot.val()
            if (data !== undefined)
            {
                setRewards(Object.values(data))
            }   
        })
        
    },[])

    useEffect(() =>
    {
        rewards.map((item, index) =>
        {
            setRewardId(prev => [...prev, item.idReward])
            setNameReward(prev => [...prev, item.nameReward])
            setQuantity(prev => [...prev, item.quantity])
            setImageFB(prev => [...prev, item.imgUrl])
            return <></>
        })
    },[rewards])

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

    useEffect(() =>
    {
        diffKey.current = uniqueKey.filter(x => rewardId.indexOf(x) === -1)
    },[uniqueKey])

    const handleNavigate = useCallback(() => {
        if(nameEvent !== "" && description !== "" && maxTicket !== "")
        {
            update(ref(db, `event/${eventID}`),
            {
                eventId: eventID,
                publicFlag: publicFlag ? 1 : 0,
                title: nameEvent,
                description: description,
                maxTicket: maxTicket,
            })
            .catch((e) =>
            {
                ShowMethod(dispatch, messagesError.E4444, false)
            })
        }

        let valueLength = value.length - 1
        let lastValue = value[valueLength]

        if(lastValue[0].name !== "" && typeof lastValue[0].name !== "undefined")
        {
            let beforeSortNoLength = rewardId.length
            rewardId.map((item, index) =>
            {
                for(let tempValueLength = valueLength; tempValueLength > 0; tempValueLength --)
                {
                    let tempValue = value[tempValueLength]
                    let tempItem = tempValue[0] ?? []
                    let tempId = tempItem.id
                    let tempName = tempItem.name
                    let tempAmount = tempItem.amount
                    let tempImg = tempItem.image
                    let updateImg = []


                    if(tempId === item)
                    {
                        if(tempAmount > 0)
                        {
                            let imgLength = tempImg.length - 1
                            let beforeImg = imageFB[index]?.length
                            
                                if(typeof beforeImg === "undefined")
                                {
                                    for(let j = 1; j <= imgLength; j++)
                                    {
                                        if(typeof tempImg[j] !== "undefined")
                                        {
                                            updateImg.push(tempImg[j])
                                            let imageRef = refStorage(storage, `rewards_image/${eventID}/${tempId}/${tempImg[j] + uuidv4()}`);
                                            uploadBytes(imageRef, tempImg[j]).then((snapshot) => {
                                                getDownloadURL(snapshot.ref)
                                                .then((url) =>
                                                {
                                                    set(ref(db,`event_rewards/${tempId}/imgUrl/${j}`),url)
                                                    .catch((err) => ShowMethod(dispatch, messagesError.E4444, false))
                                                })
                                            })
                                        }
                                    }
                                }
                            if(imgLength > beforeImg)
                            {
                                for(let j = 0; j < beforeImg; j++)
                                {
                                    if(typeof tempImg[j] !== "undefined")
                                    {
                                        updateImg.push(tempImg[j])
                                    }
                                }
                                
                                for(let i = beforeImg + 1; i <= imgLength; i++)
                                {
                                    if(typeof tempImg[i] !== "undefined")
                                    {
                                        updateImg.push(tempImg[i])
                                        let imageRef = refStorage(storage, `rewards_image/${eventID}/${tempId}/${tempImg[i] + uuidv4()}`);
                                        uploadBytes(imageRef, tempImg[i]).then((snapshot) => {
                                            getDownloadURL(snapshot.ref)
                                            .then((url) =>
                                            {
                                                set(ref(db,`event_rewards/${tempId}/imgUrl/${i}`),url)
                                                .catch((err) => ShowMethod(dispatch, messagesError.E4444, false))
                                            })
                                        })
                                    }
                                }
                            }
                            else 
                            {
                                for(let j = 0; j < beforeImg; j++)
                                {
                                    if(typeof tempImg[j] !== "undefined")
                                    {
                                        updateImg.push(tempImg[j])
                                    }
                                } 
                            }
                        
                            update(ref(db, `event_rewards/${tempId}`),
                            {
                                idReward: tempId,
                                nameReward:tempName,
                                eventId:eventID,
                                quantity: tempAmount,
                                sortNo:index,
                                quantityRemain:tempAmount,
                                imgUrl: updateImg
                            })
                        }
                        else 
                        {
                            remove(ref(db, `event_rewards/${tempId}`))
                        }
                        break;
                    }
                }
                return <></>
            })

            diffKey.current.map((item, index) =>
            {
                for(let tempValueLength = valueLength; tempValueLength > 0; tempValueLength --)
                {
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
                                let imageRef = refStorage(storage, `rewards_image/${eventID}/${tempId}/${tempImg[index] + uuidv4()}`);
                                uploadBytes(imageRef, tempImg[index]).then((snapshot) => {
                                    getDownloadURL(snapshot.ref)
                                    .then((url) =>
                                    {
                                        set(ref(db,`event_rewards/${tempId}/imgUrl/${index}`),url)
                                        .catch((err) => ShowMethod(dispatch, messagesError.E4444, false))
                                    })
                                })
                            }
                        
                            const newReward = {
                                idReward: tempId,
                                nameReward:tempName,
                                eventId:eventID,
                                quantity: tempAmount,
                                sortNo:index + beforeSortNoLength,
                                quantityRemain:"",
                                imgUrl: tempImg
                            }
                            set(ref(db, `event_rewards/${tempId}`),newReward)
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
            ShowMethod(dispatch, messagesSuccess.I0003, true)
            setTimeout(() =>
            {
                HideMethod(dispatch)
                router.push({
                    pathname:"/admin/event/event-detail",
                    query: {statusEvent}
                });
            },[2000])
        }
        else{
            ShowMethod(dispatch, messagesError.E0001("Tên giải thưởng"), false)
        }
    },[dispatch, description, eventID, imageFB, maxTicket, nameEvent, rewardId, value]);

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

    // render component
    const renderHeader = useMemo(() =>
    {
        return (
            <div className="w-full"> <Header /> </div>
        )
    },[])

    const renderTitle = useMemo(() =>
    {
        return ( <h1 className="font-[900] uppercase text-[#004599] text-[30px] text-center mb-2"> {event.title} </h1> )
    },[event])

    const renderEventTitle = useMemo(() =>
    {
        return (
            <div className="w-full h-[70px]">
                <Input content={"Tên sự kiện"} maxLength={"100"} value={nameEvent} onChange={(e) => setNameEvent(e.target.value)} />
            </div>
        )
    },[setNameEvent, nameEvent])

    const renderEventDescription = useMemo(() =>
    {
        return (
            <div className="pb-[1rem] pt-[2rem] w-full h-[200px]">
                <Input isMultiLine={true} content={"Mô tả sự kiện"} row={4} maxLength={"1000"} value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
        )
    },[description, setDescription])

    const renderMaxTicket = useMemo(() =>
    {
        return (
            <div className="w-full">
                <Input primaryColor={"#003B93"} secondaryColor={"#00F0FF"} content={"Giới hạn người tham gia"} type={"number"} min={"1"} value={maxTicket} onChange={(e) => setMaxTicket(e.target.value)} />
            </div>
        )
    },[maxTicket, setMaxTicket])

    const renderCheckbox = useMemo(() =>
    {
        return (
            <div className="w-full flex justify-center items-center">
                <div className="w-[70%]">
                    <p style={contentCSS} className="font-bold"> Cho phép người tham gia không cần đăng nhập </p>
                </div>
                <div className="w-[30%] flex items-center text-right">
                    <CheckBox value={publicFlag} onChange={e => setPublicFlag(e?.target?.checked)}/>
                </div>
            </div>
        )
    },[publicFlag, setPublicFlag])

    const renderReward = useMemo(() =>
    {
        return (
            <>
            {
                rewards.map((item, index) =>
                {
                    return (
                        <div key={index} className={"flex w-full justify-center items-center"}>
                            <Reward
                                rewardId={rewardId[index]}
                                fileID={`file${index}`}
                                toggleID={`toggle${index}`}
                                rewardName={nameReward[index]}
                                amount={quantity[index]}
                                imageList={imageFB[index]}
                                receiveData={handleReceiveData}
                            /> 
                        </div>
                    )
                })
            }
            </>
        )
    },[nameReward, quantity, imageFB])

    const renderNewReward = useMemo(() =>
    {
        return (
            <div className="w-full flex flex-col items-center justify-center">
                {
                    rewardCount.map((item, index) =>
                    {
                        return (
                            <div key={index} className="flex w-full justify-center items-center">
                                <Reward
                                    fileID={`filenew${index}`}
                                    toggleID={`togglenew${index}`}
                                    receiveData={handleReceiveData}
                                /> 
                            </div>
                        )
                    })
                }
            </div>
        )
    },[rewardCount])

    const renderAddButton = useMemo(() =>
    {
        return (
            <div className="w-full">
                <Button content={"Thêm phần quà"} primaryColor={"#40BEE5"} onClick={handleAdd}/>
            </div>
        )
    },[handleAdd])

    const renderEditButton = useMemo(() =>
    {
        return (
            <div className="py-3 w-4/5 max-w-xl">
                <Button primaryColor={"#003B93"} secondaryColor={"#00F0FF"} content={"ĐIỀU CHỈNH"} onClick={handleNavigate} />
            </div>
        )
    },[handleNavigate])

    const renderPopUp = useMemo(() => {
        return (
          <div className={visible} style={wrap}> <PopUp text={message} status={status} isWarning={!status} /> </div>
        )
      }, [visible, message, status])

    return (
        <>
        {
            loadedData ? 
            (
                <section className="flex flex-col overflow-y-auto overflow-x-hidden items-center h-screen w-screen">
                    {renderHeader}
                    <div className="w-4/5 max-w-xl flex flex-col items-center justify-center mb-5">
                        {renderTitle}
                        {renderEventTitle}
                        {renderEventDescription}
                        {renderMaxTicket}
                        {renderCheckbox}
                    </div>
                    <div className="w-4/5 max-w-xl flex flex-col items-center justify-center mt-5">
                        {renderReward}
                        {renderNewReward}
                        {renderAddButton}
                    </div>
                    {renderEditButton}
                    {renderPopUp}
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

export default EditEventRewardRegister;