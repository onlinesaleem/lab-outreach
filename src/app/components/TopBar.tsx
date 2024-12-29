"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function TopBar() {
  const { data: session } = useSession();

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
      <div>
        <h1 className="text-xl font-bold text-gray-700">Laboratory outreach system</h1>
      </div>
      <div className="flex items-center gap-4">
        {session?.user && (
          <>
            <span className="text-gray-700 font-medium">
              Welcome, {session.user.name || "User"}
            </span>
            <Link href="/profile" className="text-blue-600 hover:underline">
              Profile Settings
            </Link>
            <button
        onClick={() => signOut({ callbackUrl: "/auth/signin" })}
        className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
      >
        Sign Out
      </button>
          </>
        )}
      </div>
    </header>
  );
}
