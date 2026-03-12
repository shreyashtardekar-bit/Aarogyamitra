import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Activity, 
  TrendingUp, 
  AlertCircle, 
  Clock,
  Battery,
  Thermometer,
  Droplets,
  Brain,
  Eye,
  Zap
} from 'lucide-react';

interface BiometricEntry {
  id: number;
  heart_rate: number;
  blood_pressure: {
    systolic: number;
    diastolic: number;
  };
  stress_level: number;
  oxygen_saturation: number;
  body_temperature: number;
  timestamp: string;
}

interface LiveBiometrics {
  current_biometrics: {
    heart_rate: number;
    blood_pressure: {
      systolic: number;
      diastolic: number;
    };
    stress_level: number;
    oxygen_saturation: number;
  };
  health_metrics: {
    metabolic_age: number;
    wellness_score: number;
    recovery_rate: number;
  };
  alerts: Array<{
    type: string;
    message: string;
    value: any;
    timestamp: string;
  }>;
}

function Biometrics() {
  const [liveData, setLiveData] = useState<LiveBiometrics | null>(null);
  const [historicalData, setHistoricalData] = useState<BiometricEntry[]>([]);
  const [isRealTime, setIsRealTime] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');

  useEffect(() => {
    fetchLiveData();
    fetchHistoricalData();
    
    // Set up real-time updates
    const interval = setInterval(() => {
      if (isRealTime) {
        fetchLiveData();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isRealTime]);

  const fetchLiveData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/biometrics/live', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setLiveData(data);
      }
    } catch (error) {
      console.error('Error fetching live biometrics:', error);
    }
  };

  const fetchHistoricalData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/biometrics/entries?limit=50', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setHistoricalData(data);
      }
    } catch (error) {
      console.error('Error fetching historical data:', error);
    }
  };

  const getHeartRateZone = (hr: number) => {
    if (hr < 60) return { zone: 'Resting', color: 'text-blue-600 bg-blue-100' };
    if (hr < 100) return { zone: 'Normal', color: 'text-green-600 bg-green-100' };
    if (hr < 140) return { zone: 'Elevated', color: 'text-yellow-600 bg-yellow-100' };
    return { zone: 'High', color: 'text-red-600 bg-red-100' };
  };

  const getStressLevel = (level: number) => {
    if (level <= 3) return { level: 'Low', color: 'text-green-600 bg-green-100' };
    if (level <= 6) return { level: 'Moderate', color: 'text-yellow-600 bg-yellow-100' };
    return { level: 'High', color: 'text-red-600 bg-red-100' };
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
              Biometric Monitoring
            </h1>
            <p className="text-gray-600 mt-2">Real-time health metrics and vital signs tracking</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsRealTime(!isRealTime)}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                isRealTime 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {isRealTime ? 'Live' : 'Paused'}
            </button>
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>
        </div>
      </motion.div>

      {liveData ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Metrics */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Real-time Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Heart Rate */}
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-purple-200/50 p-4">
                <div className="flex items-center justify-between mb-3">
                  <Heart className="w-5 h-5 text-red-500" />
                  <span className="text-xs font-medium text-gray-500">Heart Rate</span>
                </div>
                <div className="mb-2">
                  <p className="text-2xl font-bold text-gray-800">
                    {liveData.current_biometrics.heart_rate}
                  </p>
                  <p className="text-xs text-gray-500">bpm</p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getHeartRateZone(liveData.current_biometrics.heart_rate).color}`}>
                  {getHeartRateZone(liveData.current_biometrics.heart_rate).zone}
                </div>
              </div>

              {/* Blood Pressure */}
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-purple-200/50 p-4">
                <div className="flex items-center justify-between mb-3">
                  <Activity className="w-5 h-5 text-blue-500" />
                  <span className="text-xs font-medium text-gray-500">Blood Pressure</span>
                </div>
                <div className="mb-2">
                  <p className="text-2xl font-bold text-gray-800">
                    {liveData.current_biometrics.blood_pressure.systolic}/{liveData.current_biometrics.blood_pressure.diastolic}
                  </p>
                  <p className="text-xs text-gray-500">mmHg</p>
                </div>
                <div className="px-2 py-1 rounded-full text-xs font-medium text-green-600 bg-green-100">
                  Normal
                </div>
              </div>

              {/* Stress Level */}
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-purple-200/50 p-4">
                <div className="flex items-center justify-between mb-3">
                  <Brain className="w-5 h-5 text-purple-500" />
                  <span className="text-xs font-medium text-gray-500">Stress Level</span>
                </div>
                <div className="mb-2">
                  <p className="text-2xl font-bold text-gray-800">
                    {liveData.current_biometrics.stress_level}/10
                  </p>
                  <p className="text-xs text-gray-500">scale</p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStressLevel(liveData.current_biometrics.stress_level).color}`}>
                  {getStressLevel(liveData.current_biometrics.stress_level).level}
                </div>
              </div>

              {/* Oxygen Saturation */}
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-purple-200/50 p-4">
                <div className="flex items-center justify-between mb-3">
                  <Droplets className="w-5 h-5 text-cyan-500" />
                  <span className="text-xs font-medium text-gray-500">SpO2</span>
                </div>
                <div className="mb-2">
                  <p className="text-2xl font-bold text-gray-800">
                    {liveData.current_biometrics.oxygen_saturation}%
                  </p>
                  <p className="text-xs text-gray-500">saturation</p>
                </div>
                <div className="px-2 py-1 rounded-full text-xs font-medium text-green-600 bg-green-100">
                  Optimal
                </div>
              </div>
            </div>

            {/* Health Metrics */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-purple-200/50 p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Advanced Health Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-8 h-8 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-800">
                    {liveData.health_metrics.metabolic_age}
                  </p>
                  <p className="text-sm text-gray-600">Metabolic Age</p>
                  <p className="text-xs text-green-600 mt-1">-2 years vs actual</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Zap className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-800">
                    {liveData.health_metrics.wellness_score}
                  </p>
                  <p className="text-sm text-gray-600">Wellness Score</p>
                  <p className="text-xs text-green-600 mt-1">Excellent</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Battery className="w-8 h-8 text-emerald-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-800">
                    {liveData.health_metrics.recovery_rate}%
                  </p>
                  <p className="text-sm text-gray-600">Recovery Rate</p>
                  <p className="text-xs text-green-600 mt-1">Fast recovery</p>
                </div>
              </div>
            </div>

            {/* Health Alerts */}
            {liveData.alerts.length > 0 && (
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-purple-200/50 p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 text-yellow-500" />
                  Health Alerts
                </h3>
                <div className="space-y-3">
                  {liveData.alerts.map((alert, index) => (
                    <div key={index} className={`p-3 rounded-lg border ${
                      alert.type === 'warning' 
                        ? 'bg-yellow-50 border-yellow-200' 
                        : 'bg-blue-50 border-blue-200'
                    }`}>
                      <div className="flex items-start space-x-2">
                        <AlertCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                          alert.type === 'warning' ? 'text-yellow-600' : 'text-blue-600'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">{alert.message}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(alert.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Historical Trends */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-purple-200/50 p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Trends</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3">Heart Rate Trend</h4>
                  <div className="h-32 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg flex items-end justify-around p-2">
                    {historicalData.slice(-8).map((entry, index) => (
                      <div
                        key={index}
                        className="w-6 bg-gradient-to-t from-red-400 to-red-600 rounded-t"
                        style={{ height: `${(entry.heart_rate / 180) * 100}%` }}
                      ></div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-3">Stress Level Trend</h4>
                  <div className="h-32 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg flex items-end justify-around p-2">
                    {historicalData.slice(-8).map((entry, index) => (
                      <div
                        key={index}
                        className="w-6 bg-gradient-to-t from-purple-400 to-purple-600 rounded-t"
                        style={{ height: `${(entry.stress_level / 10) * 100}%` }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Device Status */}
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-xl p-6 text-white">
              <div className="flex items-center mb-4">
                <Eye className="w-6 h-6 mr-2" />
                <h3 className="text-lg font-bold">Monitoring Status</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Real-time Tracking</span>
                  <div className={`w-3 h-3 rounded-full ${isRealTime ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Device Connected</span>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Data Quality</span>
                  <span className="text-sm font-medium">Excellent</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-purple-200/50 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-purple-100 hover:bg-purple-200 text-purple-700 font-medium py-2 px-4 rounded-lg transition-colors text-sm">
                  Log Manual Reading
                </button>
                <button className="w-full bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-2 px-4 rounded-lg transition-colors text-sm">
                  Set Health Alerts
                </button>
                <button className="w-full bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-medium py-2 px-4 rounded-lg transition-colors text-sm">
                  Export Report
                </button>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-purple-200/50 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Wellness Tips</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5"></div>
                  <p>Your heart rate variability is improving - keep up the consistent exercise!</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5"></div>
                  <p>Consider adding 5 minutes of meditation to reduce stress levels.</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5"></div>
                  <p>Your oxygen saturation is optimal - great cardiovascular health!</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      ) : (
        /* Loading State */
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading biometric data...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Biometrics;
