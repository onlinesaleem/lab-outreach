import { NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/db";

export async function GET() {
  try {
    // Fetch total reports count
    const totalReports = await prisma.report.count();

    // Fetch report count grouped by company
    const companyReports = await prisma.report.groupBy({
      by: ["companyId"],
      _count: {
        companyId: true, // Count reports grouped by company ID
      },
      orderBy: {
        _count: {
          companyId: "desc", // Order by the count of companyId descending
        },
      },
    });

    // Fetch company names for the grouped company IDs
    const companyNames = await Promise.all(
      companyReports.map(async (company) => {
        const companyInfo = await prisma.company.findUnique({
          where: { id: company.companyId },
          select: { name: true },
        });
        return {
          companyName: companyInfo?.name || "Unknown Company",
          reportCount: company._count.companyId,
        };
      })
    );

    return NextResponse.json({
      totalReports,
      companyReports: companyNames,
    });
  } catch (error) {
    console.error("Error fetching lab metrics:", error);
    return NextResponse.json({ error: "Failed to fetch metrics" }, { status: 500 });
  }
}
