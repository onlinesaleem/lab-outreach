"use client";

import DashboardCard from "@/app/components/DashboardCard";
import { useEffect, useState } from "react";


type DashboardData = {
  totalUsers: number;
  totalReports: number;
  totalCompanies: number;
  recentReports: { id: number; patientName: string; testName: string; reportCreatedOn: string }[];
};

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Start loading
      try {
        const res = await fetch("/api/admin/dashboard");
        const result = await res.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }finally {
        setLoading(false); // Stop loading
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>

       {/* Loading State */}
       {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
          <p className="ml-4 text-gray-700">Loading Reports...</p>
        </div>
      ) : (
        <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <DashboardCard
    title="Total Users"
    value={data?.totalUsers || 0}
    href="/admin/manage-users"
    color="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
  />
  <DashboardCard
    title="Total Reports"
    value={data?.totalReports || 0}
    href="/admin/manage-reports"
    color="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
  />
  <DashboardCard
    title="Total Companies"
    value={data?.totalCompanies || 0}
    href="/admin/manage-companies"
    color="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700"
  />

      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Recently Uploaded Reports</h2>
        <div className="bg-white shadow-md rounded p-4">
          <ul>
            {data?.recentReports.map((report) => (
              <li key={report.id} className="border-b last:border-none py-2">
                <span className="font-medium">{report.patientName}</span> - {report.testName} -{" "}
                {new Date(report.reportCreatedOn).toLocaleString()}
              </li>
            )) || <p>No recent reports available.</p>}
          </ul>
        </div>
      </div>
      </>
      )}
    </div>
  );
}
