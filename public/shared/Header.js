import React, { useEffect, useState } from "react";

// Components
import UserAvatar from "./UserAvatar";
import Menu from "./Menu";

// Icons
import MenuIcon from "public/Icons/menu";

// Redux
import { useUserPackageHook } from "public/redux/hooks";

export default function Header() {
  const [showMenu, setShowMenu] = useState(false); //True: Menu will be displayed, False: Menu will be hidden
  const [userData, setUserData] = useState({})
  const currentUser = useUserPackageHook();
  useEffect(() => {
    setUserData(currentUser)
  }, [])

  const defaultAvatar = "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aHVtYW58ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60"


  return (
    <>
      <Menu showMenu={showMenu} setShowMenu={setShowMenu} userData={userData} setUserData={setUserData} defaultAvatar={defaultAvatar} />
      <div className="w-full bg-[#40BEE5]">
        <div className="flex justify-between items-center px-[20px] py-[15px] w-full max-w-6xl mx-auto">
          <button onClick={(e) => {setShowMenu(!showMenu)}}>
            <MenuIcon />
          </button>
          <a href="/admin/dashboard-admin" className="text-2xl font-extrabold text-white">AIT LUCKY APP</a>
          <UserAvatar avatar={userData.pic || defaultAvatar} />
        </div>
      </div>
    </>
  );
}
