"use client";

import React, { useContext } from "react";
import Link from "next/link";
import { UserContext } from "../utils/UserProvider";
import { useRouter } from "next/navigation";

const Header = () => {
  const { user, setUser } = useContext(UserContext);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login");
  };

  return (
    <div className="rounded-lg">
      <header className=" rounded-lg m-3 flex justify-between items-center p-3 px-5 bg-richblack-300 text-white border-b-2 border-opacity-35 border-richblack">
        <Link href="/dashboard">
          <h1 className="text-xl hover:underline">Todo List App</h1>
        </Link>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link href="/settings">
                <div className="bg-gray-800 text-white p-2 rounded-md border border-white-500 hover:underline">
                  <p>Welcome, {user.name}</p>
                </div>
              </Link>
              <div
                onClick={handleLogout}
                className="bg-gray-800 text-white p-2 rounded-md border border-white-500 hover:underline cursor-pointer"
              >
                <p>Logout</p>
              </div>
            </>
          ) : (
            <div className="bg-gray-900 text-white p-2 rounded-md">
              <Link href="/login" passHref>
                <p className="hover:underline">Login</p>
              </Link>
            </div>
          )}
        </div>
      </header>
      {/* Your content goes here */}
    </div>
  );
};

export default Header;
