"use client";

import { useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";

export default function RoleRedirect() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      const role = session.user.role;
      if (role === "admin") router.push("/admin/dashboard");
      else if (role === "lab_manager") router.push("/lab/upload-reports");
      else if (role === "company_user") router.push("/company/view-reports");
    }
  }, [session, router]);

  if (!session) return <button onClick={() => signIn()} className="bg-blue-500 text-white py-2 px-4 rounded">Sign In</button>;
  return null;
}
