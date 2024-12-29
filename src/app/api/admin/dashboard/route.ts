import { NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/db";

export async function GET() {
  try {
    const totalUsers = await prisma.user.count();
    const totalReports = await prisma.report.count();
    const totalCompanies = await prisma.company.count();

    const recentReports = await prisma.report.findMany({
      take: 5,
      orderBy: { reportCreatedOn: "desc" },
      select: {
        id: true,
        patientName: true,
        testName: true,
        reportCreatedOn: true,
      },
    });

    return NextResponse.json({
      totalUsers,
      totalReports,
      totalCompanies,
      recentReports,
    });
  } catch (error) {
    console.error("Error fetching admin dashboard data:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard data." }, { status: 500 });
  }
}
