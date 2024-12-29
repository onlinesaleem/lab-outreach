"use client";

import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  password: string;
};

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    setLoading(true); // Start loading
    try{
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data: User[]) => setUsers(data))
      .catch((err) => console.error("Error fetching users:", err));
    }catch(error){
      console.error(error);
    }finally {
      setLoading(false); // Stop loading
    }
  }, []);

  const handleSave = async (user: Partial<User>) => {
    const res = await fetch("/api/admin/users", {
      method: "POST",
      body: JSON.stringify(user),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      const message = user.id ? "User updated!" : "User created!";
      alert(message);
      setEditingUser(null);
      location.reload();
    } else {
      alert("Failed to save user.");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Users</h1>

          {/* Loading State */}
          {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
          <p className="ml-4 text-gray-700">Loading Reports...</p>
        </div>
      ) : (
        <>
      {editingUser ? (
        <div className="bg-white p-6 shadow-md rounded-md">
          <h2 className="text-xl font-semibold mb-4">
            {editingUser.id ? "Edit User" : "Add User"}
          </h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={editingUser.name}
              onChange={(e) =>
                setEditingUser({ ...editingUser, name: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <input
              type="email"
              placeholder="Email"
              value={editingUser.email}
              onChange={(e) =>
                setEditingUser({ ...editingUser, email: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {!editingUser.id && (
              <input
                type="password"
                placeholder="Password"
                onChange={(e) =>
                  setEditingUser({
                    ...editingUser,
                    password: e.target.value,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            )}
            <select
              value={editingUser.role}
              onChange={(e) =>
                setEditingUser({ ...editingUser, role: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="admin">Admin</option>
              <option value="lab_manager">Lab Manager</option>
              <option value="company_user">Company User</option>
            </select>
          </div>
          <div className="mt-4 space-x-4">
            <button
              onClick={() => handleSave(editingUser)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save
            </button>
            <button
              onClick={() => setEditingUser(null)}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <button
            onClick={() =>
              setEditingUser({
                id: 0,
                name: "",
                email: "",
                role: "admin",
                password: "",
              })
            }
            className="mb-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Add User
          </button>
          <ul className="space-y-4">
            {users.map((user) => (
              <li
                key={user.id}
                className="bg-white p-4 shadow-md rounded-md flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-gray-800">
                    {user.name} ({user.role})
                  </p>
                  <p className="text-gray-600 text-sm">{user.email}</p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => setEditingUser(user)}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleSave({ id: user.id })}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
      </>
      )}
    </div>
  );
}
