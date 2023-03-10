import React, { useState, useEffect, useMemo } from "react";
// import firebase
import { db } from "src/firebase";
import { ref, orderByChild, equalTo, query, onValue } from "firebase/database";

// components
import Header from "public/shared/Header";
import EventButton from "public/shared/button/EventButton";
import Input from "public/shared/Input";
import { LEFT_COLOR, RIGHT_COLOR } from "public/util/colors";
import Line from "public/shared/Line";

//import gif
import nyancat from "public/img/nyancat.gif";
import { useUserPackageHook } from "public/redux/hooks";
import router from "next/router";
import Button from "public/shared/Button";

export default function Dashboard() {
  const [arrStatus, setArrStatus] = useState([]);
  const [arrID, setArrID] = useState([]);
  // const [currentId, setcurentId] = useState([]);
  const currentUser = useUserPackageHook();
  // create query
  const queStatus = query(ref(db, "event"), orderByChild("status"), equalTo(2));
  const queID = query(
    ref(db, "event"),
    orderByChild("createBy"),
    equalTo(String(currentUser.userId))
  );
  const checkAuth = () => {
    router.push("/auth/login");
  };
  // get(child(ref(db), `event`))
  // .then((snapshot) => {
  //   const res = snapshot.val() ?? [];
  //   const values = Object.values(res);
  //   setArr(values);
  // })
  // .catch((error) => {
  //   alert(error.message);
  //   console.error(error);
  // });

  // useEffect(() => {
  //   onValue(child(ref(db), "event/"), (snapshot) => {
  //     const record = snapshot.val() ?? [];
  //     const values = Object.values(record);
  //     values.forEach((value) => {
  //       if (value.status === 2) {
  //         setQueryStatus((prev) => [...prev, value]);
  //         console.log(value);
  //       }
  //     });
  //     console.log(queryStatus);
  //   });
  // }, []);

  useEffect(() => {
    onValue(queStatus, (snapshot) => {
      setArrStatus([]);
      const data = snapshot.val();
      if (data != null) {
        setArrStatus(Object.values(data));
      }
    });
  }, []);

  useEffect(() => {
    onValue(queID, (snapshot) => {
      setArrID([]);
      const data = snapshot.val();
      if (data != null) {
        setArrID(Object.values(data));
      }
    });
  }, [String(currentUser.userId)]);

  const renderHeader = useMemo(() => {
    return <Header />;
  }, []);

  const renderJoinEvent = useMemo(() => {
    return (
      <Input content={""}>
        <div className="flex flex-col pb-4 pt-2">
          <div className="flex flex-col">
            <div className="flex flex-col flex-1">
              <p className="font-bold text-sm text-[#656565] mt-2">
                {"Ch??o m???ng ?????n v???i AIT Lucky App,"}
              </p>
            </div>

            <div className="flex justify-between items-end w-full">
              <p className="text-sm text-[#656565] mb-2">
                {"h??y b???t ?????u c??c s??? ki???n ngay n??o!"}
              </p>
              <img src={nyancat} className="md:w-1/5 md:h-min w-[30px] h-[20.7px]" alt="must be a nyancat gif"></img>
            </div>
          </div>
          <div className="w-full mb-2">
            <Line marginY = {false}
              
            />
          </div>
          <p className="font-bold text-sm text-[#000000] ">
            {"Tham gia s??? ki???n"}
          </p>
          <p className="text-sm text-[#656565]">
            {
              "Tham gia v??o c??c s??? ki???n ???????c t??? ch???c v???i t??i kho???n ????ng nh???p hi???n t???i c???a b???n."
            }
          </p>
          <a href="/">
            <Button
              content={"CH??I N??O!!!"}
              primaryColor={LEFT_COLOR}
              secondaryColor={RIGHT_COLOR}
            />
          </a>
          <p className="font-bold text-sm text-[#000000] pb-2">
            {"C??c s??? ki???n ??ang di???n ra"}
          </p>
          <div className="w-full flex flex-col gap-y-[7px] overflow-auto max-h-[188px] scrollbar-hide">
            {arrStatus.length === 0 ? (
              <div className="w-full flex items-center text-center justify-center text-sm text-[#000000]">
                {" "}
                {"Kh??ng c?? d??? li???u"}
              </div>
            ) : (
              arrStatus.map((item, index) => (
                <div key={index} className="flex flex-col">
                  <EventButton
                    title={item.title}
                    user_joined={item.userJoined}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </Input>
    );
  }, [arrStatus]);

  const renderCreateEvent = useMemo(() => {
    return (
      <Input content={"T???o s??? ki???n"} isTextGradient={true}>
        <div className="">
          <p className="text-sm text-[#656565] pt-5">
            {
              "T???o m???t s??? ki???n quay th?????ng m???i, b???n c?? th??? thi???t l???p c??c gi???i th?????ng, m???i gi???i th?????ng g???m t??n, kh??i qu??t, h??nh ???nh gi???i th?????ng, s??? l?????ng gi???i."
            }
          </p>
          <a href="/admin/event/event-register">
            <Button
              content={"B???T ?????U NGAY"}
              primaryColor={LEFT_COLOR}
              secondaryColor={RIGHT_COLOR}
            />
          </a>
        </div>
      </Input>
    );
  }, []);

  const renderShowEvent = useMemo(() => {
    return (
      <Input content={"Danh s??ch s??? ki???n"} isTextGradient={true}>
        <div className="flex flex-col pt-5 gap-y-[7px]">
          {arrID.length === 0 ? (
            <div className="w-full flex items-center text-center justify-center text-sm text-[#000000] ">
              {" "}
              {"Kh??ng c?? d??? li???u"}
            </div>
          ) : (
            arrID.slice(0, 4).map((item, index) => (
              <div key={index} className="flex flex-col">
                <EventButton title={item.title} id={item.eventId} />
              </div>
            ))
          )}
          <a href="event-list">
            <Button
              content={"T???T C??? S??? KI???N"}
              primaryColor={LEFT_COLOR}
              secondaryColor={RIGHT_COLOR}
            />
          </a>
        </div>
      </Input>
    );
  }, [arrID]);

  return (
    <>
      {currentUser.userId == null ? (
        checkAuth()
      ) : (
        <div>
          {renderHeader}
          <section className="h-full max-w-xl w-4/5 mx-auto flex flex-col justify-center items-center">
            {/* participate in event */}
            {renderJoinEvent}
            {/* create a event */}
            {renderCreateEvent}
            {/* show events */}
            {renderShowEvent}
          </section>
        </div>
      )}
    </>
  );
}
