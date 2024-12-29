import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

// Types
type Company = {
  id: number;
  name: string;
};

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
  reportCreatedOn: string;
};

export default function EditReportForm({ editingReport, onSave, onCancel }: { editingReport: Report; onSave: (updatedData: FormData) => void; onCancel: () => void; }) {
  const { data: session } = useSession();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [formData, setFormData] = useState({
    patientName: editingReport.patientName,
    patientFileNumber: editingReport.patientFileNumber,
    doctorName: editingReport.doctorName || "",
    testName: editingReport.testName,
    pdfFile: null as File | null,
    companyId: editingReport.companyId.toString(),
  });

  useEffect(() => {
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

    fetchCompanies();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedData = new FormData();
    updatedData.append("patientName", formData.patientName);
    updatedData.append("patientFileNumber", formData.patientFileNumber);
    updatedData.append("doctorName", formData.doctorName || "");
    updatedData.append("testName", formData.testName);
    updatedData.append("companyId", formData.companyId);
    if (formData.pdfFile) {
      updatedData.append("pdfFile", formData.pdfFile);
    }
    onSave(updatedData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-lg">
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
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
