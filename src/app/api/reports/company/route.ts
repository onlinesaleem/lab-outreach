//api/reports/company
import { NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/db";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10); // Current page
  const limit = parseInt(searchParams.get("limit") || "10", 10); // Items per page
  const skip = (page - 1) * limit;

  try {
    const nextRequest = new NextRequest(req);
    const token = await getToken({ req: nextRequest });
    if (!token || !token.user || token.user.role !== "company_user") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const companyId = token.user.companyId;
    if (!companyId) {
      return NextResponse.json({ error: "Missing company ID" }, { status: 400 });
    }

    // Extract filters
    const search = searchParams.get("search") || "";
    const testName = searchParams.get("testName") || "";

    // Define filter conditions
    const whereClause: any = {
      companyId,
      AND: [
        search
          ? {
              OR: [
                { patientName: { contains: search, mode: "insensitive" } },
                { patientFileNumber: { contains: search, mode: "insensitive" } },
              ],
            }
          : {},
        testName ? { testName: { contains: testName, mode: "insensitive" } } : {},
      ],
    };

    // Fetch reports
    const totalReports = await prisma.report.count({ where: whereClause });
    const reports = await prisma.report.findMany({
      skip,
      take: limit,
      where: whereClause,
      include: {
        company: true,
        createdBy: true,
      },
    });

    return NextResponse.json({ reports, totalReports }, { status: 200 });
  } catch (error) {
    console.error("Error fetching company reports:", error);
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
  }
}
