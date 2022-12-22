import Link from "next/link";
import Image from "next/image"
import React from "react";

export default function UserAvatar({ avatar, width, height }) {
  const myLoader = ({src, width, quality}) => {
    return avatar
  }

  return (
    <Link href="/auth/setting">
      <div className="rounded-full object-cover flex justify-center items-center" >
        <Image
          loader={myLoader}
          src={"avatar.png"}
          alt="User's avatar"
          width={!width ? 45 : width}
          height={!height ? 45 : height}
          className="rounded-full object-cover"
        />
      </div>
    </Link>
  );
}
