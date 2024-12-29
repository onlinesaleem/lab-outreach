import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../../prisma/db";
import { NextResponse } from "next/server";

// GET: Fetch all companies
export async function GET() {
  try {
    const companies = await prisma.company.findMany({
      include: {
        users: true,
      },
    });
    return NextResponse.json(companies);
  } catch (error) {
    console.error("Error fetching companies:", error);
    return NextResponse.json({ error: "Failed to fetch companies." }, { status: 500 });
  }
}

// POST: Create a new company
export async function POST(req: Request) {
  try {
    const { name, assignedUserId } = await req.json();
    const company = await prisma.company.create({
      data: {
        name,
        users: assignedUserId
          ? {
              connect: { id: assignedUserId },
            }
          : undefined,
      },
    });
    return NextResponse.json(company);
  } catch (error) {
    console.error("Error creating company:", error);
    return NextResponse.json({ error: "Failed to create company." }, { status: 500 });
  }
}

// PUT: Update an existing company
export async function PUT(req: Request) {
  try {
    const { id, name, assignedUserId } = await req.json();

    const company = await prisma.company.update({
      where: { id },
      data: {
        name,
        users: assignedUserId
          ? {
              connect: { id: assignedUserId },
            }
          : undefined
      },
    });
    return NextResponse.json(company);
  } catch (error) {
    console.error("Error updating company:", error);
    return NextResponse.json({ error: "Failed to update company." }, { status: 500 });
  }
}

// DELETE: Delete a company
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Company ID is required." }, { status: 400 });
    }

    await prisma.company.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Company deleted successfully." });
  } catch (error) {
    console.error("Error deleting company:", error);
    return NextResponse.json({ error: "Failed to delete company." }, { status: 500 });
  }
}
