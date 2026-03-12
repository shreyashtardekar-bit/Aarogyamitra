import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Dna, 
  Upload, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  TrendingUp,
  Heart,
  Brain,
  Activity,
  Shield,
  Info,
  Download
} from 'lucide-react';

interface GeneticData {
  id: number;
  uploaded_at: string;
  analysis_results: any;
  data_quality_score: number;
  markers_analyzed: number;
}

interface GeneticInsight {
  category: string;
  insights: string[];
  recommendations: string[];
  risk_level: 'low' | 'medium' | 'high';
}

function Genetics() {
  const [geneticData, setGeneticData] = useState<GeneticData | null>(null);
  const [insights, setInsights] = useState<GeneticInsight[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchGeneticData();
  }, []);

  const fetchGeneticData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/genetics/analysis', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setGeneticData(data);
        fetchInsights();
      }
    } catch (error) {
      console.error('Error fetching genetic data:', error);
    }
  };

  const fetchInsights = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/genetics/insights', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setInsights([
          {
            category: 'Health Risks',
            insights: data.health_risks || [],
            recommendations: [],
            risk_level: 'medium'
          },
          {
            category: 'Nutritional Needs',
            insights: data.nutritional_needs || [],
            recommendations: [],
            risk_level: 'low'
          },
          {
            category: 'Exercise Response',
            insights: data.exercise_recommendations || [],
            recommendations: [],
            risk_level: 'low'
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching insights:', error);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const token = localStorage.getItem('token');
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch('/api/genetics/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.ok) {
        const data = await response.json();
        setGeneticData(data);
        await fetchInsights();
      }
    } catch (error) {
      console.error('Error uploading genetic data:', error);
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
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
              Genetic Analysis
            </h1>
            <p className="text-gray-600 mt-2">Unlock personalized wellness insights from your DNA</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-purple-100 to-blue-100 px-4 py-2 rounded-full">
              <span className="text-sm font-medium text-purple-700">
                {geneticData ? 'Data Analyzed' : 'No Data'}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {geneticData ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Data Overview */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-purple-200/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Your Genetic Profile</h2>
                <div className="flex items-center space-x-2">
                  <Dna className="w-5 h-5 text-purple-600" />
                  <span className="text-sm text-gray-600">
                    {new Date(geneticData.uploaded_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <Dna className="w-5 h-5 text-purple-600" />
                    <span className="text-xs font-medium text-purple-700">Markers</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-900">{geneticData.markers_analyzed.toLocaleString()}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <span className="text-xs font-medium text-blue-700">Quality</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-900">{(geneticData.data_quality_score * 100).toFixed(1)}%</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <Heart className="w-5 h-5 text-emerald-600" />
                    <span className="text-xs font-medium text-emerald-700">Health Risks</span>
                  </div>
                  <p className="text-2xl font-bold text-emerald-900">{insights.length}</p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <TrendingUp className="w-5 h-5 text-orange-600" />
                    <span className="text-xs font-medium text-orange-700">Insights</span>
                  </div>
                  <p className="text-2xl font-bold text-orange-900">
                    {insights.reduce((acc, insight) => acc + insight.insights.length, 0)}
                  </p>
                </div>
              </div>

              {/* Genetic Insights */}
              <div className="space-y-4">
                {insights.map((insight, index) => (
                  <div key={index} className="border-l-4 border-purple-500 pl-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-800">{insight.category}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(insight.risk_level)}`}>
                        {insight.risk_level.toUpperCase()}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      {insight.insights.map((item, idx) => (
                        <div key={idx} className="flex items-start space-x-2">
                          <Info className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Analysis */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-purple-200/50 p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Detailed Genetic Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                    <Brain className="w-4 h-4 mr-2 text-purple-600" />
                    Metabolic Profile
                  </h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Metabolic Rate</span>
                      <span className="font-medium">Normal</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fat Processing</span>
                      <span className="font-medium">Efficient</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Carb Sensitivity</span>
                      <span className="font-medium">Moderate</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                    <Activity className="w-4 h-4 mr-2 text-blue-600" />
                    Exercise Response
                  </h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Endurance Potential</span>
                      <span className="font-medium">High</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Strength Response</span>
                      <span className="font-medium">Excellent</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Recovery Speed</span>
                      <span className="font-medium">Fast</span>
                    </div>
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
            {/* Upload New Data */}
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-xl p-6 text-white">
              <div className="flex items-center mb-4">
                <Upload className="w-6 h-6 mr-2" />
                <h3 className="text-lg font-bold">Update Data</h3>
              </div>
              <p className="text-sm mb-4 opacity-90">
                Upload new genetic data to refresh your analysis
              </p>
              <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur font-medium py-2 px-4 rounded-lg transition-colors">
                Choose File
              </button>
            </div>

            {/* Recommendations */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-purple-200/50 p-6">
              <div className="flex items-center mb-4">
                <CheckCircle className="w-6 h-6 mr-2 text-purple-600" />
                <h3 className="text-lg font-bold text-gray-800">Recommendations</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5"></div>
                  <p className="text-gray-600">Increase omega-3 intake for brain health</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5"></div>
                  <p className="text-gray-600">Focus on strength training 3x per week</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5"></div>
                  <p className="text-gray-600">Monitor vitamin D levels regularly</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5"></div>
                  <p className="text-gray-600">Prioritize 7-8 hours of quality sleep</p>
                </div>
              </div>
            </div>

            {/* Export Data */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-purple-200/50 p-6">
              <div className="flex items-center mb-4">
                <Download className="w-6 h-6 mr-2 text-purple-600" />
                <h3 className="text-lg font-bold text-gray-800">Export Data</h3>
              </div>
              <div className="space-y-3">
                <button className="w-full bg-purple-100 hover:bg-purple-200 text-purple-700 font-medium py-2 px-4 rounded-lg transition-colors text-sm">
                  Download PDF Report
                </button>
                <button className="w-full bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-2 px-4 rounded-lg transition-colors text-sm">
                  Export Raw Data
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      ) : (
        /* Upload Section */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-purple-200/50 p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Dna className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Upload Your Genetic Data</h2>
              <p className="text-gray-600">Get personalized insights from your DNA analysis</p>
            </div>

            {/* File Upload Area */}
            <div className="border-2 border-dashed border-purple-300 rounded-xl p-8 text-center mb-6">
              <Upload className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <p className="text-gray-700 font-medium mb-2">
                {selectedFile ? selectedFile.name : 'Choose your genetic data file'}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Supports 23andMe, AncestryDNA, MyHeritage, and raw DNA files
              </p>
              <input
                type="file"
                accept=".txt,.csv,.json"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-block bg-purple-100 hover:bg-purple-200 text-purple-700 font-medium py-2 px-6 rounded-lg cursor-pointer transition-colors"
              >
                Browse Files
              </label>
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Uploading and analyzing...</span>
                  <span className="font-medium text-purple-600">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Action Button */}
            <button
              onClick={handleFileUpload}
              disabled={!selectedFile || isUploading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing Your DNA...
                </div>
              ) : (
                'Analyze My DNA'
              )}
            </button>

            {/* Information */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start space-x-2">
                <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Privacy & Security</p>
                  <p>Your genetic data is encrypted and stored securely. We never share your personal information with third parties.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default Genetics;
