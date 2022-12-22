import router from "next/router";
import React from "react";

export default function EventButton({
  title,
  id, // nếu muốn ẩn trường dữ liệu này thì truyền giá trị -1
  userJoined, // nếu muốn ẩn trường dữ liệu này thì truyền giá trị -1
  status,
  onclick,
}) {
  const handleClick = () => {
    const statusEvent = 2;
    switch (status) {
      case 1:
        return router.push({
          pathname: "/admin/event/event-detail",
          query: { statusEvent },
        });
      case 2:
        return router.push({
          pathname: "/admin/event/countdown-checkin",
          query: { statusEvent },
        });
      case 3:
        return router.push(`/admin/luckyspin/${String(id)}`);
      case 4:
        return router.push("/event/event-result");
      default:
        return router.push({
          pathname: "/admin/event/event-detail",
          query: { statusEvent },
        });
    }
  };
  return (
    <div onClick={handleClick} className="flex flex-col w-full">
      <button
        className={`rounded-[5px] mx-2 ${setColor(status, id, userJoined)}`}
        onClick={onclick}
      >
        <div className="flex justify-between items-center ml-4 mr-2 text-white h-10 font-[Nunito Sans]">
          <div className="justify-center items-center text-left font-bold text-sm uppercase truncate w-1/2">
            {title ? <> {title}</> : <>Title not available</>}
          </div>
          <div className="text-xs flex flex-col flex-1 text-right ml-10 items-right truncate break-words">
            {id === -1 ? (
              <></>
            ) : (
              <>
                {" "}
                {id ? (
                  <div className="truncate">{id}</div>
                ) : (
                  <>Id not available</>
                )}
              </>
            )}
            {userJoined >= 0 ? (
              <div>{userJoined} người tham gia </div>
            ) : (
              <>
                {" "}
                {userJoined === -1 ? (
                  <></>
                ) : (
                  <div>Players not available</div>
                )}{" "}
              </>
            )}
          </div>
          <div className="ml-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </div>
        </div>
      </button>
    </div>
  );
}

function setColor(status, id, userJoined) {
  if (id === -1 || userJoined === -1) {
    return "bg-[#40BEE5]";
  } else {
    switch (status) {
      case 1:
        return "bg-[#58BC66]";
      case 2:
        return "bg-[#D2D440]";
      case 3:
        return "bg-[#DDAF0C]";
      case 4:
        return "bg-[#FF6262]";
      default:
        return "bg-[#40BEE5]";
    }
  }
}

// href={`${setLink(status)}`}
