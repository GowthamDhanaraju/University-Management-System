import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { IoMdNotificationsOutline } from "react-icons/io";
import { FaSignOutAlt } from "react-icons/fa";

const NotificationBadge = () => {
  const [count] = useState(3);
  return (
    <div className="relative">
      <IoMdNotificationsOutline className="text-xl text-gray-300 hover:text-white cursor-pointer" />
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {count}
        </span>
      )}
    </div>
  );
};

const TopBar = () => {
  const router = useRouter();
  const [time, setTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <div className="flex justify-end items-center space-x-6 mb-4">
        <div className="text-white bg-gray-800 px-4 py-2 rounded-xl shadow flex items-center space-x-2">
          {mounted ? (
            <>
              <span>
                {time.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </span>
              <span className="text-gray-400">|</span>
              <span>
                {time.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </>
          ) : (
            <span className="text-gray-400">Loading...</span>
          )}
        </div>
        <NotificationBadge />
        <button
          onClick={() => router.push("/")}
          className="flex items-center space-x-1 text-gray-300 hover:text-white"
        >
          <FaSignOutAlt />
          <span className="text-sm">Logout</span>
        </button>
      </div>
      <hr className="border-gray-700 mb-6" />
    </>
  );
};

export default TopBar;
