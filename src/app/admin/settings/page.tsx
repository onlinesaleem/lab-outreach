"use client";

import { useState } from "react";

export default function Settings() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleUpdate = async () => {
    // API call to update admin profile
    alert("Settings updated (API integration pending).");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div>
        <label className="block font-medium">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 mb-4 w-full"
        />
      </div>
      <div>
        <label className="block font-medium">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 mb-4 w-full"
        />
      </div>
      <button
        onClick={handleUpdate}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Update Settings
      </button>
    </div>
  );
}
