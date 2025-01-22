"use client";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "@/app/globals.css";
interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
  actionBar: React.ReactNode;
}

const Modal = ({ onClose, children, actionBar }: ModalProps) => {
  const [modalContainer, setModalContainer] = useState<HTMLElement | null>(
    null
  );

  useEffect(() => {
    // Use type assertion to inform TypeScript
    const container = document.querySelector(
      ".modal-container"
    ) as HTMLElement | null;
    setModalContainer(container);

    document.body.classList.add("overflow");
    return () => {
      document.body.classList.remove("overflow");
    };
  }, []);

  if (!modalContainer) return null;
  return ReactDOM.createPortal(
    <div>
      <div
        onClick={onClose}
        className="fixed font-barlow  z-[1000] py-28 bg-black/70 from-accentPurple-dark/95 to-accentBlue-dark/95 top-0 left-0 right-0 bottom-0 "
      ></div>
      <div className="fixed z-[2000] bg-white overflow-y-scroll w-[22rem] sm:w-[30rem] md:w-3/4 h-[33rem] top-[50%] left-[50%] right-[40%] bottom-[50%] -translate-y-1/2 -translate-x-1/2 rounded-lg ">
        <div className="flex  justify-end pr-1 md:pr-3">{actionBar}</div>
        <div className="flex justify-center mx-auto ">
          <div className="w-full  ">{children}</div>
        </div>
      </div>
    </div>,
    modalContainer
  );
};

export default Modal;
