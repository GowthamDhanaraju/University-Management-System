import { useState } from "react";
import { useRouter } from "next/router";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message);
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);

    if (data.role === "student") router.push("/student_dashboard");
    if (data.role === "teacher") router.push("/teacher_dashboard");
    if (data.role === "admin") router.push("/admin_dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-96 max-w-sm border border-gray-700">
        <h2 className="text-3xl font-semibold text-center text-white mb-6">University Management System</h2>
        {error && <p className="text-red-400 text-center bg-red-900/30 p-2 rounded mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-700 text-white"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-700 text-white"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 rounded-lg text-lg font-semibold shadow-md hover:opacity-90 transition-all"
          >
            Login
          </button>
        </form>
        <div className="flex items-center my-4">
          <hr className="flex-1 border-gray-600" />
          <span className="px-3 text-gray-400 text-sm">OR LOGIN AS - for testing</span>
          <hr className="flex-1 border-gray-600" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <button 
            onClick={() => {
              localStorage.setItem("role", "student");
              router.push("/student/student_dashboard");
            }}
            className="bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-600 text-sm font-medium"
          >
            Student
          </button>
          <button 
            onClick={() => {
              localStorage.setItem("role", "teacher");
              router.push("/teacher/teaccher_dashboard");
            }}
            className="bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-600 text-sm font-medium"
          >
            Teacher
          </button>
          <button 
            onClick={() => {
              localStorage.setItem("role", "admin");
              router.push("/admin/admin_dashboard");
            }}
            className="bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-600 text-sm font-medium"
          >
            Admin
          </button>
        </div>
        <p className="text-gray-400 text-center mt-6 text-sm">
          Don't have an account? Contact your administrator
        </p>
      </div>
    </div>
  );
}
