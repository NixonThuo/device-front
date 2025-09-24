"use client";

import { useState } from "react";
import axios from "axios";

interface NewDeviceFormProps {
  onSuccess: () => void;
}

export default function NewDeviceForm({ onSuccess }: NewDeviceFormProps) {
  const [deviceName, setDeviceName] = useState("");
  const [deviceType, setDeviceType] = useState("Phone");
  const [serialNumber, setSerialNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const deviceTypes = [
    { value: "Phone", label: "Phone", icon: "📱" },
    { value: "Tablet", label: "Tablet", icon: "📱" },
    { value: "Laptop", label: "Laptop", icon: "💻" },
    { value: "Desktop", label: "Desktop", icon: "🖥️" },
    { value: "Other", label: "Other", icon: "📟" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  const userIdStr = localStorage.getItem("userId");
  const userId = userIdStr ? parseInt(userIdStr, 10) : undefined;
      await axios.post(
        `${apiUrl}/api/devices`,
        {
          deviceName,
          deviceType,
          serialNumber,
          owner: userId,
        },
        {
          headers: {
            Authorization: `JWT ${token}`,
          },
        }
      );

      onSuccess();
    } catch (err) {
      console.error(err);
      setError("Failed to register device. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Register New Device
        </h2>
        <p className="text-gray-600">
          Add a new device to your account for tracking and management.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="deviceName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Device Name *
            </label>
            <input
              id="deviceName"
              type="text"
              required
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-gray-900 placeholder-gray-500"
              placeholder="e.g., John's iPhone 15"
            />
            <p className="mt-1 text-sm text-gray-500">
              Choose a name that helps you identify this device
            </p>
          </div>

          <div>
            <label
              htmlFor="deviceType"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Device Type *
            </label>
            <select
              id="deviceType"
              value={deviceType}
              onChange={(e) => setDeviceType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-gray-900"
            >
              {deviceTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="serialNumber"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Serial Number
            </label>
            <input
              id="serialNumber"
              type="text"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-gray-900 placeholder-gray-500"
              placeholder="e.g., ABC123456789"
            />
            <p className="mt-1 text-sm text-gray-500">
              Optional: Enter the device serial number for better tracking
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              type="button"
              onClick={onSuccess}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !deviceName.trim()}
              className="flex-1 px-6 py-3 border border-transparent text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Registering...
                </div>
              ) : (
                "Register Device"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
