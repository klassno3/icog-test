"use client";
import React, { useEffect, useRef, useState, RefObject } from "react";
import Link from "next/link";
import Logout from "./Logout";

type Datatype = {
  name: string;
  pathname: string;
};

// Define the types for user data and the context
interface User {
  name: string | null | undefined;
  email: string | null | undefined;
}

type NavItem = {
  data: Datatype[];
  user?: User;
};

const NavDropDown = ({ data, user }: NavItem) => {
  const [showList, setShowList] = useState(false);
  const divEl = useRef<HTMLDivElement>(null) as RefObject<HTMLDivElement>;

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!divEl.current) {
        return;
      }
      if (!divEl.current.contains(event.target as Node)) {
        setShowList(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  });

  return (
    <div ref={divEl} className="font-barlow relative">
      <div className="flex gap-2 text-primaryColor-200 items-end justify-end ">
        <div
          onClick={() => setShowList(!showList)}
          className="bg-[#f1dff8]  cursor-pointer text-sm md:text-base flex justify-center uppercase items-center text-black w-10 h-10 md:w-12 md:h-12 rounded-full "
        >
          {user?.name?.substring(0, 2)}
        </div>
      </div>
      <div
        id="dropdown"
        className={`z-[50] w-[12rem] absolute top-full right-0 bg-white text-black mt-1 rounded shadow-md  ${
          showList ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <ul
          className="text-sm text-center max-h-[15rem] overflow-y-auto"
          aria-labelledby="dropdownDefaultButton"
        >
          {data.map((item, idx) => {
            if (item.name !== "logout") {
              return (
                <Link href={`${item.pathname}`} key={idx}>
                  <li>
                    <p
                      onClick={() => setShowList(false)}
                      className="hover:text-primary capitalize py-2.5 text-sm md:text-base relative cursor-pointer z-10 transition-all duration-300 hover:bg-[#f1dff8]/40 "
                    >
                      {item.name}
                    </p>
                  </li>
                </Link>
              );
            } else {
              return (
                <div
                  key={idx}
                  className="transition-all hover:text-primary py-2.5 duration-300 hover:bg-[#f1dff8]/40 "
                >
                  <Logout />
                </div>
              );
            }
          })}
        </ul>
      </div>
    </div>
  );
};

export default NavDropDown;
