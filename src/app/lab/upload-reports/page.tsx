"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

type Company = {
  id: number;
  name: string;
};

type FormDataType = {
  patientName: string;
  patientFileNumber: string;
  doctorName: string;
  testName: string;
  pdfFile: File | null;
  companyId: string;
};

export default function UploadReports() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState<FormDataType>({
    patientName: "",
    patientFileNumber: "",
    doctorName: "",
    testName: "",
    pdfFile: null,
    companyId: "",
  });
  const [companies, setCompanies] = useState<Company[]>([]);
  const createdById = session?.user?.id || null;

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch("/api/admin/companies");
        if (!res.ok) throw new Error("Failed to fetch companies");
        const data = await res.json();
        setCompanies(data);
      } catch (err) {
        console.error(err);
        alert("Error fetching companies.");
      }
    };

    fetchCompanies();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createdById) {
      alert("User ID not available. Please log in again.");
      return;
    }

    try {
      const formDataPayload = new FormData();
      formDataPayload.append("patientName", formData.patientName);
      formDataPayload.append("patientFileNumber", formData.patientFileNumber);
      formDataPayload.append("doctorName", formData.doctorName || "");
      formDataPayload.append("testName", formData.testName);
      if (formData.pdfFile) formDataPayload.append("pdfFile", formData.pdfFile);
      formDataPayload.append("companyId", formData.companyId);
      formDataPayload.append("createdById", String(createdById));

      const res = await fetch("/api/reports", {
        method: "POST",
        body: formDataPayload,
      });

      if (!res.ok) throw new Error("Failed to upload report");
      alert("Report uploaded successfully!");
      setFormData({
        patientName: "",
        patientFileNumber: "",
        doctorName: "",
        testName: "",
        pdfFile: null,
        companyId: "",
      });
      window.location.href = "/lab/view-reports";
    } catch (err) {
      console.error(err);
      alert("Error saving report.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, pdfFile: e.target.files[0] });
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Upload Lab Reports</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded-md">
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Patient Name"
            value={formData.patientName}
            onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Patient File Number"
            value={formData.patientFileNumber}
            onChange={(e) => setFormData({ ...formData, patientFileNumber: e.target.value })}
            className="w-full p-2 border rounded"
            required
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
            required
          />
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="w-full p-2 border rounded"
            required
          />
          <select
            value={formData.companyId}
            onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Company</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 mt-4"
        >
          Upload Report
        </button>
      </form>
    </div>
  );
}
