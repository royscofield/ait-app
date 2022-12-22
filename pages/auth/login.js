/* eslint-disable no-unused-vars */
import Auth from "layouts/Auth.js";
import React, { useEffect, useCallback, useMemo, useState } from "react";
import router from "next/router";
import { auth, db } from "../../src/firebase";
import { TickBox, Title, AuthFooter, Button, Input, Line } from "public/shared"
import {
  hasWhiteSpaceAndValidLength,
  enoughNumCountPass,
} from "public/util/functions";
import { ShowMethod } from "public/util/popup";
import { ref, child, get } from "firebase/database";
import { LEFT_COLOR, RIGHT_COLOR, FAIL_RIGHT_COLOR } from "public/util/colors";
import PopUp from "public/shared/PopUp";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { messagesError, messagesSuccess } from "public/util/messages";
import { useDispatch } from "react-redux";
import { userPackage } from "public/redux/actions";
import { usePopUpMessageHook, usePopUpStatusHook, usePopUpVisibleHook, useUserPackageHook } from "public/redux/hooks";

export default function Login() {
  const message = usePopUpMessageHook();
  const status = usePopUpStatusHook()
  const visible = usePopUpVisibleHook();

  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const [check, setCheck] = useState(false);
  var [user, setUser] = useState({});

  // Call dispatch and set user to redux 
  const dispatch = useDispatch()
  const dbRef = ref(db);

  const globalUser = useUserPackageHook();
  console.log(globalUser.userId);
  const checkExistedUser = () => {
    router.push("/admin/dashboard-admin");
  }

  const loginSubmit = useCallback((name, pass) => {
    if (name === "" || pass === "") {
      ShowMethod(dispatch, messagesError.E0004, false)
      return;
    }
    if (hasWhiteSpaceAndValidLength(name)) {
      ShowMethod(dispatch, messagesError.E0005("username"), false)
      return;
    }
    get(child(dbRef, "users/")).then((snapshot) => {
      const record = snapshot.val() ?? [];
      const values = Object.values(record);
      const isUserExisting = values.some(
        (item) =>
          (item.email === name || item.name === name) && item.password === pass
      );
      if (!isUserExisting) {
        ShowMethod(dispatch, messagesError.E0009, false)
        return;
      }
      setUser(values.find(item => item.name === name || item.email === name));

      ShowMethod(dispatch, messagesSuccess.I0002, true)
      //Go to admin dashboard
      router.push("/admin/dashboard-admin");
    });
  }, [dbRef, dispatch])

  const loginAuth = useCallback(() => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const currEmail = result._tokenResponse.email;
        console.log(currEmail);
        get(child(ref(db), "users/")).then((snapshot) => {
          const record = snapshot.val() ?? [];
          const values = Object.values(record);
          const isUserExisting = values.some(
            (item) => item.email === currEmail
          );
          if (!isUserExisting) {
            ShowMethod(dispatch, messagesError.E0010, false);
            return;
          }
          setUser(values.find(item => item.email === currEmail));
          ShowMethod(dispatch, messagesSuccess.I0002, true);
          // push to path like /admin/dashboard/{nameOfUser} props check from db
          setTimeout(() => {
            router.push("/admin/dashboard-admin");
          }, 500);
        });
      })
      .catch((error) => {
        console.log(error.message);
        ShowMethod(dispatch, messagesError.E4444, false)
      });
  }, [dispatch])

  useEffect(() => dispatch(userPackage(user)), [dispatch, user])

  useEffect(() => {
    window.localStorage.setItem('USER_LOGIN_STATE', JSON.stringify(user.userId));
  }, [user]);

  const nameData = useCallback(
    (e) => {
      setName(e?.target?.value);
    },
    [setName]
  );

  const passData = useCallback(
    (e) => {
      setPass(e?.target?.value);
    },
    [setPass]
  );

  const onCheckData = useCallback(() => {
    setCheck(!check);
  }, [check]);

  const renderTitle = useMemo(() => {
    return (<Title title="ĐĂNG NHẬP" />)
  }, [])

  const renderName = useMemo(() => {
    return (
      <Input
        type="text"
        isTextGradient={true}
        primaryColor={LEFT_COLOR}
        secondaryColor={
          hasWhiteSpaceAndValidLength(name)
            ? FAIL_RIGHT_COLOR
            : RIGHT_COLOR
        }
        content={"Tên đăng nhập/Email"}
        onChange={nameData}
      />
    )
  }, [name, nameData])

  const renderPassword = useMemo(() => {
    return (
      <Input
        type="password"
        isTextGradient={true}
        primaryColor={LEFT_COLOR}
        secondaryColor={
          enoughNumCountPass(pass)
            ? FAIL_RIGHT_COLOR
            : RIGHT_COLOR
        }
        content={"Mật khẩu"}
        onChange={passData}
      />
    )
  }, [pass, passData])

  const renderPrivacy = useMemo(() => {
    return (
      <TickBox
        content="Ghi nhớ đăng nhập"
        htmlFor="rememberLogin"
        onChange={onCheckData}
      />
    )
  }, [onCheckData])

  const renderSubmitButton = useMemo(() => {
    return (
      <Button
        content="Đăng nhập"
        onClick={() => {
          loginSubmit(name, pass);
        }}
        primaryColor={LEFT_COLOR}
        secondaryColor={RIGHT_COLOR}
      />
    )
  }, [loginSubmit, name, pass]);

  const renderFirstLine = useMemo(() => {
    return (
      <Line content="hoặc" />
    )
  }, [])

  const renderAuthInput = useMemo(() => {
    return (
      <Button
        content="Đăng nhập bằng"
        onClick={() => loginAuth(name, pass)}
        isTextGradient={true}
        logoGg={true}
        primaryColor={LEFT_COLOR}
        secondaryColor={RIGHT_COLOR}
      />
    )
  }, [loginAuth, name, pass]);

  const renderSecondLine = useMemo(() => {
    return (
      <Line />
    )
  }, [])

  const renderFooter = useMemo(() => {
    return (
      <AuthFooter
        normalContent="Chưa có tài khoản?"
        boldContent="Đăng kí ngay!!!"
        href="/auth/register"
      />
    )
  }, [])

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
    <>
      <section className="h-screen mx-auto w-full flex justify-center items-center">
        <div className="flex flex-col justify-center max-w-xl w-4/5 h-full">
          {renderTitle}
          {renderName}
          {renderPassword}
          <div className="flex flex-row">
            {renderPrivacy}
          </div>
          <div>
            {renderSubmitButton}
            {renderFirstLine}
            {renderAuthInput}
            {renderSecondLine}
          </div>
          {renderFooter}
        </div>
        {renderPopUp}
      </section>
    </>
  );
}

Login.layout = Auth;
