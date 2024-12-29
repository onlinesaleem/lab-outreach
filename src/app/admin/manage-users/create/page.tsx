"use client";

import { useState } from "react";

export default function CreateUser() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/admin/users", {
      method: "POST",
      body: JSON.stringify({ name, email, password, role }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      alert("User created successfully!");
      setName("");
      setEmail("");
      setPassword("");
      setRole("admin");
    } else {
      alert("Error creating user!");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Create User</h1>
      <form onSubmit={handleCreateUser} className="space-y-4">
        <div>
          <label className="block font-medium">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border p-2 w-full"
          >
            <option value="admin">Admin</option>
            <option value="lab_manager">Lab Manager</option>
            <option value="company_user">Company User</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Create User
        </button>
      </form>
    </div>
  );
}
