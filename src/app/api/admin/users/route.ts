
import { NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/db";
import bcrypt from "bcrypt";
// GET: Fetch all users
export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

// POST: Add or edit a user
export async function POST(req: Request) {
  try {
    const { id, name, email, password, role } = await req.json();
    if (id) {
      // Edit user
      await prisma.user.update({
        where: { id },
        data: { name, email, role },
      });
      return NextResponse.json({ message: "User updated successfully!" });
    } else {
      // Add user
      const hashedPassword = await bcrypt.hash(password, 10);
      await prisma.user.create({
        data: { name, email, password: hashedPassword, role },
      });
      return NextResponse.json({ message: "User created successfully!" });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to save user." }, { status: 500 });
  }
}
