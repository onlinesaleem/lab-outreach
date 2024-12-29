/* company/dashboard/page.tsx */
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

type Report = {
  id: number;
  patientName: string;
  testName: string;
  patientFileNumber: string ;
  pdfUrl:string;
  reportCreatedOn: string;
};

export default function CompanyDashboard() {
  const { data: session } = useSession();
  const [reportCount, setReportCount] = useState(0);
  const [recentReports, setRecentReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true); // Add loading state

  const fetchDashboardData = async () => {
    setLoading(true); 
    try {
      const res = await fetch(`/api/company/dashboard`);
      if (!res.ok) throw new Error("Failed to fetch dashboard data");

      const data = await res.json();
      setReportCount(data.totalReports || 0);
      setRecentReports(data.recentReports || []);
    } catch (error) {
      console.error("Error fetching company dashboard data:", error);
    }finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    if (session?.user?.role === "company_user") {
      fetchDashboardData();
    }
  }, [session]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Company Dashboard</h1>
            {/* Loading State */}
            {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
          <p className="ml-4 text-gray-700">Loading Reports...</p>
        </div>
      ) : (
        <>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-500 text-white p-4 rounded shadow-md">
          <h2 className="text-lg font-semibold">Total Reports</h2>
          <p className="text-3xl font-bold mt-2">{reportCount}</p>
        </div>
      </div>

      {/* Recent Reports Table */}
      <div className="bg-white p-4 rounded shadow-md">
        <h2 className="text-lg font-bold mb-4">Recent Reports</h2>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">#</th>
              <th className="p-2 border">MRN</th>
              <th className="p-2 border">Patient Name</th>
              <th className="p-2 border">Test Name</th>
              <th className="p-2 border">Result</th>
              <th className="p-2 border">Created On</th>
            </tr>
          </thead>
          <tbody>
            {recentReports.map((report, index) => (
              <tr key={report.id} className="text-center">
                <td className="p-2 border">{index + 1}</td>
                <td className="p-2 border">{report.patientFileNumber}  
                </td>
                <td className="p-2 border">{report.patientName}</td>
                
                <td className="p-2 border">{report.testName}</td>
                <td className="p-2 border">
                <a href={report.pdfUrl}   target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline mt-2 block"
            > View Result </a> </td>
                <td className="p-2 border">
                  {new Date(report.reportCreatedOn).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Navigation */}
      <div className="mt-8">
        <Link
          href="/company/view-reports"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          View Reports
        </Link>
      </div>
      </>
      )}
    </div>
  );
}
