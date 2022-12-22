import { useEffect, useState, useRef, useMemo, useCallback } from "react";

import Line from "public/shared/Line";
import ImageCustom from "public/shared/ImageCustom";
import { Input } from "public/shared";

const uuid = require("uuid");

function Reward ({ rewardId, fileID, toggleID, rewardName, amount, imageList, receiveData }) {

    let id = useRef()

    if(rewardId)
    {
        id.current = rewardId
    }
    else {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() =>
        {
            id.current = uuid.v4()
        },[])
    }

    let initImage

    imageList ? initImage = imageList : initImage = []

    const [imgList, setImgList] = useState([])
    const [beforeImg, setBeforeImg] = useState(initImage)
    const [img, setImg] = useState(initImage)
    const [file, setFile] = useState([])
    const [count, setCount] = useState(amount || 1)
    const [name, setName] = useState(rewardName || "")
    const [value, setValue] = useState({})
    const [storageImg, setStorageImg] = useState([])

    const iconStyle = { color:"white", fontSize:"24px" }

    const buttonColor = { background:"#40BEE5" }
   
    const contentCSS = {
        background: "-webkit-linear-gradient(45deg, #003B93, #00F0FF)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
    }
   
    const icon = { width:"32px",height:"32px",margin:"0 12px" }

    useEffect(() =>
    {
        if(file !== undefined) { setImgList(prev => [...prev, file]) } // display
    },[file])

    useEffect(() => { setImg(prev => [...prev, storageImg])},[storageImg]) // upload to db

    // set value to parent component (reward-register)
    useEffect(() =>
    {
        setValue(() => [{
                        id:id.current,
                        name: name,
                        amount: count,
                        image: img
                    }])
    },[img, count, name])

    useEffect(() => { receiveData(value) },[value])

    // upload and preview image
    const handleChangeFile = useCallback((e) =>
    {
        if(e.target.files.length !== 0)
        {
            const upload = e.target.files[0]
            setStorageImg(upload)  // upload to db
    
            setFile(upload)  // display
    
            let toggle = document.getElementById(toggleID)
            toggle.style.display = "flex"
        }
    },[file, setFile])

    useEffect(() =>
    {
        if(imageList)
        {
            let toggle = document.getElementById(toggleID)
            toggle.style.display = "flex"
        }
    },[])

    const getImage = useCallback((e) => { document.getElementById(fileID).click() },[])

    // delete image
    const handleDeleteImageHasBefore = (e) => 
    { 
        const remain = imageList.filter((item, index) => index !== e)
        setBeforeImg(remain)
        setImg(remain)
    }

    const handleDeleteImageNow = (e) =>
    {
        const remain = imgList.filter((item, index) => index !== e)
        setImgList(remain)
        setImg(remain)
    }

    // render component
    const renderInput = useMemo(() =>
    {
        return (
            <div className="flex w-full">
                <Input value={name} onChange={(e) => setName(e.target.value)} content={"Tên giải thưởng"} primaryColor="#003B93" secondaryColor="#00F0FF" type={"text"} />
            </div>
        )
    },[name, setName])

    const renderCount = useMemo(() => 
    {
        return (
            <div className="flex justify-evenly items-center w-full mt-1 mb-2 lg:justify-center">
                <label className="font-bold" style={contentCSS}>Số lượng</label>
                <div className="flex justify-between items-center text-lg font-bold" style={contentCSS}>
                    <i className="fas fa-minus px-2 flex justify-center items-center cursor-pointer" style={icon} onClick={() => setCount(prev => Math.max(prev -1, 0))}></i>
                    <label>{count}</label>
                    <i className="fas fa-plus px-2 flex justify-center items-center cursor-pointer" style={icon} onClick={() => setCount(prev => prev + 1)}></i>
                </div>
            </div>
        )
    },[count, setCount])

    const renderImageList = useMemo(() =>
    {
        return (
            <div className="flex w-full mb-2 overflow-x-auto overflow-y-hidden ">
                <div className="w-full mb-2 hidden" id={toggleID}>
                    {
                        imageList ? (
                            <>
                            {
                                beforeImg.map((item, index) =>
                                {
                                    return (
                                        <div key={index} className="mx-2"> <ImageCustom image={item} onClick={() => handleDeleteImageHasBefore(index)}/> </div> 
                                    )
                                })
                            }
                            {
                                imgList.map((item,index) =>
                                {
                                    if(index === 0)
                                    {
                                        return <div key={index}></div>
                                    }
                                    else {
                                        return (
                                            <div key={index} className="mx-2"> <ImageCustom image={URL.createObjectURL(item)} onClick={() => handleDeleteImageNow(index)}/> </div>
                                        )
                                    }
                                })
                            }
                            </>
                        ) : (
                            imgList.map((item,index) =>
                            {
                                if(index === 0) {
                                    return <div key={index}></div>
                                }
                                else {
                                    return (
                                        <div key={index} className="mx-2"> <ImageCustom image={URL.createObjectURL(item)} onClick={() => handleDeleteImageNow(index)}/> </div>
                                    )
                                }
                            })
                        )
                    }
                </div>
            </div>
        )
    },[imgList, beforeImg])

    const renderAddImageButton = useMemo(() => {
        return (
            <div className="w-full mb-2">
                <button className="flex justify-evenly items-center w-full h-[35px] rounded-[5px]" style={buttonColor} onClick={getImage}>
                    <div className="font-[900] text-[24px] text-white">Thêm hình ảnh</div>
                    <i className="fas fa-image" style={iconStyle}></i>
                </button>
                <input type={"file"} id={fileID} onChange={handleChangeFile} style={{display:"none"}}/>
            </div>
        )
    },[getImage, handleChangeFile])

    
    const renderLine1 = useMemo(() =>
    {
        return ( <div className="w-full flex"> <Line content={"Hình ảnh giải thưởng"}/> </div> )
    },[])
    
    const renderLine2 = useMemo(() =>  { return ( <div className="w-full flex mb-2"> <Line /> </div> ) },[])

    return (
        <>
            <div className="w-full flex flex-col items-center justify-center">
                <form className="w-full">
                    {renderInput}
                    {renderCount}
                    {renderLine1}
                    {renderImageList}
                </form>
                {renderAddImageButton}
                {renderLine2}
            </div>
        </>
    )
}

export default Reward