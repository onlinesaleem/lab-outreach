import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "../../../../prisma/db";

export async function GET(req: Request) {
  try {
    const session = await getServerSession();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role, companyId } = session.user;

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const whereClause: any = {};
    if (role === "company_user") {
      whereClause.companyId = companyId;
    }

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
    console.error("Error fetching reports:", error);
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
  }
}
