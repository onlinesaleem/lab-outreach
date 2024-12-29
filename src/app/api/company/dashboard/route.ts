import { NextRequest, NextResponse } from "next/server";

import { getToken } from "next-auth/jwt";
import { prisma } from "../../../../../prisma/db";

export async function GET(req: Request) {
  try {
      const nextRequest = new NextRequest(req);
        const token = await getToken({ req: nextRequest });
        if (!token || !token.user || token.user.role !== "company_user") {
          return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }
    
    if (!token || token.user.role !== "company_user") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const companyId = token.user.companyId;

   // Query total reports for the company
   const totalReports = await prisma.report.count({
    where: {
      companyId: Number(companyId), // Ensure companyId is a valid number
    },
  });

  // Fetch the recent reports
  const recentReports = await prisma.report.findMany({
    where: {
      companyId: Number(companyId),
    },
    take: 5,
    orderBy: { reportCreatedOn: "desc" },
  });


    return NextResponse.json({ totalReports, recentReports }, { status: 200 });
  } catch (error) {
    console.error("Error fetching company dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch company dashboard data" },
      { status: 500 }
    );
  }
}
