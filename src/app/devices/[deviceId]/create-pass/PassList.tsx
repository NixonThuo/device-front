"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { fetchDevice, DeviceDetails } from "../../../components/fetchDevice";

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
  const [device, setDevice] = useState<DeviceDetails | null>(null);

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
    const fetchDeviceDetails = async () => {
      const token = localStorage.getItem("token") || "";
      const data = await fetchDevice(deviceId, token);
      setDevice(data);
    };
    fetchPasses();
    fetchDeviceDetails();
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

  // Print pass handler
  const printPass = (pass: Pass) => {
    // Always use string for owner (email)
    let owner = device?.owner;
    if (owner && typeof owner === "object" && "email" in owner) {
      owner = owner.email;
    }
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(
      JSON.stringify({
        device: device?.deviceName || "-",
        owner: owner || "-",
        label: pass.label,
        startDate: pass.startDate,
        endDate: pass.endDate,
        status: pass.status,
      })
    )}`;
    const passHtml = `<!DOCTYPE html>
      <html lang='en'>
      <head>
        <meta charset='UTF-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <title>Device Pass</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; background: #f4f4f9; margin: 0; padding: 2rem; }
          .pass-card { max-width: 500px; margin: 2rem auto; background: #fff; border-radius: 1rem; box-shadow: 0 2px 12px rgba(0,0,0,0.08); padding: 2rem; }
          .title { color: #4f46e5; font-size: 1.5rem; font-weight: bold; margin-bottom: 1.5rem; text-align: center; }
          .pass-flex { display: flex; align-items: flex-start; justify-content: space-between; }
          table { width: 65%; border-collapse: collapse; }
          td { padding: 0.5rem 0.7rem; font-size: 1.08rem; }
          .label { color: #6b7280; font-size: 0.98rem; text-align: right; white-space: nowrap; }
          .value { color: #111827; font-weight: 500; text-align: left; }
          .status { display: inline-block; margin-top: 0.2rem; padding: 0.4rem 1rem; border-radius: 999px; background: #d1fae5; color: #065f46; font-weight: 600; font-size: 1rem; text-align: center; }
          .qr { margin-left: 1.5rem; }
        </style>
      </head>
      <body>
        <div class='pass-card'>
          <div class='title'>Device Pass</div>
          <div class='pass-flex'>
            <table>
              <tr><td class='label'>Device Name:</td><td class='value'>${
                device?.deviceName || "-"
              }</td></tr>
              <tr><td class='label'>Owner:</td><td class='value'>${
                owner || "-"
              }</td></tr>
              <tr><td class='label'>Label:</td><td class='value'>${
                pass.label
              }</td></tr>
              <tr><td class='label'>Start Date:</td><td class='value'>${formatDate(
                pass.startDate
              )}</td></tr>
              <tr><td class='label'>End Date:</td><td class='value'>${formatDate(
                pass.endDate
              )}</td></tr>
              <tr><td class='label'>Status:</td><td class='value' style='vertical-align:middle;'><span class='status'>${
                pass.status.charAt(0).toUpperCase() + pass.status.slice(1)
              }</span></td></tr>
            </table>
            <img class='qr' src='${qrCodeUrl}' alt='QR Code' width='120' height='120' />
          </div>
        </div>
        <script>window.onload = () => { window.print(); };</script>
      </body>
      </html>`;
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(passHtml);
      printWindow.document.close();
    }
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
              {pass.status === "active" && (
                <button
                  className="ml-4 px-3 py-1 rounded bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors"
                  onClick={() => printPass(pass)}
                >
                  Print Pass
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
