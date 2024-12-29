"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

// Types
type Report = {
  id: number;
  patientName: string;
  patientFileNumber: string;
  doctorName?: string;
  testName: string;
  pdfUrl: string;
  companyId: number;
  company: {
    id: number;
    name: string;
  };
  createdBy: {
    id: number;
    name: string;
  };
  updatedBy?: {
    id: number;
    name: string;
  };
  reportCreatedOn: string;
  reportModifiedOn?: string;
};

type Company = {
  id: number;
  name: string;
};

export default function ViewReports() {
  const { data: session } = useSession();
  const [reports, setReports] = useState<Report[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [page, setPage] = useState(1);
  const [totalReports, setTotalReports] = useState(0);
  const [searchCompany, setSearchCompany] = useState("");
  const [searchPatient, setSearchPatient] = useState("");
  const [searchTestName, setSearchTestName] = useState("");
  const [editingReport, setEditingReport] = useState<Report | null>(null);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [loading, setLoading] = useState(true); // Add loading state

const [searchTest, setSearchTest] = useState("");
const [formData, setFormData] = useState({
  patientName: "",
  patientFileNumber: "",
  doctorName: "",
  testName: "",
  pdfFile: null as File | null,
  companyId: "",
});

  const limit = 10;

  const fetchReports = async () => {
    try {
      const query = new URLSearchParams();
      if (selectedCompany) query.set("company", selectedCompany);
      if (searchPatient) query.set("search", searchPatient);
      if (searchTest) query.set("test", searchTest);
  
      const res = await fetch(
        `/api/reports?page=${page}&limit=${limit}&${query.toString()}`
      );
  
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
  
  // Fetch companies for the dropdown
  const fetchCompanies = async () => {
    try {
      const res = await fetch("/api/admin/companies");
      if (!res.ok) throw new Error("Failed to fetch companies");

      const data = await res.json();
      setCompanies(data || []);
    } catch (err) {
      console.error(err);
      alert("Error fetching companies.");
    }
  };

  useEffect(() => {
    fetchReports();
    fetchCompanies();
  }, [page, searchCompany, searchPatient, searchTestName]);

   // Edit handler
   const handleEdit = (report: Report) => {
    setEditingReport(report);
    setFormData({
      patientName: report.patientName,
      patientFileNumber: report.patientFileNumber,
      doctorName: report.doctorName || "",
      testName: report.testName,
      pdfFile: null,
      companyId: report.companyId.toString(),
    });
  };

  const handleUpdate = async () => {
    if (!editingReport) return;

    try {
      const formDataPayload = new FormData();
      formDataPayload.append("patientName", formData.patientName);
      formDataPayload.append("patientFileNumber", formData.patientFileNumber);
      formDataPayload.append("doctorName", formData.doctorName || "");
      formDataPayload.append("testName", formData.testName);
      formDataPayload.append("companyId", formData.companyId);

      if (formData.pdfFile) {
        formDataPayload.append("pdfFile", formData.pdfFile);
      } else {
        formDataPayload.append("pdfUrl", editingReport.pdfUrl);
      }

      const res = await fetch(`/api/reports/${editingReport.id}`, {
        method: "PUT",
        body: formDataPayload,
      });

      if (!res.ok) throw new Error("Failed to update report");

      alert("Report updated successfully!");
      setEditingReport(null);
      fetchReports(); // Refresh reports
    } catch (err) {
      console.error(err);
      alert("Error updating report.");
    }
  };

  // Delete handler
  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/reports`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error("Failed to delete report");
      alert("Report deleted successfully!");
      fetchReports(); // Refresh the list
    } catch (err) {
      console.error(err);
      alert("Error deleting report.");
    }
  };
  const handleNextPage = () => {
    if (page < Math.ceil(totalReports / limit)) setPage(page + 1);
  };

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">View and Manage Reports</h1>
{/* Loading State */}
{loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
          <p className="ml-4 text-gray-700">Loading Reports...</p>
        </div>
      ) : (
        <>
      {/* Modal for Editing */}
      {editingReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Edit Report</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Patient Name"
                value={formData.patientName}
                onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Patient File Number"
                value={formData.patientFileNumber}
                onChange={(e) => setFormData({ ...formData, patientFileNumber: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Doctor Name"
                value={formData.doctorName}
                onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Test Name"
                value={formData.testName}
                onChange={(e) => setFormData({ ...formData, testName: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <input
                type="file"
                accept=".pdf"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    pdfFile: e.target.files?.[0] || null,
                  })
                }
                className="w-full p-2 border rounded"
              />
              <select
                value={formData.companyId}
                onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Company</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-4 flex gap-4">
              <button
                onClick={handleUpdate}
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Save
              </button>
              <button
                onClick={() => setEditingReport(null)}
                className="bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Filters */}
      <div className="mb-4 flex gap-4">
      <select
  value={selectedCompany}
  onChange={(e) => setSelectedCompany(e.target.value)}
  className="border rounded p-2"
>
  <option value="">All Companies</option>
  {companies.map((company) => (
    <option key={company.id} value={company.name}>
      {company.name}
    </option>
  ))}
</select>

<input
  type="text"
  placeholder="Search by patient name or file number"
  value={searchPatient}
  onChange={(e) => setSearchPatient(e.target.value)}
  className="border rounded p-2"
/>

<input
  type="text"
  placeholder="Search by test name"
  value={searchTest}
  onChange={(e) => setSearchTest(e.target.value)}
  className="border rounded p-2"
/>
<button
  onClick={fetchReports}
  className="bg-gray-700 text-white px-4 py-2 rounded"
>
  Search
</button>
      </div>

      {/* Reports grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {reports.map((report) => (
          <div
            key={report.id}
            className="bg-white p-4 shadow-md rounded flex flex-col justify-between"
          >
            <div>
              <h3 className="font-bold">Patient: {report.patientName}</h3>
              <p>Test: {report.testName}</p>
              <p>Doctor: {report.doctorName}</p>
              <p>File Number: {report.patientFileNumber}</p>
              <p>Company: {report.company?.name || "N/A"}</p>
              <p>Created By: {report.createdBy?.name || "N/A"}</p>
              <p> Created On:{" "}
      {new Date(report.reportCreatedOn).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })}</p>
              {report.updatedBy && (
                <>
                  <p>Updated By: {report.updatedBy?.name || "N/A"}</p>
                  <p>
                    
                    Updated On:{" "}
        {new Date(report.reportModifiedOn||"").toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })}
                    
                    </p>
                </>
              )}
              <a
                href={report.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline mt-2 block"
              >
                View PDF
              </a>
            </div>
            <div className="flex justify-end gap-2 mt-4">
            <button
                onClick={() => handleEdit(report)}
                className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(report.id)}
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={page === 1}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {page} of {Math.ceil(totalReports / limit)}
        </span>
        <button
          onClick={handleNextPage}
          disabled={page >= Math.ceil(totalReports / limit)}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
      </>
      )}
    </div>
  );
}
