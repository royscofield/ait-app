function ImageCustom ({image, onClick}) 
{

    const iconBorder = {
        border: "3px solid #fff",
        boxShadow: "0 2px 6px rgba(0,0,0,0.5), inset 0 2px 4px rgba(0,0,0,0.3)",
        textShadow: "0 1px 2px rgba(0,0,0,0.5)",
        WebkitTransition: "background 0.5s",
        transition: "background 0.5s",
    }

    return (
        <div className="w-[100px] h-[100px] flex relative">
            <img alt="" src={image} className="w-[90px] h-[90px] rounded-[5px] bg-transparent"/>
            <div className="absolute right-0 top-0 rounded-[50px] bg-black hover:bg-[#E54E4E] active:bg-[#E54E4E]" style={iconBorder} onClick={onClick}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" className="drop-shadow-sm" viewBox="0 0 24 24" strokeWidth="2.0" stroke="#FFF" class="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </div>
        </div>
    )
}

export default ImageCustom