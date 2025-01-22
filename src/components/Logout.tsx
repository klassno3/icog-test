import { signOut } from "next-auth/react";
import React from "react";
import toast from "react-hot-toast";
const Logout = () => {
  const handleLogout = () => {
    signOut();
    toast.success("Logout successfully");
  };
  return (
    <div onClick={handleLogout} className="text-sm md:text-base cursor-pointer">
      Logout
    </div>
  );
};

export default Logout;
