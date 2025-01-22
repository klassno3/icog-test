"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteLeaseById } from "@/actions/leaseActions";
import Button from "@/components/Button";
import Link from "next/link";
import { FaTrashAlt } from "react-icons/fa";
import ModalParent from "@/components/ModalParent";
import toast from "react-hot-toast";
import Loading from "@/components/Loading";
import Error from "@/components/Error";
import axios from "axios";
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
export default function Dashboard() {
  const queryClient = useQueryClient();

  const fetchLeases = async () => {
    const response = await axios.get("/api/leases");
    return response.data;
  };

  const {
    data: leases,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["leases"],
    queryFn: fetchLeases,
  });

  // Mutation for deleting lease
  const deleteMutation = useMutation({
    mutationFn: async (leaseId: number) => {
      await deleteLeaseById(leaseId);
    },
    onSuccess: () => {
      toast.success("Deleted lease");
      queryClient.invalidateQueries({ queryKey: ["leases"] });
    },
    onError: () => {
      toast.error("Error deleting lease try again");
    },
  });
  if (isLoading) {
    return (
      <div className="h-screen">
        <Loading />
      </div>
    );
  }

  if (isError) return <Error />;
  function formatDateForTable(dateString: Date) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  const handleDelete = (leaseId: number) => {
    deleteMutation.mutate(leaseId);
  };

  return (
    <div className="py-10 md:py-20 flex flex-col gap-7 md:gap-10 text-black font-barlow">
      <div className="flex justify-between items-center">
        <h1 className="text-lg md:text-xl font-bold">Your Lease Agreements</h1>
        <Link href="/">
          <Button type="submit" variant="secondary" size="sm">
            Add New Lease
          </Button>
        </Link>
      </div>
      {leases?.length === 0 ? (
        <div className="py-10 text-lg lg:text-2xl font-semibold mx-auto">
          You have no leases so far!!
        </div>
      ) : (
        <div className="overflow-x-auto table-scrollbar">
          <table className="text-xs lg:text-sm table-auto w-[850px] lg:w-full text-black rounded-4xl  capitalize align">
            <thead className="bg-primary/20">
              <tr className="text-center">
                <th className="py-3 px-2">No</th>
                <th>Start Date</th>
                <th>end Date</th>
                <th>lease Type</th>
                <th>total Maintenance</th>
                <th>total Rent</th>
                <th>total Cost</th>
                <th>annual Increase</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {leases?.map((lease: leaseType, index: number) => (
                <tr
                  key={lease.id}
                  className={`py-3 text-center ${
                    index % 2 !== 0 ? "bg-primary/5" : ""
                  }`}
                >
                  <td className="py-3 px-2">{index + 1}</td>
                  <td>{formatDateForTable(lease.startDate)}</td>
                  <td>{formatDateForTable(lease.endDate)}</td>
                  <td>{lease.leaseType}</td>
                  <td>${lease.totalMaintenance}</td>
                  <td>${lease.totalRent}</td>
                  <td>${lease.totalCost}</td>
                  <td>${lease.annualIncrease.toFixed(2)}</td>
                  <td className=" text-black">
                    <div className="flex gap-4">
                      <ModalParent lease={lease} type="edit" />
                      <FaTrashAlt
                        onClick={() => handleDelete(lease.id)}
                        className="cursor-pointer transition-all duration-300 hover:text-red-400"
                      />
                      <ModalParent lease={lease} type="share" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
