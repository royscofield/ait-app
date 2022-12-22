import { useState } from 'react'
import AuthInput from "public/shared/TextArea";
import ButtonUploadImage from "public/shared/button/ButtonUploadImage";

const MoreGift = () =>
{  

    const [giftDetail, setGiftDetail] = useState("")

    return (
            <div className="w-full h-full">
                <div className="flex flex-col justify-between items-center relative w-full h-[90%] mt-3">
                    <AuthInput value={giftDetail} onChange={(e) => setGiftDetail(e.target.value)} content={"Mô tả phần quà"} />
                    <div className="mt-1 mb-2 w-full">
                        <ButtonUploadImage content={"Thêm hình ảnh"} classIcon={"fas fa-image"} colorHex={"#40BEE5"}/>
                    </div>
                </div>
            </div>
    )
}

export { MoreGift }