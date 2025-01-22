"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "./Input";
import Button from "./Button";
import Radio from "./Radio";
import Dropdown from "./Dropdown";
import { leaseSchema } from "@/utils/leaseSchema";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { saveLeaseInformation } from "@/actions/leaseActions";
import { useSession } from "next-auth/react";
import Loading from "./Loading";

export default function LeaseForm() {
  type leaseFormData = z.infer<typeof leaseSchema>;
  const {
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<leaseFormData>({
    resolver: zodResolver(leaseSchema),
  });
  const { mutate: saveLease, status } = useMutation({
    mutationFn: saveLeaseInformation,
    onSuccess: () => {
      toast.success("Lease information saved successfully!");
    },
    onError: (error: { message?: string }) => {
      console.log(error);
      toast.error(error?.message || "Error saving lease information");
    },
  });
  const { data: session } = useSession();

  const onSubmit = async (data: leaseFormData) => {
    if (!session) {
      return toast.error("You need to be logged in to save lease information");
    }
    const leaseData = {
      endDate: data.endDate,
      startDate: data.startDate,
      monthRent: parseFloat(data.monthRent),
      additionalCharges: parseFloat(data.additionalCharges || ""),
      annualIncreasePercentage: parseFloat(data.annualIncreasePercentage),
      latePaymentPenalty: parseFloat(data.latePaymentPenalty || ""),
      leaseType: data.leaseType,
      maintenanceFees: parseFloat(data.maintenanceFees || ""),
      securityDeposit: parseFloat(data.securityDeposit),
      utilities: data.utilities,
      userEmail: session?.user?.email || "",
      totalCost,
      totalRent,
      annualIncrease,
      totalMaintenance,
    };
    saveLease(leaseData);
  };
  const [isOpen, setIsOpen] = useState(false);
  const [totalCost, setTotalCost] = useState(0);
  const [months, setMonths] = useState(0);
  const [totalRent, setTotalRent] = useState(0);
  const [annualIncrease, setAnnualIncrease] = useState(0);
  const [totalMaintenance, setTotalMaintenance] = useState(0);

  // Watch form fields dynamically
  const watchFields = watch([
    "startDate",
    "endDate",
    "monthRent",
    "securityDeposit",
    "annualIncreasePercentage",
    "maintenanceFees",
    "additionalCharges",
    "utilities",
    "latePaymentPenalty",
  ]);

  // Function to calculate lease costs dynamically
  useEffect(() => {
    const [
      startDate,
      endDate,
      monthRent,
      securityDeposit,
      annualIncreasePercentage,
      maintenanceFees,
      additionalCharges,
      utilities,
      latePaymentPenalty,
    ] = watchFields;

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const months =
        (end.getFullYear() - start.getFullYear()) * 12 +
        (end.getMonth() - start.getMonth());
      setMonths(months);
      const monthlyRent = parseFloat(monthRent) || 0;
      const penalty = parseFloat(latePaymentPenalty ?? "") || 0;
      const deposit = parseFloat(securityDeposit) || 0;
      const increaseRate = parseFloat(annualIncreasePercentage) / 100 || 0;
      const maintenance = parseFloat(maintenanceFees ?? "") || 0;
      const charges = parseFloat(additionalCharges ?? "") || 0;

      const totalRent = monthlyRent * months;
      setTotalRent(totalRent);
      const annualIncrease = totalRent * increaseRate;
      setAnnualIncrease(annualIncrease);
      const totalMaintenance = maintenance * months;
      setTotalMaintenance(totalMaintenance);
      const utilityCost = utilities === "yes" ? 100 : 0;

      const calculatedCost =
        totalRent +
        deposit +
        charges +
        totalMaintenance +
        annualIncrease +
        penalty +
        utilityCost;
      setTotalCost(calculatedCost);
    } else {
      setTotalCost(0);
    }
  }, [watchFields]);
  return (
    <div className="pb-20 -translate-y-10 flex  flex-col lg:flex-row font-barlow justify-between items-start gap-20 lg:gap-14">
      <div className="w-full relative lg:w-[65%] flex flex-col gap-10  p-6 rounded-lg shadow-xl bg-white ">
        {status === "pending" && (
          <div className=" absolute top-0 left-0 rounded-lg bg-white/90 z-[100] w-full h-full">
            <Loading />
          </div>
        )}
        <h3 className="text-lg text-center md:text-2xl text-black font-semibold">
          Calculate Your Estimated Monthly Lease Payment
        </h3>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-10"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Input
              type="date"
              label="Lease start date:"
              placeHolder="10/12/24"
              register={register("startDate")}
              error={errors.startDate}
              required={true}
              name="startDate"
            />
            <Input
              type="date"
              label="Lease end date:"
              placeHolder="10/02/25"
              register={register("endDate")}
              error={errors.endDate}
              required={true}
              name="endDate"
            />

            <Input
              type="numeric"
              label="Monthly rent amount:"
              placeHolder="$1000"
              register={register("monthRent")}
              error={errors.monthRent}
              required={true}
              name="monthRent"
            />

            <Input
              type="numeric"
              label="Security deposit:"
              placeHolder="$400"
              register={register("securityDeposit")}
              error={errors.securityDeposit}
              required={true}
              name="securityDeposit"
            />
            <Input
              type="numeric"
              label="Annual Rent Increase Percentage:"
              placeHolder="4%"
              register={register("annualIncreasePercentage")}
              error={errors.annualIncreasePercentage}
              required={true}
              name="annualIncreasePercentage"
            />
            <Input
              type="numeric"
              label="Maintenance Fees:"
              placeHolder="$600"
              register={register("maintenanceFees")}
              error={errors.maintenanceFees}
              required={false}
              name="maintenanceFees"
            />
            <Input
              type="numeric"
              label="Late Payment Penalty:"
              placeHolder="$100"
              register={register("latePaymentPenalty")}
              error={errors.latePaymentPenalty}
              required={false}
              name="latePaymentPenalty"
            />
            <Input
              type="numeric"
              label="Additional Charges:"
              placeHolder="$100"
              register={register("additionalCharges")}
              error={errors.additionalCharges}
              required={false}
              name="additionalCharges"
            />
            <div className="flex flex-col gap-2.5">
              <div className="flex gap-1">
                <p className="">Utility Included:</p>
                <span className="text-red-400 text-xl">*</span>
              </div>
              <div className="flex flex-col gap-2.5">
                <div className="flex justify-between">
                  <Radio
                    label="Yes"
                    required={false}
                    type="radio"
                    value="yes"
                    name="utilities"
                    register={register("utilities")}
                    onChange={() => setValue("utilities", "yes")}
                    checked={watch("utilities") === "yes"}
                    clicked={watch("utilities")}
                  />

                  <Radio
                    label="No"
                    required={false}
                    type="radio"
                    value="no"
                    name="utilities"
                    register={register("utilities")}
                    onChange={() => setValue("utilities", "no")}
                    checked={watch("utilities") === "no"}
                    clicked={watch("utilities")}
                  />
                </div>
                <p
                  className={`transition-all duration-300  text-[13px] text-red-400/70 ${
                    errors.utilities
                      ? "translate-y-0 "
                      : "-z-10 opacity-0 -translate-y-1/2"
                  }`}
                >
                  {errors?.utilities?.message}
                </p>
              </div>
            </div>
            <Dropdown
              header="Lease Type:"
              label="Lease Type"
              data={[{ name: "residential" }, { name: "commercial" }]}
              required={true}
              onChange={(value: "residential" | "commercial") =>
                setValue("leaseType", value)
              }
              register={register("leaseType")}
              error={errors.leaseType} // Pass any error message from validation
            />
          </div>

          <Button type="submit" variant="primary" size="md">
            Save
          </Button>
        </form>
      </div>
      <div className="w-full flex flex-col text-black gap-5 md:gap-7 lg:w-[35%] bg-white pt-6 rounded-lg shadow-xl">
        <h3 className="text-lg text-center md:text-2xl  font-bold">
          Estimated Payment
        </h3>
        <div className="flex flex-col gap-2 md:gap-4">
          <div className="flex flex-col gap-1 items-center justify-center border-b-[.5px] pb-5 w-[90%] mx-auto border-gray-300/70">
            <span className="font-extrabold ">
              <span className="text-2xl md:text-3xl"> ${totalRent}</span>
            </span>
            <span className="text-sm md:text-base text-black/80 italic">
              for {months} months
            </span>
          </div>
          <div className="flex flex-col gap-3 md:gap-4">
            <p className="font-semibold text-lg md:text-xl border-b-[.5px] pb-3 md:pb-4 w-full px-6 mx-auto border-gray-300/70">
              Lease Summary
            </p>

            <div className="w-full  bg-white  rounded-lg shadow-xl">
              <div
                className={`flex justify-between px-6 pb-3 md:pb-5 items-center cursor-pointer ${
                  isOpen && "shadow-md"
                }`}
                onClick={() => setIsOpen(!isOpen)}
              >
                <div className="font-bold">
                  <h3 className="text-base md:text-lg">Total Cost</h3>
                </div>
                <div className="flex it gap-5">
                  <p className="font-bold">${totalCost}</p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-5 h-5 md:h-6 md:w-6 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              {isOpen && (
                <div className="flex text-sm md:text-base flex-col gap-2 px-10 py-5 transition-all duration-300">
                  <p className="flex  capitalize justify-between">
                    Total Rent <span className="">${totalRent}</span>
                  </p>
                  <p className="flex  capitalize justify-between">
                    Total maintenance{" "}
                    <span className="">${totalMaintenance}</span>
                  </p>
                  <p className="flex  capitalize justify-between">
                    Total annual Increase{" "}
                    <span className="">${annualIncrease.toFixed(2)}</span>
                  </p>
                  <p className="flex  capitalize justify-between">
                    Security Deposit{" "}
                    <span className="">${watch("securityDeposit") || 0}</span>
                  </p>
                  <p className="flex capitalize justify-between">
                    Additional charges Deposit{" "}
                    <span className="">${watch("additionalCharges") || 0}</span>
                  </p>
                  <p className="flex font- capitalize justify-between">
                    late payment Penalty{" "}
                    <span className="">
                      ${watch("latePaymentPenalty") || 0}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
