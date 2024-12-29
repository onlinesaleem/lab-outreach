"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Navigation() {
  const { data: session } = useSession();
  const role = session?.user?.role;

  return (
    <nav className="p-4 bg-gray-800 text-white min-h-screen">
      <div className="text-xl font-bold mb-4">Lab-Outreach</div>
      <ul className="space-y-4">
        {role === "admin" && (
          <>
            <li>
              <Link
                href="/admin/dashboard"
                className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/admin/manage-users"
                className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors"
              >
                Manage Users
              </Link>
            </li>
            <li>
              <Link
                href="/lab/view-reports"
                className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors"
              >
                View Reports
              </Link>
            </li>
            <li>
              <Link
                href="/admin/settings"
                className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors"
              >
                Settings
              </Link>
            </li>
          </>
        )}
        {role === "lab_manager" && (
          <>
            <li>
              <Link
                href="/lab/upload-reports"
                className="block px-4 py-2 rounded hover:bg-green-700 transition-colors"
              >
                Upload Reports
              </Link>
            </li>
            <li>
              <Link
                href="/lab/view-reports"
                className="block px-4 py-2 rounded hover:bg-green-700 transition-colors"
              >
                View/Edit Reports
              </Link>
            </li>
          </>
        )}
        {role === "company_user" && (
          <>
            <li>
              <Link
                href="/company/view-reports"
                className="block px-4 py-2 rounded hover:bg-purple-700 transition-colors"
              >
                View Reports
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
