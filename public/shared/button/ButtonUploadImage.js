import { useState } from 'react'

function ButtonUploadImage ({ content, onClick, classIcon, colorHex }) 
{

    const [file, setFile] = useState()

    const iconStyle = {
        color:"white",
        "font-size":"24px"
    }

    const buttonColor = {
        background:`${colorHex}`
    }

    // handle

    const handleChangeFile = (e) =>
    {
        console.log(e.target.files);
        setFile(URL.createObjectURL(e.target.files[0]))
    }

    return (
        <>
            <button className="flex justify-evenly items-center w-full h-[40px] rounded-[5px]" style={buttonColor}
            onClick={() => document.getElementById("getFile").click()}>
                <div className="font-[900] text-[24px] text-white">
                    {content}
                </div>
                <i className={classIcon} style={iconStyle}></i>
            </button>
            <input type={"file"} id={"getFile"} placeholder={content} onChange={handleChangeFile} style={{display:"none"}}/>
        </>
    )
}

export default ButtonUploadImage