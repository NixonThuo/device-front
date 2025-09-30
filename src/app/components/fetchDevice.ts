import axios from "axios";

export interface DeviceDetails {
  id: string;
  deviceName: string;
  deviceType: string;
  status: string;
  owner: string | { email: string };
}

export async function fetchDevice(deviceId: string, token: string): Promise<DeviceDetails | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const res = await axios.get(`${apiUrl}/api/devices/${deviceId}`,
      { headers: { Authorization: `JWT ${token}` } }
    );
    // Normalize owner to string if it's an object
    const data = res.data;
    if (data && typeof data.owner === 'object' && data.owner !== null && 'email' in data.owner) {
      data.owner = data.owner.email;
    }
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
}
