"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface User {
  id: number;
  email: string;
}

interface DeviceFormProps {
  onSuccess: () => void;
}

export default function AdminNewDeviceForm({ onSuccess }: DeviceFormProps) {
  const [deviceName, setDeviceName] = useState("");
  const [deviceType, setDeviceType] = useState("Phone");
  const [serialNumber, setSerialNumber] = useState("");
  const [owner, setOwner] = useState<number | "">("");
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
        const res = await axios.get(`${apiUrl}/api/users`, {
          headers: { Authorization: `JWT ${token}` },
        });
        setUsers(res.data.docs || res.data || []);
      } catch {
        setError("Failed to load users.");
      }
    };
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      await axios.post(
        `${apiUrl}/api/devices`,
        {
          deviceName,
          deviceType,
          serialNumber,
          owner: owner ? Number(owner) : undefined,
        },
        {
          headers: { Authorization: `JWT ${token}` },
        }
      );
      onSuccess();
    } catch {
      setError("Failed to register device. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl border border-gray-200 mb-8">
      <h3 className="text-lg font-bold mb-4">Add Device (Admin)</h3>
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Device Name *</label>
        <input type="text" required value={deviceName} onChange={e => setDeviceName(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Device Type *</label>
        <select value={deviceType} onChange={e => setDeviceType(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg">
          <option value="Phone">Phone</option>
          <option value="Tablet">Tablet</option>
          <option value="Laptop">Laptop</option>
          <option value="Desktop">Desktop</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Serial Number</label>
        <input type="text" value={serialNumber} onChange={e => setSerialNumber(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Owner *</label>
  <select required value={owner} onChange={e => setOwner(Number(e.target.value))} className="w-full px-4 py-3 border border-gray-300 rounded-lg">
          <option value="">Select owner...</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>{user.email}</option>
          ))}
        </select>
      </div>
      <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50">
        {isLoading ? "Adding..." : "Add Device"}
      </button>
    </form>
  );
}
