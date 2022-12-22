
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
//firebase
import { db } from "src/firebase";
import { onValue, query, ref, orderByChild, equalTo, get, child } from "firebase/database";
//components
import { RewardList, PlayerList, Button, Line, PageLoading } from "public/shared"
//colors
import { LEFT_COLOR, RIGHT_COLOR } from "public/util/colors";


export default function EventResult() {
  // Dynamic link
  const router = useRouter();
  const EventId = router.query.eventId;

  // list db
  const [countPlayer, setCountPlayer] = useState(0);
  const [listReward, setListReward] = useState([]);
  const [listPlayer, setListPlayer] = useState([]);
  const [event, setEvent] = useState({});
  const [loadedData, setLoadedData] = useState(false);

  // get db 
  const fetchDb = () => {
    const que1 = query(ref(db, "event"), orderByChild("eventId"), equalTo(EventId));
    onValue(que1, (snapshot) => {
      console.log(snapshot.exists());
      // check id event
      if (!snapshot.exists()) {
        setTimeout(() => {
          router.push("/");
        }, 3000);
        return;
      } else {
        setTimeout(() => {
          setLoadedData(true);
        }, 1200);
      }
      const data = snapshot.val() ?? [];
      const values = Object.values(data);

      setEvent(values[0]);
    })

    const que2 = query(ref(db, "event_rewards"), orderByChild("eventId"), equalTo(EventId));
    onValue(que2, (snapshot) => {
      const data = snapshot.val() ?? [];
      const values = Object.values(data);

      setListReward(values);
    })

    const que3 = query(ref(db, "event_participants"), orderByChild("eventId"), equalTo(EventId));
    onValue(que3, (snapshot) => {
      const rawData = snapshot.val() ?? [];

      const data = Object.values(rawData);
      data.forEach((val, idx) => {
        val.ID = Object.keys(rawData)[idx];
        get(child(ref(db), "users/" + val.participantId)).then((snapshot) => {
          if (snapshot.exists()) {
            val.pic = snapshot.val().pic;
          }
        })
      })

      setTimeout(() => {

        setListPlayer(Object.values(rawData))
      }, 200);
    })

  }

  const handleExit = () => {
    router.push("/");
  }

  useEffect(() => {
    setCountPlayer(listPlayer.length);
  }, [listPlayer])

  useEffect(() => {
    fetchDb();
  }, []);

  //prevent re-render
  const renderRewardList = useMemo(() => {
    return (
      <RewardList
        listReward={listReward}
        showRemain={false}
        eventPaticipant={listPlayer}
      >{console.log(listReward, listPlayer)}</RewardList>
    )
  }, [listPlayer, listReward])

  const renderPlayerList = useMemo(() => {
    return (
      <PlayerList listPlayer={listPlayer} listReward={listReward} />
    )
  }, [listPlayer, listReward])


  const renderLine = useMemo(() => {
    return (
      <Line />
    )
  }, [])

  const renderButton = useMemo(() => {
    return (
      <Button content={"Thoát"} primaryColor={LEFT_COLOR} secondaryColor={RIGHT_COLOR} onClick={handleExit} />
    )
  }, [handleExit])

  return (
    <>
      {
        loadedData ?
          <section className="overflow-hidden flex flex-col justify-evenly h-screen">
            <div className="flex flex-col items-center justify-center h-full">
              <h1 className="uppercase text-4xl py-0 font-bold text-[#004599] mt-2">
                tiệc cuối năm
              </h1>
              <h1 className="uppercase text-2xl py-0 font-bold text-[#004599]">
                thông tin giải thưởng
              </h1>
              <div className="w-full max-w-md">
                {renderLine}
              </div>

              <div className="flex flex-col items-center justify-center w-full max-w-md overflow-y-auto h-[40%]">
                {renderRewardList}
              </div>

              <h1 className="uppercase text-2xl pt-2 font-bold text-[#004599]">
                danh sách người chơi
              </h1>
              <h1 className="uppercase text-xl pt-2 font-semibold text-[#004599]">
                số người tham gia: {countPlayer}/100
              </h1>

              <div className="flex flex-col grow w-full max-w-md h-[30%] overflow-y-auto">
                <div className="w-full max-w-md mb-3">
                  {renderLine}
                </div>
                {renderPlayerList}
              </div>

              <div className="content-end py-3 w-full max-w-md px-5">
                {renderButton}
              </div>
            </div>
          </section>
          : <PageLoading />
      }
    </>
  );
}
