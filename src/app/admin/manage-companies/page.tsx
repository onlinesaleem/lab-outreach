"use client";

import { useState, useEffect } from "react";

type Company = {
  id: number;
  name: string;
  users?: User[]; // Handle multiple users
  
};

type User = {
  id: number;
  name: string;
};

export default function ManageCompanies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchCompaniesAndUsers = async () => {
      setLoading(true); // Start loading
      try {
        const companyRes = await fetch("/api/admin/companies");
        const userRes = await fetch("/api/admin/users");
        if (!companyRes.ok || !userRes.ok) throw new Error("Failed to fetch data");

        const companiesData = await companyRes.json();
        const usersData = await userRes.json();
        setCompanies(companiesData);
        setUsers(usersData);
      } catch (err) {
        console.error(err);
        alert("Error fetching companies and users.");
      }finally {
        setLoading(false); // Stop loading
      }
    };

    fetchCompaniesAndUsers();
  }, []);

  const saveCompany = async (company: { id?: number; name: string; assignedUserId?: number }) => {
    try {
      const method = company.id ? "PUT" : "POST"; // Check if we are editing or creating
      const res = await fetch("/api/admin/companies", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: company.id,
          name: company.name,
          assignedUserId: selectedUserId ?? undefined,
        }),
      });
  
      if (!res.ok) throw new Error("Failed to save company");
  
      alert(company.id ? "Company updated successfully!" : "Company created successfully!");
      setEditingCompany(null);
      setSelectedUserId(null);
  
      // Refetch updated company list
      const updatedCompanies = await fetch("/api/admin/companies").then((res) => res.json());
      setCompanies(updatedCompanies);
    } catch (err) {
      console.error(err);
      alert("Error saving company.");
    }
  };

  const deleteCompany = async (id: number) => {
    try {
      const res = await fetch("/api/admin/companies", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error("Failed to delete company");

      alert("Company deleted successfully!");
      setCompanies((prev) => prev.filter((company) => company.id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting company.");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Manage Companies</h1>
      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
          <p className="ml-4 text-gray-700">Loading Reports...</p>
        </div>
      ) : (
        <>
      
      {editingCompany ? (
        <div className="bg-white p-6 shadow-md rounded-md mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingCompany.id ? "Edit Company" : "Add Company"}
          </h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Company Name"
              value={editingCompany.name}
              onChange={(e) => setEditingCompany({ ...editingCompany, name: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <select
              className="w-full p-2 border rounded"
              value={selectedUserId || ""}
              onChange={(e) => setSelectedUserId(Number(e.target.value))}
            >
              <option value="">Assign User</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
            <div className="flex gap-4">
              <button
                onClick={() => saveCompany({ ...editingCompany, assignedUserId: selectedUserId ?? undefined, })}
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditingCompany(null);
                  setSelectedUserId(null);
                }}
                className="bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <button
            onClick={() => setEditingCompany({ id: 0, name: "" })}
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 mb-6"
          >
            Add Company
          </button>
          <ul className="space-y-4">
            {companies.map((company) => (
              <li
                key={company.id}
                className="bg-white p-4 shadow-md rounded flex justify-between items-center"
              >
                <div>
                  <p className="text-lg font-semibold">{company.name}</p>
                  <p className="text-sm text-gray-600">
                    Assigned User:{" "}
                    {company.users?.map((user) => user.name).join(", ") || "None"}
                  </p>
                </div>
                <div className="flex gap-2">
                <button
  onClick={() => {
    setEditingCompany(company);
    setSelectedUserId(company.users?.[0]?.id || null);
  }}
  className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600"
>
  Edit
</button>
                  <button
                    onClick={() => deleteCompany(company.id)}
                    className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
      )}
    </div>
  );
}
