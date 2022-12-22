import React, { useEffect, useState } from "react";
import PlayerList from "./PlayerList";
import OverlayBlock from "./OverlayBlock";
import CloseButton from "./CloseButton";

export default function RewardList({listReward, showRemain = false, eventPaticipant, showDetail = false}) {
    const rewardList = [...listReward];
    const [rewardIndex, setRewardIndex] = useState(0);
    const [rewardImageIndex, setRewardImageIndex] = useState(0);

    function compare(a, b) {
        if (a.sortNo > b.sortNo) return 1;
        if (b.sortNo > a.sortNo) return -1;
        return 0;
    }

    useEffect(() => {
        rewardList.sort(compare);
    }, [rewardList])

    const awradedPaticipantShowcase = (rewardID) => {
        const showcaseList = eventPaticipant.filter(paticipant => paticipant.idReward == rewardID)

        return (
            <>
                {showcaseList.length > 0?
                    <>
                        <p className="ml-4 items-center text-left text-[#004599] text-lg font-extrabold mt-2 mb-1">Người trúng thưởng</p>
                        <PlayerList listType="Menu" changeButton={false} listPlayer={showcaseList} listReward={listReward} />
                    </>:
                <></>}
            </>
        )
    }

    const openImage = (index, imgIdx) => {
        document.getElementById("showImageOverlay").classList.toggle("hidden");
        setRewardIndex(index);
        setRewardImageIndex(imgIdx);
    }

    const ShowcaseImage = ({imgUrls, imgIndex = 0}) => {
        const [imgIdx, setImdIdx] = useState(imgIndex);
        const [touchX, setTouchX] = useState(0);

        return (
            <>
                <div className="absolute flex items-center left-0 -translate-y-[50%]">
                    {imgUrls && <img className="object-scale-down" src={imgUrls[imgIdx]} alt={"lageImg"}
                        onTouchStart={(e) => {
                            setTouchX(e.touches[0].clientX)
                        }}
                        onTouchEnd={(e) => {
                            if (e.changedTouches[0].clientX - touchX > 10 && imgIdx > 0) setImdIdx(imgIdx => imgIdx-1);
                            if (e.changedTouches[0].clientX - touchX < -10 && imgIdx < imgUrls.length - 1) setImdIdx(imgIdx => imgIdx+1);
                        }}/>}
                </div>
                <div className="absolute bottom-0 left-0 w-full flex flex-row justify-center px-1 opacity-50 translate-y-20 hover:opacity-100 hover:translate-y-0 transition-all bg-transparent hover:bg-gradient-to-t from-black to-[#00000080]">
                    <div className="flex flex-row justify-center w-full pt-4 h-36 overflow-x-hidden overflow-y-hidden">
                    {
                        (imgUrls !== undefined && imgUrls !== [])?imgUrls.map((url, idx) => {
                            const x = (idx - imgIdx)*110;
                            return (
                                <div key={idx}>
                                   {idx !== imgIdx?
                                        <div className="relative h-0 w-0 mt-2 transition-all" style={{transform: `translate(${x}px, 0px)`}}>
                                            <div className="absolute w-24 -translate-x-12">
                                                <img className="object-cover h-20 w-24 rounded-lg drop-shadow-lg hover:brightness-90 brightness-50 cursor-pointer" src={url} alt={imgIndex+idx}
                                                        onClick={() => setImdIdx(idx)}/>
                                            </div>
                                        </div>:
                                        <div className="relative h-0 w-0 transition-all" style={{transform: `translate(0px, 0px)`}}>
                                            <div className="absolute w-28 -translate-x-14">
                                                <img className="object-cover h-24 w-28 rounded-lg drop-shadow-lg brightness-100" src={url} alt={imgIndex+idx} />
                                            </div>
                                        </div>
                                   } 
                                </div>
                            )
                        }):<></>
                    }
                    <p className="text-white text-lg font-semibold text-center w-full absolute bottom-0 left-0">{imgIdx+1} / {imgUrls.length}</p>
                    </div>
                </div>
                <CloseButton parentDivID={"showImageOverlay"} fillColor={"#ffffff"} />
            </>
        )
    }

    const getDetailFromReward = (reward, index) => {
        return (
            <div className="flex flex-col">
                <div className="h-full grid grid-flow-row grid-cols-3 gap-2">
                    {
                        (reward.imgUrl !== undefined && reward.imgUrl !== [])?reward.imgUrl.slice(0, 3).map((url, idx) => {
                            return (
                                <div key={idx} className="relative h-24 w-full flex">
                                    <img className="object-cover h-full w-full rounded-lg drop-shadow-lg hover:brightness-75 cursor-pointer" src={url} alt={reward.nameReward + idx}
                                        onClick={() => openImage(index, idx)}/>
                                    {
                                        (reward.imgUrl.length > 3 && idx===2)?
                                        <div className="h-24 w-full flex absolute right-0 z-10 bg-[#00000080] hover:bg-[#00000099] items-center rounded-lg"
                                            onClick={() => openImage(index, 2)}>
                                            <p className="w-full text-center font-bold text-white text-4xl cursor-pointer">+{reward.imgUrl.length -3}</p>
                                        </div>:
                                        <></>
                                    }
                                </div>
                            )
                        }):<></>
                    }
                </div>
                {eventPaticipant !== undefined?awradedPaticipantShowcase(reward.idReward):<></>}
            </div>
        )
    }

    const listRewardShowcase = (
        <>
            {
                rewardList.map((reward, idx) => {
                    return (
                        <div key={idx} className="relative mb-3 last:mb-0">
                            <div className="absolute left-3 top-2 origin-center z-10 rotate-90 pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 fill-[#004599]">
                                    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="flex items-center justify-between h-8 rounded-full pr-4 pl-8 mb-2 drop-shadow-lg cursor-pointer" style={{backgroundColor: "#F5F92E"}}
                                onClick={(e) => {e.target.parentNode.firstChild.classList.toggle("rotate-90"); e.target.parentNode.lastChild.classList.toggle("hidden")}}>
                                <p className="items-center text-left text-[#004599] text-[18px] font-extrabold pointer-events-none text-ellipsis">{reward.nameReward}</p>
                                <p className="items-center text-left text-[#004599] text-[16px] font-normal pointer-events-none">{showRemain? "Số lượng còn lại: " + reward.quantityRemain : "Số lượng: " + reward.quantity}</p>
                            </div>
                            {getDetailFromReward(reward, idx)}
                        </div>
                    )
                })
            }
        </>
    )

    return (
        <>
            <div className="overflow-auto w-full grow">
                {listRewardShowcase}
                <OverlayBlock childDiv={<ShowcaseImage imgUrls={rewardList[rewardIndex]?rewardList[rewardIndex].imgUrl:[]} imgIndex={rewardImageIndex} />} manual={true} id={"showImageOverlay"}
                    rerenderOnChange={[rewardImageIndex, rewardIndex]} backgroundColor={"#000000dd"} />
            </div>
        </>
    );
}
