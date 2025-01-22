"use client";
import Image from "next/image";
import React from "react";
import Logo from "../../public/True Lease (1).svg";
import Link from "next/link";
import { useSession } from "next-auth/react";
import NavDropDown from "./NavDropdown";
const Navigation = () => {
  const { data: session } = useSession();
  return (
    <nav className="bg- flex justify-between items-center font-poppins py-2.5 md:py-3.5 w-11/12 mx-auto text-black/70 ">
      <Link href="/">
        <Image src={Logo} alt="Logo" className="w-24 md:w-40" />
      </Link>

      {session ? (
        <NavDropDown
          user={{
            name: session.user?.name || "",
            email: session.user?.email || "",
          }}
          data={[
            { name: "Home", pathname: "/" },
            { name: "Dashboared", pathname: "/dashboard" },
            { name: "Shared Lease", pathname: "/sharedLease" },
            { name: "logout", pathname: "/logout" },
          ]}
        />
      ) : (
        <Link
          className="hover:text-secondary transition-all duration-500"
          href="/signup"
        >
          Sign up
        </Link>
      )}
    </nav>
  );
};

export default Navigation;
