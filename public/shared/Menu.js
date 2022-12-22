import React, { useEffect } from "react";
import CloseIcon from "public/icons/close";
import { useRouter } from "next/router";

//Component
import UserAvatar from "./UserAvatar";

//Functions
import { pressEscToClose } from "../util/functions"

//Firebase
import { auth } from "src/firebase";

//Redux
import { useDispatch } from "react-redux"
import { removeState } from "public/redux/actions";

function MenuItem(props) {
    const router = useRouter()
    return (
        <div className={`cursor-pointer flex w-full gap-x-4 items-center hover:scale-125 hover:transform hover:translate-x-[40px] transition duration-150 linear hover:text-blue-600`}>
            {props.icon}
            <a onClick={() => {router.push(props.href)}}>
                <p className="font-[900] text-[14px]">{props.name}</p>
            </a>
        </div>
    )
}


export default function Menu(props) {
    const [showMenu, setShowMenu] = [props.showMenu, props.setShowMenu]
    const [userData, setUserData] = [props.userData, props.setUserData]
    const dispatch = useDispatch()
    const user = userData
    const router = useRouter()
    const defaultAvatar = props.defaultAvatar

    pressEscToClose(setShowMenu, false)
    
    const RenderMenu = MenuList.map((item, index) => {
        return (
            <MenuItem key={index} icon={item.icon} name={item.name} href={item.href} />
        )
    }) 

    if(!showMenu) {
        return <></>
    }

    return (
        <div className="h-screen w-full absolute z-10 left-0 flex justify-between">
            <div className="bg-slate-100/60 h-screen w-full absolute z-10 left-0 flex-1 justify-between" onClick={() => {setShowMenu(false)}}>
            </div>
            <div className="bg-white h-screen w-[300px] px-[20px] py-[30px] absolute z-10 left-0">
                <button className="absolute right-2 top-2" onClick={() => {setShowMenu(!showMenu)}}>
                    <CloseIcon />
                </button>
                <div className="flex gap-x-4 items-center mt-6">
                    <UserAvatar avatar={!user.pic ? (!user.photoURL ? defaultAvatar : user.photoURL) : user.pic} width={40} height={40} />
                    <div className="font-[900]">
                        <h3 className="text-[14px]">{user.name || user.displayName}</h3>
                        <p className="text-[#656565] text-[12px]">{user.email}</p>
                    </div>
                </div>
                <div className="w-full mt-[35px] flex flex-col gap-y-4 ">
                    {RenderMenu}
                    <div className={`cursor-pointer flex w-full gap-x-4 items-center text-red-500 hover:scale-125 hover:transform hover:translate-x-[40px] transition duration-150 linear hover:text-red-600`}>
                        {logout.icon}
                        <a onClick={() => {
                            auth.signOut()
                            dispatch(removeState())
                            router.push("/auth/login")}
                        }>
                            <p className="font-[900] text-[14px]">{logout.name}</p>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

const MenuList = [
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>,
        name: "Trang chủ",
        href: "/admin/dashboard-admin"
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
        </svg>,
        name: "Tạo sự kiện",
        href: "/admin/event/event-register"
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
        </svg>,
        name: "Danh sách sự kiện",
        href: "/admin/event-list"
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
        </svg>
        ,
        name: "Tham gia sự kiện",
        href: "/"
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>,
        name: "Cài đặt tài khoản",
        href: "/auth/setting"
    },
]

const logout = {
    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
    </svg>,
    name: "Đăng xuất",
    href: "/",
}