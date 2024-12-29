import { NextResponse } from "next/server";
import formidable from "formidable";
import { prisma } from "../../../../../prisma/db";
import { Readable } from "stream";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";


export const config = {
  api: {
    bodyParser: false, // Disable body parsing for file uploads
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

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const loggedInUserId = session.user.id; // Extract logged-in user's ID

    const idParam = await params.id;
    const id = parseInt(idParam, 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid report ID." }, { status: 400 });
    }

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

    const { patientName, patientFileNumber, doctorName, testName, companyId } = fields;

    const reportExists = await prisma.report.findUnique({
      where: { id },
    });

    if (!reportExists) {
      return NextResponse.json({ error: "Report not found." }, { status: 404 });
    }

    const updatedData: any = {
      patientName: String(patientName),
      patientFileNumber: String(patientFileNumber),
      doctorName: doctorName ? String(doctorName) : null,
      testName: String(testName),
      reportModifiedOn: new Date(),
      companyId: Number(companyId),
      updatedById: loggedInUserId, // Use logged-in user's ID
    };

    if (pdfFile && "newFilename" in pdfFile) {
      updatedData.pdfUrl = `/uploads/${pdfFile.newFilename}`;
    }

    const updatedReport = await prisma.report.update({
      where: { id },
      data: updatedData,
    });

    return NextResponse.json(updatedReport, { status: 200 });
  } catch (error) {
    console.error("Error updating report:", error);
    return NextResponse.json({ error: "Failed to update report." }, { status: 500 });
  }
}
