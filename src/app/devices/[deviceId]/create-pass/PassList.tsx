"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Pass {
  id: string | number;
  label: string;
  startDate: string;
  endDate: string;
  status: string;
  isCurrentlyValid?: boolean;
}

export default function PassList({ deviceId }: { deviceId: string }) {
  const [passes, setPasses] = useState<Pass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPasses = async () => {
      try {
        const token = localStorage.getItem("token");
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
        const res = await axios.get(`${apiUrl}/api/passes/by-device`, {
          headers: { Authorization: `JWT ${token}` },
          params: { device: deviceId },
        });
        setPasses(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
        setError("Failed to load passes.");
      } finally {
        setLoading(false);
      }
    };
    fetchPasses();
  }, [deviceId]);

  if (loading) return <div>Loading passes...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (passes.length === 0) return <div>No passes found for this device.</div>;

  // Format date helper
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return isNaN(date.getTime())
      ? dateStr
      : new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }).format(date);
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold mb-2">Existing Passes</h3>
      <ul className="space-y-3">
        {passes.map((pass) => (
          <li
            key={pass.id}
            className="border rounded p-3 flex flex-col md:flex-row md:items-center md:justify-between"
          >
            <div>
              <span className="font-mono text-indigo-700 font-bold mr-2">
                {pass.label}
              </span>
              <span className="text-gray-600">
                {formatDate(pass.startDate)} → {formatDate(pass.endDate)}
              </span>
            </div>
            <div>
              <span
                className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${
                  pass.status === "active"
                    ? "bg-green-100 text-green-800"
                    : pass.status === "expired"
                    ? "bg-gray-200 text-gray-600"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {pass.status.charAt(0).toUpperCase() + pass.status.slice(1)}
              </span>
              {pass.isCurrentlyValid && (
                <span className="ml-2 px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-800">
                  Currently Valid
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
