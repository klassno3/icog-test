// schemas/leaseSchema.ts

import { z } from "zod";

export const leaseSchema = z
  .object({
    startDate: z
      .string()
      .date()
      .min(1, { message: "Start date is required and cannot be empty" }),
    endDate: z
      .string()
      .date()
      .min(1, { message: "End date is required and cannot be empty" }),

    monthRent: z
      .string()
      .regex(/^\d+(\.\d+)?$/, {
        message: "Please enter a valid number.",
      })
      .min(1, { message: "Monthly Rent is required and cannot be empty" }),
    securityDeposit: z
      .string()
      .regex(/^\d+(\.\d+)?$/, {
        message: "Please enter a valid number.",
      })
      .min(1, {
        message: "Security deposit is required and cannot be empty",
      }),
    annualIncreasePercentage: z
      .string()
      .regex(/^\d+(\.\d+)?$/, {
        message: "Please enter a valid number.",
      })
      .min(1, {
        message:
          "Annual rent increase percentage is required and cannot be empty",
      }),
    maintenanceFees: z
      .union([
        z.string().regex(/^\d+(\.\d+)?$/, {
          message: "Please enter a valid number.",
        }),
        z.literal(""),
      ])
      .optional(),

    latePaymentPenalty: z
      .union([
        z.string().regex(/^\d+(\.\d+)?$/, {
          message: "Please enter a valid number.",
        }),
        z.literal(""),
      ])
      .optional(),

    additionalCharges: z
      .union([
        z.string().regex(/^\d+(\.\d+)?$/, {
          message: "Please enter a valid number.",
        }),
        z.literal(""),
      ])
      .optional(),
    utilities: z.enum(["yes", "no"], {
      errorMap: () => ({
        message: "Please select a valid option for utilities",
      }),
    }),
    leaseType: z.enum(["residential", "commercial"], {
      errorMap: () => ({
        message: "Please select a valid option for Lease Type",
      }),
    }),
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return end >= start;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"], // Specify which field the error message should be associated with
    }
  );
