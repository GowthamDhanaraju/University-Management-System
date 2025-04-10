import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

// Demo user data for testing
const testUsers = [
  { role: 'student', email: 'student@example.com', password: 'student123' },
  { role: 'teacher', email: 'teacher@example.com', password: 'teacher123' },
  { role: 'admin', email: 'admin@example.com', password: 'admin123' }
];

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  const router = useRouter();

  // Clear any existing authentication data on login page load
  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
  }, []);

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    
    console.log("Stored token:", token);
    console.log("Stored role:", role);
    
    if (token && role) {
      const routeMap = {
        student: "/student/student_dashboard",
        teacher: "/teacher/teacher_dashboard",
        admin: "/admin/admin_dashboard"
      };
      console.log("Redirecting to:", routeMap[role] || "/");
      router.push(routeMap[role] || "/");
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.message || "Authentication failed");
        setLoading(false);
        return;
      }
      
      // Store authentication token and user role
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      // Store additional user info if available
      if (data.userId) localStorage.setItem("userId", data.userId);
      if (data.userName) localStorage.setItem("userName", data.userName);
      if (data.email) localStorage.setItem("userEmail", data.email);
      
      const routeMap = {
        student: "/student/student_dashboard",
        teacher: "/teacher/teacher_dashboard",
        admin: "/admin/admin_dashboard"
      };
      router.push(routeMap[data.role] || "/");
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  // For testing purposes - quick login should be removed in production
  const quickLogin = async (role: "student" | "teacher" | "admin") => {
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/auth/quick-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ role })
      });
      
      if (!res.ok) {
        const errorData = await res.text();
        let errorMessage = "Quick login failed";
        try {
          const parsedError = JSON.parse(errorData);
          errorMessage = parsedError.message || errorMessage;
        } catch (parseError) {
          console.error("Error parsing response:", parseError);
          errorMessage = errorData || errorMessage;
        }
        
        setError(errorMessage);
        setLoading(false);
        return;
      }
      
      const data = await res.json();
      
      // Store authentication data
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      
      // Store additional user info if available
      if (data.userId) localStorage.setItem("userId", data.userId);
      if (data.userName) localStorage.setItem("userName", data.userName);
      if (data.userEmail) localStorage.setItem("userEmail", data.userEmail);
      
      const routeMap = {
        student: "/student/student_dashboard",
        teacher: "/teacher/teacher_dashboard",
        admin: "/admin/admin_dashboard"
      };
      
      // Navigate to appropriate dashboard based on role
      router.push(routeMap[data.role] || "/");
    } catch (err) {
      console.error("Quick login error:", err);
      setError("Quick login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (user: typeof testUsers[0]) => {
    setEmail(user.email);
    setPassword(user.password);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <Head>
        <title>Login - University Management System</title>
      </Head>
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
          <p className="mt-2 text-gray-400">Sign in to your account</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="email@university.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="••••••••"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-800 disabled:bg-indigo-800 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : 'Sign in'}
            </button>
          </div>
        </form>

        <div className="mt-4">
          <button 
            onClick={() => setShowCredentials(!showCredentials)}
            className="text-sm text-indigo-400 hover:text-indigo-300 mb-2 w-full text-center"
          >
            {showCredentials ? "Hide Test Credentials" : "Show Test Credentials"} 
          </button>
          {showCredentials && (
            <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600 mt-2">
              <h3 className="text-gray-300 font-medium mb-2">Available Test Accounts:</h3>
              <div className="space-y-3">
                {testUsers.map((user, index) => (
                  <div key={index} className="flex flex-col p-2 rounded bg-gray-700/50 border border-gray-600">
                    <span className="text-sm text-gray-300 capitalize mb-1">{user.role}</span>
                    <span className="text-xs text-gray-400">Email: <span className="text-gray-300">{user.email}</span></span>
                    <span className="text-xs text-gray-400">Password: <span className="text-gray-300">{user.password}</span></span>
                    <div className="flex justify-between items-center">
                      <button 
                        onClick={() => fillCredentials(user)}
                        className="text-xs bg-indigo-600 hover:bg-indigo-700 px-2 py-1 rounded"
                      >
                        Fill
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 text-center">
          <button onClick={() => quickLogin("student")} className="text-sm text-blue-400 hover:underline">
            Quick Login as Student
          </button>
          <button onClick={() => quickLogin("teacher")} className="text-sm text-blue-400 hover:underline ml-4">
            Quick Login as Teacher
          </button>
          <button onClick={() => quickLogin("admin")} className="text-sm text-blue-400 hover:underline ml-4">
            Quick Login as Admin
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
