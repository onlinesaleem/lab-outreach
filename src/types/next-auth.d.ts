import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    id: number; // Explicitly set as number
    role: string;
    name:string;
    email:string;

    companyId: number | null; // Allow companyId to be nullable
    image: string | null; // Allow image to be nullable
  }

  interface Session {
    user: {
      id: number;
      name:string;
    email:string;
      role: string;
      companyId: number | null;
      image: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: {
      id: number;
      name:string;
    email:string;
      role: string;
      companyId: number | null;
      image: string | null;
    };
  }
}
