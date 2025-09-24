import axios from "axios";

export interface DeviceDetails {
  id: string;
  deviceName: string;
  deviceType: string;
  status: string;
  owner: string;
}

export async function fetchDevice(deviceId: string, token: string): Promise<DeviceDetails | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const res = await axios.get(`${apiUrl}/api/devices/${deviceId}`,
      { headers: { Authorization: `JWT ${token}` } }
    );
    return res.data;
  } catch (err) {
    console.error(err);
    return null;
  }
}
