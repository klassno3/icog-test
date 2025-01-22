"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Input from "./Input";
import React from "react";
import Button from "./Button";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { shareLeaseAction } from "@/actions/leaseActions";
import toast from "react-hot-toast";
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
export const shareSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email("Invalid email."),
});
type leaseFormData = z.infer<typeof shareSchema>;
const ShareForm = ({ lease }: ModalParentProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<leaseFormData>({
    resolver: zodResolver(shareSchema),
  });

  const mutation = useMutation({
    mutationFn: async (data: leaseFormData) => {
      return shareLeaseAction({
        leaseId: lease.id,
        receiverEmail: data.email,
        sharedByEmail: lease.userEmail || "",
      });
    },
    onSuccess: (res) => {
      if (res.success) {
        toast.success("Lease shared successfully");
      } else {
        toast.error(res.error);
      }
    },
  });

  const onSubmit = (data: leaseFormData) => {
    mutation.mutate(data);
  };
  return (
    <div className="p-4 md:p-12 flex flex-col gap-4  text-black">
      <h3 className="text-2xl font-barlow font-semibold">Share Lease</h3>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-1/2"
      >
        <Input
          type="email"
          label="Email"
          placeHolder="example@gmail.com"
          register={register("email")}
          error={errors.email}
          required={true}
          name="email"
        />
        <Button type="submit" variant="secondary" size="md">
          {mutation.isPending ? "Sharing..." : "Share Lease"}
        </Button>
      </form>
    </div>
  );
};

export default ShareForm;
