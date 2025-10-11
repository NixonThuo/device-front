"use client";

import { useState, useEffect, use } from "react";
import axios from "axios";
import PassList from "./PassList";
import Header from "../../../components/Header";
import { fetchDevice, DeviceDetails } from "../../../components/fetchDevice";

export default function CreatePassPage({
  params,
}: {
  params: Promise<{ deviceId: string }>;
}) {
  const { deviceId } = use(params);
  const deviceIdInt = parseInt(deviceId, 10);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [device, setDevice] = useState<DeviceDetails | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const loadDevice = async () => {
      const token = localStorage.getItem("token") || "";
      const data = await fetchDevice(deviceIdInt.toString(), token);
      setDevice(data);
    };
    loadDevice();
  }, [deviceIdInt]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      await axios.post(
        `${apiUrl}/api/passes`,
        {
          device: deviceIdInt,
          startDate,
          endDate,
          status: "active",
        },
        { headers: { Authorization: `JWT ${token}` } }
      );
      setShowModal(false);
      window.location.href = `/devices/${deviceIdInt}/create-pass`;
    } catch {
      setError(
        "Failed to create pass. Please check for overlapping passes or contact your admin."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to get today's date in yyyy-mm-dd format
  const todayStr = new Date().toISOString().split("T")[0];

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
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Device Details
          </h2>
          {device ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
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
                      ? (device.owner as { email: string }).email
                      : device.owner}
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(true)}
                  className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  + Create Pass
                </button>
              </div>
            </div>
          ) : (
            <div className="text-gray-500">Loading device details...</div>
          )}
        </div>

        {/* Modal for creating pass */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
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
              <h3 className="text-xl font-bold mb-4">Create Pass</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    min={todayStr}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-gray-900"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </div>
                  ) : (
                    "Create Pass"
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        <PassList deviceId={deviceIdInt.toString()} />
      </div>
    </div>
  );
}
