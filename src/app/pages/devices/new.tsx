import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function NewDevice() {
  const [deviceName, setDeviceName] = useState('');
  const [deviceType, setDeviceType] = useState('Phone');
  const [serialNumber, setSerialNumber] = useState('');
  const router = useRouter();

  const createDevice = async () => {
    const token = localStorage.getItem('token');
    await axios.post('http://localhost:3000/api/devices', {
      deviceName,
      deviceType,
      serialNumber,
    }, {
      headers: {
        Authorization: `JWT ${token}`,
      },
    });
    router.push('/devices');
  };

  return (
    <div>
      <h1>Register New Device</h1>
      <input placeholder="Device Name" onChange={(e) => setDeviceName(e.target.value)} />
      <select onChange={(e) => setDeviceType(e.target.value)}>
        <option value="Phone">Phone</option>
        <option value="Tablet">Tablet</option>
        <option value="Laptop">Laptop</option>
        <option value="Other">Other</option>
      </select>
      <input placeholder="Serial Number" onChange={(e) => setSerialNumber(e.target.value)} />
      <button onClick={createDevice}>Submit</button>
    </div>
  );
}
