import React from "react";
import { TEXT } from "public/util/colors";
export default function WayLog({ title, action, path }) {
  return (
    <div className="flex-row w-full flex items-center justify-center">
      <a href={path} className={`text-[${TEXT}] underline font-semibold`}>
        {action}
      </a>
      <p className={`text-[${TEXT}] ml-1`}>{`${title}`}</p>
    </div>
  );
}
