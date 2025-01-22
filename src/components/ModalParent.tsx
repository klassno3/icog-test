import React, { useState } from "react";
import Modal from "./Modal";
import EditForm from "./EditForm";
import { FaEdit, FaShareAlt } from "react-icons/fa";
import ShareForm from "./ShareForm";
type leaseType = {
  id: number;
  endDate: Date;
  startDate: Date;
  monthRent: number;
  additionalCharges?: number | null;
  annualIncreasePercentage: number;
  latePaymentPenalty?: number | null;
  leaseType: string;
  maintenanceFees?: number | null;
  securityDeposit: number;
  utilities: string;
  userEmail: string;
  totalCost: number;
  totalRent: number;
  annualIncrease: number;
  totalMaintenance: number;
};

type ModalParentProps = {
  lease: leaseType;
  type: "edit" | "share";
};

const ModalParent = ({ lease, type }: ModalParentProps) => {
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    setShowModal(true); // Show the modal
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const actionBar = (
    <div>
      <button
        onClick={handleClose}
        className="text-2xl pr-5 pt-3 text-black font-barlow hover:text-red-400 transition-all duration-200"
      >
        x
      </button>
    </div>
  );

  const modal = (
    <Modal onClose={handleClose} actionBar={actionBar}>
      {type === "edit" ? (
        <EditForm lease={lease} />
      ) : (
        <ShareForm lease={lease} />
      )}
    </Modal>
  );

  return (
    <div>
      {type === "share" ? (
        <FaShareAlt
          className="cursor-pointer 
         transition-all duration-300 hover:text-blue-400"
          onClick={handleClick}
        />
      ) : (
        <FaEdit
          className="cursor-pointer  transition-all duration-300 hover:text-green-400"
          onClick={handleClick}
        />
      )}
      {showModal && modal}
    </div>
  );
};

export default ModalParent;
