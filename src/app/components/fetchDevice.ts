import apiClient from "../utils/apiClient";

export interface DeviceDetails {
  id: string;
  deviceName: string;
  deviceType: string;
  status: string;
  owner: string | { email: string };
}

export async function fetchDevice(deviceId: string, token: string): Promise<DeviceDetails | null> {
  try {
    const res = await apiClient.get(`/api/devices/${deviceId}`);
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
