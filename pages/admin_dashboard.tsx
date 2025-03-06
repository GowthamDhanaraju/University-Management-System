import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function AdminDashboard() {
  const [role, setRole] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole !== "admin") router.push("/");
    setRole(storedRole || "");
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p>Welcome, admin!</p>
    </div>
  );
}
a