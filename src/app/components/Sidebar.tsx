"use client";
import { useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { FiLogOut } from "react-icons/fi";
import { FaTachometerAlt, FaUser, FaFileAlt, FaHospital } from "react-icons/fa"; // Example icons

export default function Sidebar() {
  const { data: session } = useSession();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);
  if (!session?.user) return null; // Hide the sidebar for unauthenticated users
  const menuItems = [
    ...(session.user.role === "admin"
      ? [
          { href: "/admin/dashboard", label: "Dashboard", icon: FaTachometerAlt },
          { href: "/admin/manage-users", label: "Manage Users", icon: FaUser },
          { href: "/lab/view-reports", label: "Manage Reports", icon: FaFileAlt },
          { href: "/admin/manage-companies", label: "Manage Companies", icon: FaHospital },
        ]
      : session.user.role === "lab_manager"
      ? [
          { href: "/lab/dashboard", label: "Dashboard", icon: FaTachometerAlt },
          { href: "/lab/upload-reports", label: "Upload Reports", icon: FaFileAlt },
          { href: "/lab/view-reports", label: "Reports", icon: FaFileAlt },
        ]
      : [
          { href: "/company/dashboard", label: "Dashboard", icon: FaTachometerAlt },
          { href: "/company/view-reports", label: "View Reports", icon: FaFileAlt },
        ]),
  ];

  return (
    <div className={`bg-gray-800 text-white h-screen ${isCollapsed ? "w-16" : "w-64"} transition-all duration-300`}>
      <div className="p-4 flex justify-between items-center">
        <h1 className={`${isCollapsed ? "hidden" : "block"} text-lg font-bold`}>Lab System</h1>
        <button onClick={toggleCollapse} className="text-gray-300">
          {isCollapsed ? "➤" : "◀"}
        </button>
      </div>
      <ul className="space-y-4 p-4">
        {menuItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded transition"
            >
              <item.icon />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          </li>
        ))}
      </ul>
   
    </div>
  );
}
