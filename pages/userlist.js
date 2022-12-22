import Auth from "layouts/Auth.js";
import React, { useState } from "react";
import GradientLine from "public/shared/GradientLine";

function UserItemFull(props) {
  console.log(props);
  return (
    <div className="user-info flex mb-[10px]">
      <div
        className="user-image mr-[10px]"
        style={{ height: "50px", width: "50px" }}
      >
        <img className=" rounded-full " src={props.img} alt=""></img>
      </div>
      <div className="user-title  ">
        <p className="text-[#004599] font-semibold text-base mt-[10px] ">
          {" "}
          {props.title}
        </p>
      </div>
    </div>
  );
}
export default function userList() {
  return (
    <section className="h-screen max-w-[360px] px-5 py-5 mx-auto flex flex-col justify-center ">
      <div className="flex flex-col justify-center items-center w-full">
        <h1 className="text-[#004599] font-black text-xl">
          DANH SÁCH NGƯỜI CHƠI
        </h1>
        <h1 className="text-[#004599] font-bold text-base">
          SỐ NGƯỜI TRỰC TUYẾN: 55/100
        </h1>
        <h1 className="text-[#004599] font-bold text-base">
          SỐ NGƯỜI TỐI ĐA: 100
        </h1>
        <GradientLine
          color1="#003B93"
          color2="#00F0FF"
          content=""
        ></GradientLine>
      </div>
      <div className="changebutton flex justify-end">
        <button>One</button>
        <button>Two</button>
      </div>
      <div className="list-user overflow-scroll " style={{ height: "200px" }}>
        <UserItemFull
          img="https://yt3.ggpht.com/a/AATXAJwZJhv3LxUhRprtaqJJggYGzdET9Rt2kxFg_Q=s900-c-k-c0xffffffff-no-rj-mo"
          title="Nguyen Van B"
        ></UserItemFull>
        <UserItemFull
          img="https://yt3.ggpht.com/a/AATXAJwZJhv3LxUhRprtaqJJggYGzdET9Rt2kxFg_Q=s900-c-k-c0xffffffff-no-rj-mo"
          title="Nguyen Van B"
        ></UserItemFull>
        <UserItemFull
          img="https://yt3.ggpht.com/a/AATXAJwZJhv3LxUhRprtaqJJggYGzdET9Rt2kxFg_Q=s900-c-k-c0xffffffff-no-rj-mo"
          title="Nguyen Van B"
        ></UserItemFull>
        <UserItemFull
          img="https://yt3.ggpht.com/a/AATXAJwZJhv3LxUhRprtaqJJggYGzdET9Rt2kxFg_Q=s900-c-k-c0xffffffff-no-rj-mo"
          title="Nguyen Van B"
        ></UserItemFull>
      </div>
    </section>
  );
}
userList.layout = Auth;
