import React from "react";

export default function Input(props) {
    const inputs = {
        width: "290px",
        height: "50px",
        borderRadius: "20px",
        borderWidth: "2px",
        outline: "none"
    }

    return (
        <>
            <label htmlFor={props.type}></label>
            <input type={props.type} placeholder={props.placeholder} style={inputs} />
        </>
    )
}