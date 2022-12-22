import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";

import Header from "public/shared/Header";
import { HideMethod, ShowMethod } from "public/util/popup";
import PopUp from "public/shared/PopUp";
import CheckBox from "public/shared/CheckBox";
import { messagesError, messagesSuccess } from "public/util/messages";
import { LEFT_COLOR, RIGHT_COLOR } from "public/util/colors";
import { Button, Input, PageLoading } from "public/shared";

import { useDispatch } from "react-redux";
import { userEventCreating } from "public/redux/actions";
import { useUserPackageHook } from "public/redux/hooks";
import { usePopUpMessageHook, usePopUpStatusHook, usePopUpVisibleHook } from "public/redux/hooks";

const uuid = require("uuid");

export default function EventRegister() {
    // router
    const router = useRouter();
    // get user id from redux
    const user = useUserPackageHook();
    // state
    const [loadedData, setLoadedData] = useState(false)
    const [title, setTitle] = useState(""); // title of event
    const [description, setDescription] = useState(""); // description of event
    const [maxTicket, setMaxTicket] = useState(""); // limit player in event
    const [publicFlag, setPublicFlag] = useState(true); // event public or not

    const contentCSS = {
        background: "-webkit-linear-gradient(45deg, #003B93, #00F0FF)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
    };

    // message pop up
    const message = usePopUpMessageHook();
    const status = usePopUpStatusHook();
    const visible = usePopUpVisibleHook();

    // create event id 
    let id = useRef();

    useEffect(() => { id.current = uuid.v4() }, []);

    setTimeout(() => setLoadedData(true), 2500)  // load page

    // check admin
    useEffect(() =>
    {
        if(user.userId === undefined || user.userId === null || user.userId === "" ) { router.push("/") }
    },[])

    const dispatch = useDispatch();
    // handle submit button
    const handleSubmit = useCallback((title, description, maxTicket, publicFlag) => 
    {
        if (title === "" || description === "" || maxTicket === "") {
            ShowMethod(dispatch, messagesError.E0004, false);
            return;
        }

        if (title !== "" && description !== "" && maxTicket !== "") {
            const newEvent = {
                eventId: id.current,
                publicFlag: publicFlag ? 1 : 0,
                title: title,
                description: description,
                maxTicket: maxTicket,
                createAt: new Date().getTime(),
                createBy: user.userId,
                userJoined: 0,
                pinCode: id.current.slice(0, 6),
                status: 1,
                delFlag: false,
            };
            dispatch(userEventCreating(newEvent));
            ShowMethod(dispatch, messagesSuccess.I0007("sự kiện"), true);
            setTimeout(() => {
                HideMethod(dispatch);
                router.push("/admin/event/reward-register");
            }, 2000);
        }
    },[dispatch]);

    // onChange
    const onChangeTitle = useCallback( (e) => { setTitle(e?.target?.value);}, [setTitle]);

    const onChangeDescription = useCallback( (e) => { setDescription(e?.target?.value); }, [setDescription] );

    const onChangePublicFlag = useCallback( (e) => { setPublicFlag(e?.target?.checked); }, [setPublicFlag] );

    const onChangeMaxTicket = useCallback( (e) => { setMaxTicket(e?.target?.value); }, [setMaxTicket] );

    // render component
    const renderHeader = useMemo(() => { return ( <div className="w-full"> <Header /> </div> ); }, []);

    const renderTitleHeader = useMemo(() => {
        return (
        <>
            <h1 className="font-[900] uppercase text-[#004599] text-[36px] text-center mb-2"> đăng ký </h1>
            <h1 className="font-[900] uppercase text-[#004599] text-[25px] text-center mb-4"> thông tin sự kiện </h1>
        </>
        );
    }, []);

    const renderTitle = useMemo(() => {
        return (
            <div className="w-full h-[70px]">
                <Input primaryColor={LEFT_COLOR} secondaryColor={RIGHT_COLOR} content={"Tên sự kiện"} maxLength={"100"} value={title} onChange={onChangeTitle} />
            </div>
        );
    }, [title, onChangeTitle]);

    const renderDescription = useMemo(() => {
        return (
            <div className="pb-[1rem] pt-[2rem] w-full h-[200px]">
                <Input content={"Mô tả sự kiện"} row={4} maxLength={"1000"} value={description} onChange={onChangeDescription} isMultiLine={true} />
            </div>
        );
    }, [description, onChangeDescription]);

    const renderMaxTicket = useMemo(() => {
        return (
            <div className="w-full">
                <Input primaryColor={"#003B93"} secondaryColor={"#00F0FF"} content={"Giới hạn người tham gia"} type={"number"} min={"1"} value={maxTicket} onChange={onChangeMaxTicket} />
            </div>
        );
    }, [maxTicket, onChangeMaxTicket]);

    const renderCheckbox = useMemo(() => {
        return (
            <div className="w-full flex justify-center items-center">
                <div className="w-[70%]">
                    <p style={contentCSS} className="font-bold"> Cho phép người tham gia không cần đăng nhập </p>
                </div>
                <div className="w-[30%] flex items-center text-right">
                    <CheckBox value={publicFlag} onChange={onChangePublicFlag} />
                </div>
            </div>
        );
    }, [publicFlag, onChangePublicFlag]);

    const renderPopUp = useMemo(() => {
        return ( <div className={visible}> <PopUp text={message} status={status} isWarning={!status} /> </div> );
    }, [visible, status, message]);

    const renderButton = useMemo(() => {
        return (
            <div className="py-3 w-4/5 max-w-xl">
                <Button content={"TIẾP TỤC"} primaryColor={"#003B93"} secondaryColor={"#00F0FF"} onClick={() => handleSubmit(title, description, maxTicket, publicFlag) }/>
            </div>
        );
    }, [handleSubmit, title, description, maxTicket, publicFlag]);

  return (
    <>
    {
        loadedData ? 
        (
            <section className="flex flex-col overflow-y-auto overflow-x-hidden items-center justify-between h-screen w-screen">
                {renderHeader}
                <div className="w-full flex items-center justify-center">
                    <div className="flex flex-col items-center justify-center w-4/5 max-w-xl">
                        {renderTitleHeader}
                        {renderTitle}
                        {renderDescription}
                        {renderMaxTicket}
                        {renderCheckbox}
                    </div>
                </div>
                {renderButton}
                {renderPopUp}
            </section>
        )
        : 
        (
            <PageLoading />
        )
    }
    </>
  );
}
