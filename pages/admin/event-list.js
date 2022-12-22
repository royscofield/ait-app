import React, { useEffect, useMemo, useState } from "react";
import { LEFT_COLOR, RIGHT_COLOR } from "public/util/colors";
import { db } from "src/firebase";
import { ref, onValue, query, orderByChild, equalTo } from "firebase/database";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { useUserPackageHook } from "public/redux/hooks";
import { userCurrentEventHosting } from "public/redux/actions";
import { Header, EventButton, Title, Input } from "public/shared";

export default function EventList() {
  const dispatch = useDispatch();
  const [searchContent, setSearchContent] = useState("");
  const [events, setEvents] = useState([]);
  const router = useRouter();

  //get current user from last state get in
  const currentUser = useUserPackageHook();

  // filter events by user from firebase
  const que = query(
    ref(db, "event"),
    orderByChild("createBy"),
    equalTo(String(currentUser.userId))
  );

  useEffect(() => {
    onValue(que, (snapshot) => {
      setEvents([]);
      const record = snapshot.val();
      if (record != null) {
        const data = Object.values(record);
        data.forEach((value) => {
          if (value.delFlag === false) {
            setEvents((prev) => [...prev, value]);
          }
        });
      }
    });
  }, [String(currentUser.userId)]);

  const filteredEvents = events.filter((item) => {
    return searchContent.toLowerCase() === ""
      ? item
      : item.title.toLowerCase().includes(searchContent);
  });

  const renderHeader = useMemo(() => {
    return <Header />;
  }, []);

  const renderTitle = useMemo(() => {
    return <Title title={"danh sách sự kiện"} fontSize={"text-[33px]"} />;
  }, []);

  if (!currentUser.userId) {
    return router.push("/auth/login").then;
  }

  return (
    <>
      {renderHeader}
      <section className="h-screen max-w-md mx-auto flex flex-col justify-center items-center">
        <div className="flex flex-col px-3 py-5 w-full h-full items-center">
          {renderTitle}
          <div className="max-w-md flex flex-col w-full gap-y-[19px]">
            <div id="search" className="flex flex-col mx-2">
              <Input
                content={"Tên sự kiện"}
                type={"text"}
                onChange={(e) => setSearchContent(e.target.value)}
                primaryColor={LEFT_COLOR}
                secondaryColor={RIGHT_COLOR}
                isTextGradient={true}
              />
            </div>
            <div className="flex flex-col gap-y-[7px] font-[Nunito Sans] font-bold overflow-auto max-h-[700px] mb-3">
              {filteredEvents.length !== 0 ? (
                filteredEvents.map((item, index) => (
                  <div key={index} className="flex flex-col">
                    <EventButton
                      title={item.title}
                      id={item.eventId}
                      userJoined={item.userJoined}
                      status={item.status}
                      onclick={() => dispatch(userCurrentEventHosting(item))}
                    />
                  </div>
                ))
              ) : (
                <p className="text-[#004599] text-center">Danh sách trống</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
