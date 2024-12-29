import { authOptions } from "@/lib/authOptions";
import NextAuth from "next-auth";
// Adjust the path if needed

export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);
