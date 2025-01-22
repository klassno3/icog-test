"use client";
import React, { useEffect, useState } from "react";
import Dropdown from "./Dropdown";
import Radio from "./Radio";
import Input from "./Input";
import { leaseSchema } from "@/utils/leaseSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "./Button";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editLease } from "@/actions/leaseActions";
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
  userEmail: string | undefined;
  totalCost: number;
  totalRent: number;
  annualIncrease: number;
  totalMaintenance: number;
};

type ModalParentProps = {
  lease: leaseType;
};

const EditForm = ({ lease }: ModalParentProps) => {
  const queryClient = useQueryClient();

  // Mutation for deleting lease
  const editMutation = useMutation({
    mutationFn: async ({
      leaseId,
      data,
    }: {
      leaseId: number;
      data: leaseType;
    }) => {
      const response = await editLease({ leaseId, data });
      if (!response.success) throw new Error(response.message);
    },
    onSuccess: () => {
      toast.success("Lease updated");
      queryClient.invalidateQueries({ queryKey: ["leases"] });
    },
    onError: (error) => {
      toast.error("Error updating lease, please try again");
      console.error("Error updating lease:", error.message);
    },
  });
  const [totalCost, setTotalCost] = useState(0);
  const [totalRent, setTotalRent] = useState(0);
  const [annualIncrease, setAnnualIncrease] = useState(0);
  const [totalMaintenance, setTotalMaintenance] = useState(0);
  type leaseFormData = z.infer<typeof leaseSchema>;
  const {
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<leaseFormData>({
    resolver: zodResolver(leaseSchema),
    defaultValues: {
      startDate: dayjs(lease.startDate).format("YYYY-MM-DD"),
      endDate: dayjs(lease.endDate).format("YYYY-MM-DD"),
      monthRent: String(lease.monthRent),
      additionalCharges: String(lease.additionalCharges || ""),
      annualIncreasePercentage: String(lease.annualIncreasePercentage),
      latePaymentPenalty: String(lease.latePaymentPenalty || ""),
      leaseType: lease.leaseType as "residential" | "commercial",
      maintenanceFees: String(lease.maintenanceFees || ""),
      securityDeposit: String(lease.securityDeposit),
      utilities: lease.utilities as "yes" | "no" | undefined,
    },
  });
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
  const onSubmit = async (data: leaseFormData) => {
    const leaseData = {
      id: lease.id,
      endDate: new Date(data.endDate),
      startDate: new Date(data.startDate),
      monthRent: parseFloat(data.monthRent),
      additionalCharges: parseFloat(data.additionalCharges || "0"),
      annualIncreasePercentage: parseFloat(data.annualIncreasePercentage),
      latePaymentPenalty: parseFloat(data.latePaymentPenalty || "0"),
      leaseType: data.leaseType,
      maintenanceFees: parseFloat(data.maintenanceFees || "0"),
      securityDeposit: parseFloat(data.securityDeposit),
      utilities: data.utilities,
      userEmail: lease?.userEmail || "",
      totalCost,
      totalRent,
      annualIncrease,
      totalMaintenance,
    };
    editMutation.mutate({
      leaseId: lease.id, // lease.id is the id of the lease you want to update
      data: leaseData,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-4 md:p-12 flex flex-col gap-5 font-barlow"
    >
      <h3 className="text-lg md:text-2xl font-barlow font-semibold">
        Edit Lease
      </h3>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 ">
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
      <Button type="submit" variant="secondary" size="md">
        {editMutation.isPending ? "Saving...." : "Save"}
      </Button>
    </form>
  );
};

export default EditForm;
