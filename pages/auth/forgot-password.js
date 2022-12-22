import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import router from "next/router";

//fiebase
import {
  ref,
  get,
  query,
  orderByChild,
  equalTo,
  update,
  onValue,
} from "firebase/database";
import { db } from "src/firebase";

//util
import { LEFT_COLOR, RIGHT_COLOR, FAIL_RIGHT_COLOR } from "public/util/colors";
import { successIcon, failIcon } from "public/util/popup";
import { isEmpty, hasWhiteSpaceAndValidLength, isEmail } from "public/util/functions";
import { messagesError, messagesSuccess } from "public/util/messages";

//component
import { OverlayBlock, Input, Title, AuthFooter, Button, Line } from "public/shared";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [newPass, setNew] = useState("");
  const [repeatPass, setRepeat] = useState("");
  const [flagReset, setFlagReset] = useState(false);

  //validation const
  const [textState, setTextState] = useState("");
  const [isHidden, setIsHidden] = useState(true);
  const [isSuccess, setIsSuccess] = useState(true);
  const showMethod = useMemo(() => (message, isSuccess, isHidden) => {
    setTextState(message);
    setIsSuccess(isSuccess);
    setIsHidden(isHidden);
  }, [])

  const handleCheck = (name, email) => {
    // validation
    if (hasWhiteSpaceAndValidLength(name)) {
      showMethod(messagesError.E0005("Tên đăng nhập"), false, false);
      return;
    }

    if (isEmpty(name)) {
      showMethod(messagesError.E0001("Tên đăng nhập"), false, false);
      return;
    }

    if (isEmpty(email)) {
      showMethod(messagesError.E0001("Email"), false, false);
      return;
    }

    if (!isEmail(email)) {
      showMethod(messagesError.E0003("Email"), false, false);
      return;
    }

    if (hasWhiteSpaceAndValidLength(email)) {
      showMethod(messagesError.E0005("Email"), false, false);
      return;
    }

    try {
      const que = query(ref(db, "users"), orderByChild("email"), equalTo(email));
      onValue(que, (snapshot) => {
        const record = snapshot.val() ?? [];
        const values = Object.values(record);

        if (values.length === 0) {
          showMethod(messagesError.E0009, false, false);
          return;
        }
        if (values[0].name !== name) {
          showMethod(messagesError.E0011("Tên đăng nhập"), false, false);
          return;
        }
        if (values[0].email !== email) {
          showMethod(messagesError.E0011("Email"), false, false);
          return;
        } else {
          setFlagReset(true);
          return;
        }
      })
    } catch (error) {
      showMethod(messagesError.E1002, false, false);
      return;
    }
  };

  const handleReset = () => {
    if (isEmpty(newPass) || isEmpty(repeatPass)) {
      showMethod(messagesError.E0004, false, false);
      return;
    }

    if (hasWhiteSpaceAndValidLength(newPass)) {
      showMethod(messagesError.E0005("mật khẩu mới"), false, false);
      return;
    }

    if (hasWhiteSpaceAndValidLength(repeatPass)) {
      showMethod(messagesError.E0005("nhập lại mật khẩu"), false, false);
      return;
    }

    if (newPass != repeatPass) {
      showMethod(messagesError.E0021("mật khẩu mới", "nhập lại mật khẩu"), false, false);
      return;
    }

    const que = query(ref(db, "users"), orderByChild("email"), equalTo(email));
    get(que).then((snapshot) => {
      const record = snapshot.val() ?? [];
      const values = Object.values(record);

      update(ref(db, 'users/' + values[0].userId),
        {
          password: newPass
        }).then(() => {
          showMethod(messagesSuccess.I0003, true, false);
          setFlagReset(false);
          router.push("auth/login")
          return;
        })
        .catch((error) => {
          showMethod(error, false, false);
          return;
        });

    })
  }

  // show popup
  useEffect(() => {
    if (isHidden == false) {
      isSuccess ? document.getElementById("imgPopup").src = successIcon : document.getElementById("imgPopup").src = failIcon;
      document.getElementById("textState").innerHTML = textState;
      document.getElementById("forgotOverlay").classList.toggle('hidden');
      const timer = setTimeout(() => {
        setIsHidden(true);
      }, 1)
      return () => { clearTimeout(timer) }
    }
  }, [isHidden])


  //useCallback
  const nameData = useCallback(
    (e) => {
      setName(e?.target?.value.replace(/^\s+|\s+$/gm, ''))
    }, [setName]
  )

  const emailData = useCallback(
    (e) => {
      setEmail(e?.target?.value.replace(/^\s+|\s+$/gm, ''))
    }, [setEmail]
  )


  const newPassData = useCallback(
    (e) => {
      setNew(e?.target?.value.replace(/^\s+|\s+$/gm, ''))
    },
    [setNew]
  )

  const repeatPassData = useCallback(
    (e) => {
      setRepeat(e?.target?.value.replace(/^\s+|\s+$/gm, ''))
    },
    [setRepeat]
  )

  //useMemo
  const popupNoti = useMemo(() => {
    return (
      <div className="flex flex-col items-center">
        <div className="text-center text-[#004599]">
          <p className="font-[900] text-lg" id="textState"></p>
        </div>
        <img
          id="imgPopup"
          alt="success"
          src={failIcon}
          className="self-center w-12"
        ></img>
      </div>
    )
  }, [])

  const renderName = useMemo(() => {
    return (
      <Input
        content={"Tên đăng nhập"}
        type={"text"}
        isTextGradient={true}
        onChange={nameData}
        primaryColor={LEFT_COLOR}
        secondaryColor={!hasWhiteSpaceAndValidLength(name) ? RIGHT_COLOR : FAIL_RIGHT_COLOR}
        value={name} />
    )
  }, [name, setName])

  const renderEmailInput = useMemo(() => {
    return (
      <Input
        content={"Email"}
        type={"text"}
        isTextGradient={true}
        onChange={emailData}
        primaryColor={LEFT_COLOR}
        secondaryColor={isEmail(email) ? RIGHT_COLOR : FAIL_RIGHT_COLOR}
        value={email} />
    )
  }, [email, setEmail])

  const renderNewPass = useMemo(() => {
    return (
      <Input
        content={"Mật khẩu mới"}
        type={"password"}
        isTextGradient={true}
        primaryColor={LEFT_COLOR}
        secondaryColor={!hasWhiteSpaceAndValidLength(newPass) ? RIGHT_COLOR : FAIL_RIGHT_COLOR}
        onChange={newPassData}
        value={newPass} />
    )
  }, [newPass, newPassData])

  const renderRepeatPass = useMemo(() => {
    return (
      <Input
        content={"Nhập lại mật khẩu"}
        type={"password"}
        isTextGradient={true}
        primaryColor={LEFT_COLOR}
        secondaryColor={!hasWhiteSpaceAndValidLength(repeatPass) ? RIGHT_COLOR : FAIL_RIGHT_COLOR}
        onChange={repeatPassData}
        value={repeatPass} />
    )
  }, [repeatPass, repeatPassData]
  )

  const renderTitle = useMemo(() => {
    return (
      <Title title="QUÊN MẬT KHẨU" />
    )
  }, [])

  const renderButtonCheck = useMemo(() => {
    return (
      <Button
        content="GỬI"
        onClick={() => {
          handleCheck(name, email);
        }}
        primaryColor={LEFT_COLOR}
        secondaryColor={RIGHT_COLOR}
      />
    )
  }, [handleCheck])

  const renderButtonReset = useMemo(() => {
    return (
      <Button
        content="GỬI"
        onClick={() => {
          handleReset();
        }}
        primaryColor={LEFT_COLOR}
        secondaryColor={RIGHT_COLOR}
      />
    )
  }, [handleReset])

  const renderLine = useMemo(() => {
    return (
      <Line />
    )
  }, [])

  const renderBackToLogin = useMemo(() => {
    return (
      <Link href={"/auth/login"} className="my-0">
        <button className="w-full ">
          <div className="font-[600] text-[16px] text-[#004599]">
            {"Trở lại Đăng nhập"}
          </div>
        </button>
      </Link>
    )
  }, [])

  const renderOverlayBlock = useMemo(() => {
    return (
      <OverlayBlock childDiv={popupNoti} id={"forgotOverlay"} />
    )
  }, [])
  return (
    <section className="h-screen overflow-y-hidden">
      <div className="flex flex-col xl:justify-center lg:justify-center justify-center items-center mt-20">
        <div className="relative mb-5">
          {renderTitle}
        </div>
        {!flagReset ?

          <div className="w-[90%] max-w-md mx-0">
            {renderName}
            {renderEmailInput}
            {renderButtonCheck}
          </div>
          : <div className="w-[90%] max-w-md mx-0">
            {renderNewPass}
            {renderRepeatPass}
            {renderButtonReset}
          </div>
        }
        <div className="w-[90%] max-w-md mt-4">
          {renderLine}
          {renderBackToLogin}
        </div>
        {renderOverlayBlock}
      </div>
    </section>
  );
}