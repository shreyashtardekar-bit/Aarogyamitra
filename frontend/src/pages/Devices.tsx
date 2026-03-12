import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Watch, 
  Smartphone, 
  Activity, 
  Battery, 
  Wifi, 
  WifiOff,
  Plus,
  Settings,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface Device {
  id: number;
  device_type: string;
  device_name: string;
  brand: string;
  model: string;
  connection_status: 'connected' | 'disconnected' | 'syncing';
  last_sync: string;
  battery_level: number;
  data_types: string[];
  is_active: boolean;
}

function Devices() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/devices/connected', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setDevices(data);
      }
    } catch (error) {
      console.error('Error fetching devices:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-600 bg-green-100';
      case 'syncing': return 'text-yellow-600 bg-yellow-100';
      case 'disconnected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'apple_watch': return Watch;
      case 'fitbit': return Activity;
      case 'oura_ring': return Smartphone;
      default: return Watch;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Connected Devices
            </h1>
            <p className="text-gray-600 mt-2">Manage your wearable health devices</p>
          </div>
          <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium py-2 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Add Device
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {devices.map((device, index) => {
          const Icon = getDeviceIcon(device.device_type);
          return (
            <motion.div
              key={device.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-purple-200/50 p-6"
            >
              {/* Device Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
                    <Icon className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{device.device_name}</h3>
                    <p className="text-sm text-gray-600">{device.brand} {device.model}</p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(device.connection_status)}`}>
                  {device.connection_status}
                </div>
              </div>

              {/* Device Status */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Battery className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Battery</span>
                  </div>
                  <span className="text-sm font-medium">{device.battery_level}%</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {device.connection_status === 'connected' ? (
                      <Wifi className="w-4 h-4 text-green-500" />
                    ) : (
                      <WifiOff className="w-4 h-4 text-red-500" />
                    )}
                    <span className="text-sm text-gray-600">Connection</span>
                  </div>
                  <span className="text-sm font-medium capitalize">{device.connection_status}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last Sync</span>
                  <span className="text-sm font-medium">
                    {new Date(device.last_sync).toLocaleString()}
                  </span>
                </div>

                {/* Data Types */}
                <div>
                  <p className="text-sm text-gray-600 mb-2">Tracking</p>
                  <div className="flex flex-wrap gap-2">
                    {device.data_types.slice(0, 3).map((type, idx) => (
                      <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                        {type}
                      </span>
                    ))}
                    {device.data_types.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        +{device.data_types.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 pt-4 border-t border-gray-200 flex space-x-2">
                <button className="flex-1 bg-purple-100 hover:bg-purple-200 text-purple-700 font-medium py-2 px-4 rounded-lg transition-colors text-sm flex items-center justify-center">
                  <Settings className="w-4 h-4 mr-1" />
                  Settings
                </button>
                <button className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-2 px-4 rounded-lg transition-colors text-sm flex items-center justify-center">
                  Sync Now
                </button>
              </div>
            </motion.div>
          );
        })}

        {/* Add New Device Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: devices.length * 0.1 }}
          className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-xl p-6 text-white cursor-pointer hover:from-purple-700 hover:to-blue-700 transition-all"
        >
          <div className="flex flex-col items-center justify-center h-full min-h-[300px]">
            <Plus className="w-12 h-12 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Add New Device</h3>
            <p className="text-sm opacity-90 text-center">Connect a new wearable device to track your health metrics</p>
          </div>
        </motion.div>
      </div>

      {/* Device Compatibility */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-purple-200/50 p-6"
      >
        <h3 className="text-xl font-bold text-gray-800 mb-4">Supported Devices</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'Apple Watch', icon: Watch, status: 'supported' },
            { name: 'Fitbit', icon: Activity, status: 'supported' },
            { name: 'Oura Ring', icon: Smartphone, status: 'supported' },
            { name: 'Garmin', icon: Watch, status: 'coming_soon' }
          ].map((device, index) => {
            const Icon = device.icon;
            return (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200">
                <Icon className="w-6 h-6 text-purple-600" />
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{device.name}</p>
                  <div className="flex items-center space-x-1">
                    {device.status === 'supported' ? (
                      <>
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <span className="text-xs text-green-600">Supported</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3 h-3 text-yellow-500" />
                        <span className="text-xs text-yellow-600">Coming Soon</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

export default Devices;
