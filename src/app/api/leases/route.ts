import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Unauthorized: No email found in session" },
      { status: 401 }
    );
  }

  try {
    const leases = await prisma.lease.findMany({
      where: {
        userEmail: session.user.email,
      },
      select: {
        id: true,
        startDate: true,
        endDate: true,
        monthRent: true,
        annualIncreasePercentage: true,
        additionalCharges: true,
        latePaymentPenalty: true,
        maintenanceFees: true,
        securityDeposit: true,
        utilities: true,
        leaseType: true,
        totalRent: true,
        totalCost: true,
        totalMaintenance: true,
        userEmail: true,
        annualIncrease: true,
      },
    });
    return NextResponse.json(leases, { status: 200 });
  } catch (error) {
    console.error("Error fetching leases:", error);
    return NextResponse.json(
      { error: "Failed to fetch leases" },
      { status: 500 }
    );
  }
}
