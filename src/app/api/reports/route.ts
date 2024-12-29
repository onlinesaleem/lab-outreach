import { NextResponse } from "next/server";
import { prisma } from "../../../../prisma/db";
import formidable from "formidable";
import { Readable } from "stream";
import { IncomingMessage } from "http";
import { getServerSession } from "next-auth";

export const config = {
    api: {
      bodyParser: false, // Disable Next.js body parser to handle `form-data`
    },
  };
  
 // Convert a Next.js Request to Node.js Readable Stream
function toNodeReadable(req: Request): NodeJS.ReadableStream & { headers: Record<string, string> } {
    const reader = req.body?.getReader();
    if (!reader) throw new Error("Invalid request body");
  
    const stream = new Readable({
      async read() {
        const { done, value } = await reader.read();
        if (done) {
          this.push(null);
        } else {
          this.push(value);
        }
      },
    });
  
    return Object.assign(stream, { headers: Object.fromEntries(req.headers) });
  }
  
  // POST: Handle file upload and save report
  export async function POST(req: Request) {
    try {
      const nodeRequest = toNodeReadable(req);
  
      const form = formidable({
        multiples: false,
        uploadDir: "./public/uploads",
        keepExtensions: true,
      });
  
      const { fields, files } = await new Promise<{
        fields: formidable.Fields;
        files: formidable.Files;
      }>((resolve, reject) => {
        form.parse(nodeRequest as any, (err, fields, files) => {
          if (err) reject(err);
          resolve({ fields, files });
        });
      });
  
      const pdfFile = Array.isArray(files.pdfFile) ? files.pdfFile[0] : files.pdfFile;
      if (!pdfFile || !("newFilename" in pdfFile)) {
        return NextResponse.json({ error: "File upload failed." }, { status: 400 });
      }
  
      const {
        patientName,
        patientFileNumber,
        doctorName,
        testName,
        companyId,
        createdById,
      } = fields;
  
      if (!patientName || !patientFileNumber || !testName || !companyId || !createdById) {
        return NextResponse.json(
          { error: "Missing required fields in the request payload." },
          { status: 400 }
        );
      }
  
      const newReport = await prisma.report.create({
        data: {
          patientName: String(patientName),
          patientFileNumber: String(patientFileNumber),
          doctorName: doctorName ? String(doctorName) : null,
          testName: String(testName),
          pdfUrl: `/uploads/${pdfFile.newFilename}`,
          reportCreatedOn: new Date(),
          companyId: Number(companyId),
          createdById: Number(createdById),
        },
      });
  
      return NextResponse.json(newReport, { status: 201 });
    } catch (error) {
      console.error("Error saving report:", error);
      return NextResponse.json({ error: "Failed to save report." }, { status: 500 });
    }
  }

// GET: Fetch all reports with filtering
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10); // Current page
  const limit = parseInt(searchParams.get("limit") || "10", 10); // Items per page
  const skip = (page - 1) * limit; // Offset for Prisma's `findMany`

  // Extract search and filter parameters
  const patientSearch = searchParams.get("search") || ""; // Patient name or file number
  const companyName = searchParams.get("company") || ""; // Company name filter
  const testName = searchParams.get("test") || ""; // Test name filter

  try {
    // Define the where clause for search and filter conditions
    const whereClause: any = {
      AND: [
        patientSearch
          ? {
              OR: [
                { patientName: { contains: patientSearch, mode: "insensitive" } },
                { patientFileNumber: { contains: patientSearch, mode: "insensitive" } },
              ],
            }
          : {},
        companyName
          ? { company: { name: { contains: companyName, mode: "insensitive" } } }
          : {},
        testName
          ? { testName: { contains: testName, mode: "insensitive" } }
          : {},
      ],
    };

    // Fetch total count for pagination
    const totalReports = await prisma.report.count({
      where: whereClause,
    });

    // Fetch filtered and paginated reports
    const reports = await prisma.report.findMany({
      where: whereClause,
      skip,
      take: limit,
      include: {
        company: true, // Include company details
        createdBy: true, // Include report creator details
        updatedBy: true, // Include report updater details
      },
      orderBy: {
        reportCreatedOn: "desc", // Order by report creation date
      },
    });

    return NextResponse.json({ reports, totalReports }, { status: 200 });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 }
    );
  }
}


  export async function DELETE(req: Request) {
    try {
      const { id } = await req.json();
  
      if (!id) {
        return NextResponse.json({ error: "Report ID is required" }, { status: 400 });
      }
  
      const reportExists = await prisma.report.findUnique({
        where: { id },
      });
  
      if (!reportExists) {
        return NextResponse.json({ error: "Report not found" }, { status: 404 });
      }
  
      await prisma.report.delete({
        where: { id },
      });
  
      return NextResponse.json({ message: "Report deleted successfully" }, { status: 200 });
    } catch (error) {
      console.error("Error deleting report:", error);
      return NextResponse.json({ error: "Failed to delete report" }, { status: 500 });
    }
  }

  

