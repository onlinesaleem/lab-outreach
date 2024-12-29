"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

const Navbar = () => {
  const { data: session } = useSession();

  if (!session || !session.user) return null;

  const { role } = session.user;

  return (
    <nav className="bg-blue-600 p-4 text-white shadow-md">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <h1 className="text-lg font-bold">Lab Report System</h1>
        <ul className="flex gap-4">
          {/* Common Links */}
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/auth/change-password">Change Password</Link>
          </li>
          <li>
            <button onClick={() => signOut()} className="hover:underline">
              Sign Out
            </button>
          </li>

          {/* Role-Based Links */}
          {role === "admin" && (
            <>
              <li>
                <Link href="/admin/dashboard">Admin Dashboard</Link>
              </li>
              <li>
                <Link href="/admin/manage-users">Manage Users</Link>
              </li>
            </>
          )}
          {(role === "admin" || role === "lab_manager") && (
            <li>
              <Link href="/lab/view-reports">Lab Reports</Link>
            </li>
          )}
          {role === "company_user" && (
            <li>
              <Link href="/company/view-reports">My Reports</Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
