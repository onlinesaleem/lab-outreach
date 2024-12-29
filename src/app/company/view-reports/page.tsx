"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

type Report = {
  id: number;
  patientName: string;
  patientFileNumber: string;
  doctorName?: string;
  testName: string;
  pdfUrl: string;
  company: { name: string };
  createdBy: { name: string };
  reportCreatedOn: string;
};

export default function CompanyViewReports() {
  const { data: session } = useSession();
  const [reports, setReports] = useState<Report[]>([]);
  const [page, setPage] = useState(1);
  const [totalReports, setTotalReports] = useState(0);
  const [filters, setFilters] = useState({ search: "", testName: "" });
  const [loading, setLoading] = useState(true); // Add loading state
  const limit = 10;

  const fetchReports = async () => {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search: filters.search,
        testName: filters.testName,
      }).toString();

      const res = await fetch(`/api/reports/company?${queryParams}`);
      if (!res.ok) throw new Error("Failed to fetch reports");

      const data = await res.json();
      setReports(data.reports || []);
      setTotalReports(data.totalReports || 0);
    } catch (err) {
      console.error(err);
      alert("Error fetching reports.");
    }finally {
      setLoading(false); // Ensure loading is set to false after fetch
    }
  };

  useEffect(() => {
    if (session?.user?.role === "company_user") {
      fetchReports();
    }
  }, [page, filters, session]);

  const handleNextPage = () => {
    if (page < Math.ceil(totalReports / limit)) setPage(page + 1);
  };

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Company Reports</h1>
 {/* Loading State */}
 {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
          <p className="ml-4 text-gray-700">Loading Reports...</p>
        </div>
      ) : (
        <>
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by patient name or file number"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="border p-2 rounded w-full md:w-1/3"
        />
        <input
          type="text"
          placeholder="Search by test name"
          value={filters.testName}
          onChange={(e) => setFilters({ ...filters, testName: e.target.value })}
          className="border p-2 rounded w-full md:w-1/3"
        />
        <button
          onClick={() => fetchReports()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Search
        </button>
        <button
          onClick={() => setFilters({ search: "", testName: "" })}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Clear
        </button>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <div key={report.id} className="bg-white p-4 shadow rounded">
            <h3 className="font-bold">Patient: {report.patientName}</h3>
            <p>File Number: {report.patientFileNumber}</p>
            <p>Doctor: {report.doctorName || "N/A"}</p>
            <p>Test: {report.testName}</p>
            <p>Created By: {report.createdBy.name}</p>
            <p>Created On: {new Date(report.reportCreatedOn).toLocaleString()}</p>
            <a
              href={report.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline mt-2 block"
            >
              View PDF
            </a>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={page === 1}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {page} of {Math.ceil(totalReports / limit)}
        </span>
        <button
          onClick={handleNextPage}
          disabled={page >= Math.ceil(totalReports / limit)}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
      </>
      )}
    </div>
  );
}
