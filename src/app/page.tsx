import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";


export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  const { role } = session.user;

  if (role === "admin") {
    redirect("/admin/dashboard");
  } else if (role === "lab_manager") {
    redirect("/lab/dashboard");
  } else if (role === "company_user") {
    redirect("/company/dashboard");
  }

  return null;
}
