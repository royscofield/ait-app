import { forwardRef } from "react"

function CheckBox (props, ref) {
    return (
        <div className="w-full">
            <input
                ref={ref}
                type="checkbox"
                id="accept"
                value={props.value}
                onChange={props.onChange}
                defaultChecked
                className="appearance-none w-9 focus:outline-none checked:bg-blue-300 h-5 bg-[#ccc] rounded-full before:inline-block before:rounded-full before:bg-blue-500 before:h-4 before:w-4 checked:before:translate-x-full shadow-inner transition-all duration-300 before:ml-0.5"
            />
        </div>
    )
}

export default forwardRef(CheckBox)