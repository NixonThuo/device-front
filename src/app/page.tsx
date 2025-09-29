'use client';

import { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import DeviceList from './components/DeviceList';
import NewDeviceForm from './components/NewDeviceForm';
import Header from './components/Header';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<'devices' | 'new-device'>('devices');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    setIsLoading(false);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setCurrentView('devices');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Device Manager</h1>
            <p className="text-gray-600">Secure device registration and management</p>
          </div>
          <LoginForm onLogin={handleLogin} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onLogout={handleLogout} />

      {/* Mobile Navigation */}
      <div className="md:hidden bg-white border-b border-gray-200">
        <div className="px-4 py-3">
          <div className="flex space-x-4">
            <button
              onClick={() => setCurrentView('devices')}
              className={`flex-1 px-3 py-2 rounded-md text-sm font-medium text-center transition-colors ${
                currentView === 'devices'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              My Devices
            </button>
            <button
              onClick={() => setCurrentView('new-device')}
              className={`flex-1 px-3 py-2 rounded-md text-sm font-medium text-center transition-colors ${
                currentView === 'new-device'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              Add Device
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'devices' ? (
          <DeviceList onAddDevice={() => setCurrentView('new-device')} />
        ) : (
          <NewDeviceForm onSuccess={() => setCurrentView('devices')} />
        )}
      </main>
    </div>
  );
}