// wrapper with border 

import React from "react";

function Wrapper ({ children })
{

    const borderStyle = {
        border:"1px solid #40BEE5"
    }

    return (
        <div className="w-full h-full flex items-center rounded-[10px]" style={borderStyle}>
            {children}
        </div>
    )
}

export default Wrapper