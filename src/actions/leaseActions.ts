"use server";

import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
type leaseType = {
  endDate: string;
  startDate: string;
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
type editLeaseType = {
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
function logError(error: Error) {
  if (process.env.NODE_ENV !== "production") {
    console.error(error.message);
  } else {
    throw new Error("Something went wrong.");
  }
}

export async function saveLeaseInformation(leaseData: leaseType) {
  try {
    const lease = await prisma.lease.create({
      data: {
        startDate: new Date(leaseData.startDate).toISOString(),
        endDate: new Date(leaseData.endDate).toISOString(),
        monthRent: leaseData.monthRent,
        securityDeposit: leaseData.securityDeposit,
        annualIncreasePercentage: leaseData.annualIncreasePercentage,
        maintenanceFees: leaseData.maintenanceFees,
        utilities: leaseData.utilities,
        latePaymentPenalty: leaseData.latePaymentPenalty,
        additionalCharges: leaseData.additionalCharges,
        leaseType: leaseData.leaseType,
        totalRent: leaseData.totalRent,
        totalCost: leaseData.totalCost,
        totalMaintenance: leaseData.totalMaintenance,
        annualIncrease: leaseData.annualIncrease,
        userEmail: leaseData.userEmail,
      },
    });
    return lease;
  } catch (error) {
    if (error instanceof Error) {
      logError(error);
    }
    throw new Error("Error saving lease information");
  }
}

export async function deleteLeaseById(leaseId: number) {
  const session = await getServerSession();
  try {
    await prisma.sharedLease.deleteMany({
      where: { leaseId },
    });

    // Find the lease and check if it belongs to the logged-in user
    const lease = await prisma.lease.findUnique({
      where: { id: leaseId },
    });

    if (!lease) {
      throw new Error("Lease not found");
    }

    // Ensure the lease belongs to the logged-in user
    if (!session?.user || lease.userEmail !== session.user.email) {
      throw new Error("You are not authorized to delete this lease");
    }

    // Delete the lease
    await prisma.lease.delete({
      where: { id: leaseId },
    });

    return { success: true, message: "Lease deleted successfully" };
  } catch (error) {
    if (error instanceof Error) {
      logError(error);
    }

    return { success: false, message: (error as Error)?.message };
  }
}
export async function editLease(leaseData: {
  leaseId: number;
  data: editLeaseType;
}) {
  const { leaseId, data } = leaseData;
  const session = await getServerSession();

  try {
    const lease = await prisma.lease.findUnique({
      where: { id: leaseId },
    });

    if (!lease) {
      throw new Error("Lease not found");
    }

    if (lease.userEmail !== session?.user?.email) {
      throw new Error("You can only edit your own lease");
    }

    const updatedLease = await prisma.lease.update({
      where: { id: leaseId },
      data: {
        ...data,
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
      },
    });

    return { success: true, updatedLease };
  } catch (error: unknown) {
    if (error instanceof Error) {
      logError(error);
      return { success: false, message: error.message || "An error occurred" };
    }
    return { success: false, message: "An unknown error occurred" };
  }
}

export async function shareLeaseAction(sharedLeaseData: {
  leaseId: number;
  receiverEmail: string;
  sharedByEmail: string;
}) {
  try {
    // Validate input data
    const { leaseId, receiverEmail, sharedByEmail } = sharedLeaseData;

    // Save the shared lease record in the database
    await prisma.sharedLease.create({
      data: {
        leaseId,
        receiverEmail,
        sharedByEmail,
      },
    });

    return { success: true, message: "Lease shared successfully!" };
  } catch (error) {
    if (error instanceof Error) {
      logError(error);
    }
    return { success: false, error: "Invalid data or failed to share lease." };
  }
}

export async function fetchLeasesSharedWithMe() {
  try {
    const session = await getServerSession();

    if (!session || !session.user?.email) {
      throw new Error("User not authenticated.");
    }

    const sharedLeases = await prisma.sharedLease.findMany({
      where: {
        receiverEmail: session.user.email,
      },
      include: {
        lease: {
          select: {
            id: true,
            startDate: true,
            endDate: true,
            monthRent: false,
            securityDeposit: false,
            annualIncreasePercentage: false,
            maintenanceFees: false,
            utilities: false,
            latePaymentPenalty: false,
            additionalCharges: false,
            leaseType: true,
            totalRent: true,
            totalCost: true,
            totalMaintenance: true,
            annualIncrease: true,
            userEmail: false,
            createdAt: false,
          },
        },
        sharedBy: {
          select: {
            id: false,
            name: true,
            email: false,
            createdAt: false,
          },
        },
      },
    });

    return sharedLeases;
  } catch (error) {
    if (error instanceof Error) {
      logError(error);
    }

    return [];
  }
}
export async function fetchLeasesSharedByMe() {
  try {
    const session = await getServerSession();

    if (!session || !session.user?.email) {
      throw new Error("User not authenticated.");
    }

    const sharedLeases = await prisma.sharedLease.findMany({
      where: {
        sharedByEmail: session.user.email,
      },
      include: {
        lease: {
          select: {
            id: true,
            startDate: true,
            endDate: true,
            monthRent: false,
            securityDeposit: false,
            annualIncreasePercentage: false,
            maintenanceFees: false,
            utilities: false,
            latePaymentPenalty: false,
            additionalCharges: false,
            leaseType: true,
            totalRent: true,
            totalCost: true,
            totalMaintenance: true,
            annualIncrease: true,
            userEmail: false,
            createdAt: false,
          },
        },
        sharedBy: {
          select: {
            id: false,
            name: true,
            email: false,
            createdAt: false,
          },
        },
      },
    });

    return sharedLeases;
  } catch (error) {
    if (error instanceof Error) {
      logError(error);
    }

    return [];
  }
}
