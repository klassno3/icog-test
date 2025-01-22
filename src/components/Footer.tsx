import Link from "next/link";
import React from "react";
import Logo from "../../public/footer logo.svg";
import Image from "next/image";
const Footer = () => {
  return (
    <footer className="w-full text-sm md:text-sm font-light bg-black py-3 md:py-5  text-white font-barlow">
      {" "}
      <div className="max-w-[1440px] w-11/12 mx-auto">
        <Link href="/">
          <Image src={Logo} alt="Logo" className="w-24 md:w-32" />
        </Link>
        <div className="flex flex-col gap-2 md:flex-row justify-between items-start md:gap-3 md:items-center mt-3 md:mt-5 text-sm md:text-base">
          <div className="flex flex-col md:flex-row gap-2 md:gap-5  ">
            <Link
              href="/signup"
              className="hover:text-secondary transition-all duration-500"
            >
              Signup
            </Link>
            <Link
              href="/dashboard"
              className="hover:text-secondary transition-all duration-500"
            >
              Dashboard
            </Link>
            <Link
              href="/sharedLease"
              className="hover:text-secondary transition-all duration-500"
            >
              Shared Lease
            </Link>
          </div>
          <div className="flex flex-col md:flex-row gap-2 md:gap-5  ">
            <Link
              href="/"
              className="hover:text-secondary transition-all duration-500"
            >
              Terms
            </Link>
            <Link
              href="/"
              className="hover:text-secondary transition-all duration-500"
            >
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
