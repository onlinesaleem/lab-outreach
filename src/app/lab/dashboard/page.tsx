"use client";


import DashboardCard from "@/app/components/DashboardCard";
import { useEffect, useState } from "react";

type CompanyReport = {
  companyName: string;
  reportCount: number;
};

export default function LabDashboard() {
  const [data, setData] = useState({
    totalReports: 0,
    companyReports: [] as CompanyReport[],
  });

  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await fetch("/api/lab/dashboard-metrics");
        if (!res.ok) throw new Error("Failed to fetch lab metrics");

        const result = await res.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching lab metrics:", error);
      }finally {
        setLoading(false); // Ensure loading is set to false after fetch
      }
    };

    fetchMetrics();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-700">Lab Dashboard</h1>
        {/* Loading State */}
        {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
          <p className="ml-4 text-gray-700">Loading Reports...</p>
        </div>
      ) : (
        <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Reports */}
        <DashboardCard
          title="Total Reports"
          value={data.totalReports}
          href="/lab/view-reports"
          color="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
        />
        {/* Company-wise Report Count */}
        {data.companyReports.map((company, index) => (
          <DashboardCard
            key={index}
            title={`Reports: ${company.companyName}`}
            value={company.reportCount}
            href={`/lab/view-reports?companyName=${encodeURIComponent(company.companyName)}`}
            color="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700"
          />
        ))}
      </div>
      </>
      )}
    </div>
  );
}
