/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/jsx-no-target-blank */
import { React, useCallback, useState, useEffect, useMemo } from "react";
import { LEFT_COLOR, RIGHT_COLOR } from "public/util/colors";
import { db } from "./../../src/firebase";
import { HideMethod, ShowMethod } from "public/util/popup";
import { isEmpty } from "public/util/functions";
import { messagesError, messagesSuccess } from "public/util/messages";
import { ref, set } from "firebase/database";
import router from "next/router";
import { useDispatch } from "react-redux";
import { incognitoParticipant } from "public/redux/actions";
import { usePlayerEventHook } from "public/redux/hooks";
import { usePopUpMessageHook, usePopUpStatusHook, usePopUpVisibleHook, useUserPackageHook } from "public/redux/hooks";
import { Title, Logo, Input, Button, PopUp } from "public/shared";

const uuid = require("uuid");
const BG_COLOR = "bg-gradient-to-tr from-[#C8EFF1] via-[#B3D2E9] to-[#B9E4A7]";

export default function Info() {
  const [name, setName] = useState("");

  const message = usePopUpMessageHook();
  const status = usePopUpStatusHook()
  const visible = usePopUpVisibleHook();

  // Call dispatch from redux
  const dispatch = useDispatch();
  var [player, setPlayer] = useState({});

  // Get current event from previous state get in
  const currEvent = usePlayerEventHook();

  const user = useUserPackageHook();

  useEffect(() => {
    if (currEvent.eventId === null || currEvent.eventId === undefined) {
      router.push("/");
    }
  })
  const onJoinClick = useCallback(() => {
    if (isEmpty(name) || name.replaceAll(" ", "") === "") {
      ShowMethod(dispatch, messagesError.E0004, false)
      return;
    }
    var id = uuid.v4();
    setName(name.trim());
    var newParticipant = {
      participantId: user.userId === undefined ? id : user.userId,
      createAt: new Date().getTime(),
      status: 2,
      nameDisplay: name,
      idReward: "",
      eventId: currEvent.eventId,
    };
    set(ref(db, `event_participants/${id}/`), newParticipant)
      .then(() => {
        ShowMethod(dispatch, messagesSuccess.I0009, true)
        setPlayer(newParticipant)
        setTimeout(() => {
          HideMethod(dispatch)
          router.push("/admin/event/countdown-checkin");
        }, 1000);
      })
      .catch((e) => {
        ShowMethod(dispatch, messagesError.E4444, false)
      });
  }, [currEvent.eventId, dispatch, name, user.userId]);

  // Set and save new player object to redux
  useEffect(() => dispatch(incognitoParticipant(player)), [dispatch, player])

  /*localStorage is here to track what has been saved*/
  useEffect(() => {
    window.localStorage.setItem('PARTICIPANT_STATE', JSON.stringify(player.participantId));
  }, [player]);

  const setNameData = useCallback(
    (e) => {
      setName(e?.target?.value);
    },
    [setName]
  );

  const renderLogo = useMemo(() => {
    return (
      <Logo />)
  }, [])

  const renderTitle = useMemo(() => {
    return (
      <Title fontSize="text-2xl" fontWeight="font-bold" title="Tên hiển thị" />
    )
  }, [])

  const renderInput = useMemo(() => {
    return (
      <Input
        placeHolder="Vui lòng nhập tên hiển thị"
        onChange={setNameData}
        type="text"
        primaryColor={LEFT_COLOR}
        secondaryColor={RIGHT_COLOR}
        noContent={true}
      />
    )
  }, [setNameData])

  const renderButton = useMemo(() => {
    return (
      <div className="w-full mb-4">
        <Button
          content="Tham gia"
          onClick={onJoinClick}
          primaryColor={LEFT_COLOR}
          secondaryColor={RIGHT_COLOR}
        />
      </div>
    )
  }, [onJoinClick])

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
      className={`h-screen mx-auto flex justify-center items-center ${BG_COLOR}`}
    >
      <div
        className={`flex flex-col justify-center items-center max-w-xl w-4/5 h-full `}
      >
        {renderLogo}
        {renderTitle}
        {renderInput}
        {renderButton}
      </div>
      {renderPopUp}
    </section>
  );
}
