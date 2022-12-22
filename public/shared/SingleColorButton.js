function SingleColorButton ({ content, onClick, colorHex })
{

    const buttonColor = {
        background:`${colorHex}`
    }

    return (
        <button className="w-full h-[50px] rounded-[5px] flex justify-center items-center" onClick={onClick} style={buttonColor}>
            <div className="font-[900] text-[24px] w-full text-white flex justify-center items-center">
                {content}
            </div>
        </button>
    )
}

export default SingleColorButton