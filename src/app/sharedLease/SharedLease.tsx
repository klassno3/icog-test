"use client";
import {
  fetchLeasesSharedByMe,
  fetchLeasesSharedWithMe,
} from "@/actions/leaseActions";
import Error from "@/components/Error";
import Loading from "@/components/Loading";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";

const SharedLease = () => {
  const [showMyLeases, setShowMyLeases] = useState("leasesSharedWithMe");
  const {
    data: leases,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["sharedLeases", showMyLeases],
    queryFn:
      showMyLeases === "leasesSharedWithMe"
        ? fetchLeasesSharedWithMe
        : fetchLeasesSharedByMe,
  });

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
  return (
    <div className="py-10 max-w-[1440px] mx-auto min-h-screen md:py-20 flex flex-col gap-7 md:gap-10 text-black font-barlow">
      <div className="flex justify-between items-center">
        <h1 className="text-lg md:text-xl font-bold">Shared Leases</h1>
      </div>
      <div className="flex gap-14 items-center text-sm md:text-base">
        <button
          onClick={() => setShowMyLeases("leasesSharedWithMe")}
          className={`py-1 ${
            showMyLeases === "leasesSharedWithMe" &&
            "font-semibold border-b-2 text-primary border-primary"
          }`}
        >
          Lease Shared with Me
        </button>
        <button
          onClick={() => setShowMyLeases("leasesSharedByMe")}
          className={`py-1 ${
            showMyLeases !== "leasesSharedWithMe" &&
            "font-semibold border-b-2 text-primary border-primary"
          }`}
        >
          Lease Shared by Me
        </button>
      </div>

      <div className="">
        {leases?.length === 0 ? (
          <div className="py-10 text-base lg:text-2xl mx-auto">
            You have no shared leases so far!!
          </div>
        ) : isLoading ? (
          <div className="py-10">
            <Loading />
          </div>
        ) : (
          <div className="overflow-x-auto table-scrollbar">
            <table className="text-xs lg:text-sm table-auto w-[850px] lg:w-full text-black rounded-4xl  capitalize align">
              <thead className="bg-primary/20">
                <tr className="text-center">
                  <th className="py-3 px-2">No</th>
                  <th>
                    {showMyLeases === "leasesSharedWithMe"
                      ? "Shared By"
                      : "Shared To"}
                  </th>
                  <th>Start Date</th>
                  <th>end Date</th>
                  <th>lease Type</th>
                  <th>total Maintenance</th>
                  <th>total Rent</th>
                  <th>total Cost</th>
                  <th>annual Increase</th>
                </tr>
              </thead>
              <tbody>
                {leases?.map((lease, index) => (
                  <tr
                    key={lease.id}
                    className={`py-3 text-center ${
                      index % 2 !== 0 ? "bg-primary/5" : ""
                    }`}
                  >
                    <td className="py-3 px-2">{index + 1}</td>
                    <td className="py-3 px-2">
                      {showMyLeases === "leasesSharedWithMe"
                        ? lease.sharedBy.name
                        : lease.receiverEmail}
                    </td>
                    <td>{formatDateForTable(lease.lease.startDate)}</td>
                    <td>{formatDateForTable(lease.lease.endDate)}</td>
                    <td>{lease.lease.leaseType}</td>
                    <td>${lease.lease.totalMaintenance}</td>
                    <td>${lease.lease.totalRent}</td>
                    <td>${lease.lease.totalCost}</td>
                    <td>${lease.lease.annualIncrease.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SharedLease;
