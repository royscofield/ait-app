/* eslint-disable no-unused-vars */
import { React, useCallback, useMemo, useState } from "react";
import {
  BG_WHITE,
  LEFT_COLOR,
  RIGHT_COLOR,
  FAIL_RIGHT_COLOR,
} from "public/util/colors";
import Auth from "layouts/Auth.js";
import router from "next/router";
import {
  isEmail,
  hasWhiteSpaceAndValidLength,
  enoughNumCountPass,
  isEmpty,
} from "public/util/functions";
import { ref, set, child, get } from "firebase/database";
import { db, auth, app } from "src/firebase";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import PopUp from "public/shared/PopUp";
import { ShowMethod } from "public/util/popup";
import { messagesError, messagesSuccess } from "public/util/messages";
import { useDispatch } from "react-redux";
import { usePopUpMessageHook, usePopUpStatusHook, usePopUpVisibleHook, useUserPackageHook } from "public/redux/hooks";
import { Input, Title, Button, AuthFooter, Privacy, Line } from "public/shared";

const uuid = require("uuid");
const dbRef = ref(db);

export default function Register() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [email, setEmail] = useState("");
  const [check, setCheck] = useState(false);

  const message = usePopUpMessageHook();
  const status = usePopUpStatusHook()
  const visible = usePopUpVisibleHook();

  const dispatch = useDispatch();

  const globalUser = useUserPackageHook();

  if ( globalUser.userId !== undefined ) {
    router.push("/admin/dashboard-admin");
  }

  const signUpSubmit = useCallback((name, email, password) => {
    var id = uuid.v4();
    if (isEmpty(name) || isEmpty(email) || isEmpty(password)) {
      ShowMethod(dispatch, messagesError.E0004, false);
      return;
    }
    if (!isEmail(email)) {
      ShowMethod(dispatch, messagesError.E0003("Email"), false);
      return;
    }
    if (hasWhiteSpaceAndValidLength(name)) {
      ShowMethod(dispatch, messagesError.E0005("username"), false);
      return;
    }
    if (password.length < 6) {
      ShowMethod(dispatch, messagesError.E0002("password", 6), false);
      return;
    }
    if (!check) {
      ShowMethod(dispatch, messagesError.E0006, false);
      return;
    }
    if (password !== rePassword) {
      ShowMethod(dispatch, messagesError.E0021("lại mật khẩu", "mật khẩu phía trên"), false);
      return;
    }

    //Use this type of query for big data -> fast

    // const emailSet = query(ref(db, "users"), orderByKey("email"));
    // get(emailSet).then((snap) => {
    //   snap.forEach((item) => {
    //     var mailItem = item.val().email;
    //     var nameItem = item.val().name;
    //     console.log(mailItem);
    //     console.log(nameItem);
    //   });
    // });

    //Use this type of query for small data -> fast
    get(child(dbRef, "users/")).then((snapshot) => {
      const record = snapshot.val() ?? [];
      const values = Object.values(record);
      const isUserExisting = values.some(
        (item) => item.email === email || item.name === name
      );
      if (isUserExisting) {
        ShowMethod(dispatch, messagesError.E0007("username", "email"), false);
        return;
      }
      var newUser = {
        userId: id,
        name,
        email,
        password,
        pic: "",
        createAt: new Date().getTime(),
      }
      set(ref(db, `users/${id}/`), newUser).then(() => {
        ShowMethod(dispatch, messagesSuccess.I0001, true);
      });

      setTimeout(() => {
        router.push("/auth/login");
      }, 3000);
    });
  }, [check, dispatch, rePassword])

  const signUpAuth = useCallback(() => {
    signOut(auth)
      .then(async () => {
        var id = uuid.v4();
        const provider = new GoogleAuthProvider(app);
        provider.setCustomParameters({
          login_hint: "user@example.com",
        });
        await signInWithPopup(auth, provider)
          .then((result) => {
            const newUser = {
              userId: id,
              name: result._tokenResponse.email.slice(
                0,
                result._tokenResponse.email.lastIndexOf("@")
              ),
              email: result._tokenResponse.email,
              password: "123456",
              pic: result._tokenResponse.photoUrl,
              createAt: new Date().getTime(),
            };
            get(child(ref(db), "users/")).then((snapshot) => {
              const record = snapshot.val() ?? [];
              const values = Object.values(record);
              const isUserExisting = values.some(
                (item) => item.email === newUser.email
              );
              if (isUserExisting) {
                ShowMethod(dispatch, messagesError.E0008("Email"), false);
                return;
              }
              set(ref(db, `users/${id}/`), newUser).then(() => {
                ShowMethod(dispatch, messagesSuccess.I0001, true);
              });
              setTimeout(() => {
                router.push("/auth/login");
              }, 4000);
            });
          })
          .catch((error) => {
            console.log(error.message);
            ShowMethod(dispatch, messagesError.E4444, false);
          });
      })
      .catch((error) => {
        console.log(error.message);
        ShowMethod(dispatch, dispatch, dispatch, dispatch, messagesError.E4444, false);
      });
  }, [dispatch])

  const setEmailData = useCallback(
    (e) => {
      setEmail(e?.target?.value);
    },
    [setEmail]
  );

  const setNameData = useCallback(
    (e) => {
      setName(e?.target?.value);
    },
    [setName]
  );

  const setPassData = useCallback(
    (e) => {
      setPassword(e?.target?.value);
    },
    [setPassword]
  );

  const setRePassData = useCallback(
    (e) => {
      setRePassword(e?.target?.value);
    },
    [setRePassword]
  );

  const isCheckPrivacy = useCallback(() => setCheck(!check), [check]);

  const renderTitle = useMemo(() => {
    return (
      <Title title="ĐĂNG KÝ" />
    )
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
        content={"Tên đăng nhập"}
        onChange={setNameData}
      />
    )
  }, [name, setNameData])

  const renderMail = useMemo(() => {
    return (
      <Input
        type="text"
        isTextGradient={true}
        primaryColor={LEFT_COLOR}
        secondaryColor={!isEmail(email) ? FAIL_RIGHT_COLOR : RIGHT_COLOR}
        content={"Email"}
        onChange={setEmailData}
      />
    )
  }, [email, setEmailData])

  const renderPassword = useMemo(() => {
    return (
      <Input
        type="password"
        isTextGradient={true}
        primaryColor={LEFT_COLOR}
        secondaryColor={
          enoughNumCountPass(password) ? FAIL_RIGHT_COLOR : RIGHT_COLOR
        }
        content={"Mật khẩu"}
        onChange={setPassData}
      />
    )
  }, [password, setPassData])

  const renderRetypePassword = useMemo(() => {
    return (
      <Input
        type="password"
        isTextGradient={true}
        primaryColor={LEFT_COLOR}
        secondaryColor={
          enoughNumCountPass(rePassword) ? FAIL_RIGHT_COLOR : RIGHT_COLOR
        }
        content={"Nhập lại mật khẩu"}
        onChange={setRePassData}
      />
    )
  }, [rePassword, setRePassData])

  const renderPrivacy = useMemo(() => {
    return (
      <Privacy onChange={isCheckPrivacy} />
    )
  }, [isCheckPrivacy])

  const renderConfirmButton = useMemo(() => {
    return (
      <Button
        content="đăng ký"
        onClick={() => {
          signUpSubmit(name, email, password);
        }}
        primaryColor={LEFT_COLOR}
        secondaryColor={RIGHT_COLOR}
        marginY={2}
      />
    )
  }, [email, name, password, signUpSubmit])

  const renderFirstLine = useMemo(() => {
    return (
      <Line content="hoặc"/>
    )
  }, [])

  const renderAuthButton = useMemo(() => {
    return (
      <Button
        content="đăng ký với"
        onClick={() => {
          signUpAuth();
        }}
        isTextGradient={true}
        logoGg={true}
        primaryColor={LEFT_COLOR}
        secondaryColor={RIGHT_COLOR}
      />
    )
  }, [signUpAuth])

  const renderSecondLine = useMemo(() => {
    return (
      <Line/>
    )
  }, [])

  const renderFooter = useMemo(() => {
    return (
      <AuthFooter
        normalContent="Đã có tài khoản?"
        boldContent="Đăng nhập luôn!"
        href="/auth/login"
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
      <section className="h-screen mx-auto flex justify-center items-center">
        <div
          className={`flex flex-col justify-center max-w-xl w-4/5 h-full ${BG_WHITE}`}
        >
          {renderTitle}
          {renderName}
          {renderMail}
          {renderPassword}
          {renderRetypePassword}
          {renderPrivacy}
          {renderConfirmButton}
          <div>
            {renderFirstLine}
            {renderAuthButton}
            {renderSecondLine}
          </div>
          {renderFooter}
        </div>
        {renderPopUp}
      </section>
    </>
  );
}

Register.layout = Auth;
