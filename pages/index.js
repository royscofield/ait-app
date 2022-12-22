/* eslint-disable no-lone-blocks */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/jsx-no-target-blank */
import { React, useCallback, useEffect, useMemo, useState } from "react";
import { LEFT_COLOR, RIGHT_COLOR } from "public/util/colors";
import router from "next/router";
import { db } from "src/firebase";
import { ref, child, get } from "firebase/database";
import { isEmpty } from "public/util/functions";
import { ShowMethod } from "public/util/popup";
import { messagesError, messagesSuccess } from "public/util/messages";
import { useDispatch } from "react-redux";
import { incognitoEvent, incognitoUser } from "public/redux/actions";
import { usePopUpMessageHook, usePopUpStatusHook, usePopUpVisibleHook, useUserPackageHook } from "public/redux/hooks";
import { Line, Button, PopUp, WayLog, Logo, Input, QrButton, Title } from "public/shared";

export default function Index() {
  const [pin, setPin] = useState("");

  const message = usePopUpMessageHook();
  const status = usePopUpStatusHook()
  const visible = usePopUpVisibleHook();

  //Call dispatch from redux
  const dispatch = useDispatch();
  var BG_COLOR =
    "bg-gradient-to-tr from-[#C8EFF1] via-[#B3D2E9] to-[#B9E4A7]";
  var [event, setEvent] = useState({});
  var [user, setUser] = useState({});

  const globalUser = useUserPackageHook();

  const onJoinClick = useCallback(() => {
    if (isEmpty(pin)) {
      ShowMethod(dispatch, messagesError.E2002, false);
      return;
    }
    get(child(ref(db), "event/")).then((snapshot) => {
      const record = snapshot.val() ?? [];
      const values = Object.values(record);
      var currEvent = values.find((item) => item.pinCode === pin);
      if (currEvent === undefined) {
        ShowMethod(dispatch, messagesError.E2004, false);
        return;
      }
      get(child(ref(db), "users/")).then((snapshot) => {
        const record = snapshot.val() ?? [];
        const values = Object.values(record);
        var currUser = values.find((item) => item.userId === event.createBy);
        setUser(currUser);
      });
      setEvent(currEvent);
      ShowMethod(dispatch, messagesSuccess.I0008(currEvent.title), true);
      setTimeout(() => {
        router.push("/event/join");
      }, 500);
    });
  }, [dispatch, event.createBy, pin]);

  /* Export current event to redux for another access */
  useEffect(() => {
    dispatch(incognitoEvent(event));
    dispatch(incognitoUser(user));
  }, [dispatch, event, user])

  /*localStorage is here to track what has been saved*/
  useEffect(() => {
    window.localStorage.setItem('EVENT_JOINED_STATE', JSON.stringify(event.eventId));
  }, [event]);

  console.log({ pin })

  const pinData = useCallback(
    (e) => {
      setPin(e?.target?.value);
    }, [setPin]
  );

  const renderLogo = useMemo(() => {
    return (
      <Logo />
    )
  }, [])

  const renderTitle = useMemo(() => {
    return (
      <Title fontSize="text-2xl" fontWeight="font-bold" title="Mã pin sự kiện" />
    )
  }, [])

  const renderInput = useMemo(() => {
    return (
      <Input
        placeHolder="Mã pin"
        onChange={pinData}
        type="text"
        primaryColor={LEFT_COLOR}
        secondaryColor={RIGHT_COLOR}
        noContent={true}
      />
    )
  }, [pinData])

  const renderButton = useMemo(() => {
    return (
      <div className="w-full">
        <Button
          content="Tham gia"
          onClick={onJoinClick}
          primaryColor={LEFT_COLOR}
          secondaryColor={RIGHT_COLOR}
        />
      </div>
    )
  }, [onJoinClick])

  const renderLine = useMemo(() => {
    return (
      <Line content="hoặc" />
    )
  }, [])

  const renderDirect = useMemo(() => {
    return globalUser.userId !== undefined 
      ? (<div></div>)
      : (
        <div>
          <WayLog
            action="Đăng nhập"
            title="để quản lý sự kiện?"
            path="/auth/login"
          />
          <WayLog
            action="Đăng ký"
            title="để tạo tài khoản."
            path="/auth/register"
          />
        </div>
      )
  }, [globalUser])

  const renderPopUp = useMemo(() => {
    return (
      <div className={visible}>
        <PopUp
          text={message}
          status={status}
          isWarning={!status}
        />
      </div>
    )
  }, [visible, status, message])

  return (
    <section
      className={`h-screen w-screen mx-auto flex justify-center items-center ${BG_COLOR}`}
    >
      <div
        className={`flex flex-col justify-center items-center max-w-xl w-4/5 h-full `}
      >
        {renderLogo}
        {renderTitle}
        {renderInput}
        {renderButton}
        {renderLine}
        <QrButton onClick={() => alert("Please scan a QR code to join.")} />
        {/* Handle logic todo: go direct to open device's camera */}
        {renderDirect}
      </div>
      {renderPopUp}
    </section>
  );
}
