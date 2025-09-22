import { useEffect, useState } from "react";

type Device = {
  id: string;
  deviceName: string;
  deviceType: string;
  // Add other properties if needed
};
import axios from "axios";

export default function Devices() {
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:3000/api/devices", {
        headers: {
          Authorization: `JWT ${token}`,
        },
      })
      .then((res) => setDevices(res.data.docs));
  }, []);

  return (
    <div>
      <h1>Your Devices</h1>
      <ul>
        {devices.map((device) => (
          <li key={device.id}>
            {device.deviceName} - {device.deviceType}
          </li>
        ))}
      </ul>
    </div>
  );
}
