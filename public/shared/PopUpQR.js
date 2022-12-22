import ClosePopUp from "./ClosePopUp";

function PopUpQR({ children, close }) {
    return (
        <div
        className={`h-1/4 w-3/4 max-w-md bg-white border-4
        shadow-xl shadow-slate-500 rounded-3xl flex flex-col items-center justify-center px-2`}
        >
            <ClosePopUp closeAction={close} />
            {children}
        </div>
    );
}

export default PopUpQR;
