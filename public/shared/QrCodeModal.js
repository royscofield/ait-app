import React from "react";
import QRCode from "qrcode.react";

const downloadIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8" onClick={downloadQrCode}>
<path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
</svg>

function downloadQrCode() {
    const qrCodeURL = document.getElementById('qrCodeEl')
      .toDataURL("AIT_Event_QrCode/png")
      .replace("AIT_Event_QrCode/png", "AIT_Event_QrCode/octet-stream");
    let aEl = document.createElement("a");
    aEl.href = qrCodeURL;
    aEl.download = "QR_Code.png";
    document.body.appendChild(aEl);
    aEl.click();
    document.body.removeChild(aEl);
}


export default function QrCodeModal() {
    return (
        <div className="absolute z-50 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 block">
            <QRCode 
                value="https://google.com" //Đừng link tới Event !!! Phải có https://
                renderAs="canvas" 
                size={256}
                id="qrCodeEl"
                style={{ height: "auto", maxWidth: "100%", width: "100%" }} 
            />
            <div className="text-black mt-6 flex justify-end">
                {downloadIcon}
            </div>
        </div>
    )
}