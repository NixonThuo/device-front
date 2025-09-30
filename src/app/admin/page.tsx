"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import { useRouter } from "next/navigation";
import NewDeviceForm from "../components/NewDeviceForm";

interface Device {
  id: number;
  deviceName: string;
  deviceType: string;
  serialNumber?: string;
  status: string;
  owner: { email: string } | string | null;
  createdAt?: string;
}

export default function AdminDevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    const role = localStorage.getItem("userRole");
    if (role !== "admin") {
      router.replace("/");
      return;
    }
    setIsAdmin(true);
    const fetchDevices = async () => {
      try {
        const token = localStorage.getItem("token");
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
        const res = await axios.get(`${apiUrl}/api/devices`, {
          headers: { Authorization: `JWT ${token}` },
        });
        setDevices(res.data.docs || res.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load devices.");
      } finally {
        setLoading(false);
      }
    };
    fetchDevices();
  }, [router]);

  if (!isClient || !isAdmin) {
    // Prevent SSR mismatch and unauthorized access
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onLogout={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          localStorage.removeItem("userRole");
          window.location.href = "/";
        }}
      />
      <div className="max-w-5xl mx-auto py-10">
        <button
          onClick={() => setShowModal(true)}
          className="mb-8 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          + Add Device
        </button>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl relative">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                onClick={() => setShowModal(false)}
                aria-label="Close"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <NewDeviceForm onSuccess={() => window.location.reload()} />
            </div>
          </div>
        )}
        <h2 className="text-2xl font-bold mb-6">All Devices (Admin)</h2>
        {loading ? (
          <div>Loading devices...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">
                      Device Name
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">
                      Type
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">
                      Status
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">
                      Owner
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">
                      Serial
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {devices
                    .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                    .map((device) => (
                      <tr
                        key={device.id}
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() =>
                          router.push(`/devices/${device.id}/create-pass`)
                        }
                      >
                        <td className="px-4 py-2 text-indigo-700 font-medium">
                          {device.deviceName}
                        </td>
                        <td className="px-4 py-2 capitalize">
                          {device.deviceType}
                        </td>
                        <td className="px-4 py-2">{device.status}</td>
                        <td className="px-4 py-2">
                          {typeof device.owner === "object" &&
                          device.owner !== null
                            ? device.owner.email
                            : device.owner}
                        </td>
                        <td className="px-4 py-2 text-xs text-gray-500">
                          {device.serialNumber || "-"}
                        </td>
                        <td className="px-4 py-2 text-xs text-gray-400">
                          {device.createdAt
                            ? new Date(device.createdAt).toLocaleString()
                            : "-"}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
              <button
                className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {Math.ceil(devices.length / pageSize)}
              </span>
              <button
                className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
                onClick={() =>
                  setCurrentPage((p) =>
                    Math.min(Math.ceil(devices.length / pageSize), p + 1)
                  )
                }
                disabled={
                  currentPage === Math.ceil(devices.length / pageSize) ||
                  devices.length === 0
                }
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
