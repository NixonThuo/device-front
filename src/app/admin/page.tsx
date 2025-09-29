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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {devices.map((device) => (
              <div
                key={device.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => router.push(`/devices/${device.id}/create-pass`)}
              >
                <div className="text-lg font-semibold text-indigo-700">
                  {device.deviceName}
                </div>
                <div className="text-gray-600 capitalize">
                  Type: {device.deviceType}
                </div>
                <div className="text-gray-600">Status: {device.status}</div>
                <div className="text-gray-600">
                  Owner:{" "}
                  {typeof device.owner === "object" && device.owner !== null
                    ? device.owner.email
                    : device.owner}
                </div>
                {device.serialNumber && (
                  <div className="text-gray-500 text-xs mt-2">
                    Serial: {device.serialNumber}
                  </div>
                )}
                <div className="text-gray-400 text-xs mt-2">
                  Created:{" "}
                  {device.createdAt
                    ? new Date(device.createdAt).toLocaleString()
                    : "-"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
