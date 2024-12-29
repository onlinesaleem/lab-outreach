"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation"; // Import the router for app directory
import "../../styles/signin.css"; // Custom CSS

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter(); // Next.js client-side router

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signIn("credentials", { 
        email, 
        password, 
        redirect: false // Prevent automatic redirection
      });

      if (result?.ok) {
        router.push("/"); // Redirect to the homepage or dashboard manually
      } else {
        alert("Sign-in failed! Check your credentials.");
      }
    } catch (error) {
      console.error("Sign-in error:", error);
      alert("An error occurred during sign-in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 shadow-md rounded-md w-full max-w-sm text-center">

        {/* Logo */}
        <img src="/nbcc.png" alt="Lab Logo" className="w-20 h-20 mx-auto mb-4" />

        {/* Heading */}
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Laboratory Outreach
        </h1>

   
        {/* Sign-in Form */}
        <form onSubmit={handleSignIn} className="space-y-4">
          <div className="text-left">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="text-left">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    
    </div>
    
  );
}
