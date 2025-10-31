import { useState } from 'react';
import {
  Users,
  MessageSquare,
  TrendingUp,
  Clock,
  ThumbsUp,
  FileText,
  BarChart3,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AnalyticsData } from '../../types';

export function HRDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'queries' | 'employees' | 'policies'>('overview');

  const analyticsData: AnalyticsData = {
    total_queries: 1247,
    avg_response_time: 2.3,
    satisfaction_rate: 94.5,
    active_users: 342,
    total_employees: 456,
  };

  const recentQueries = [
    { id: 1, employee: 'Sarah Johnson', query: 'PTO policy details', rating: 'up', time: '2 min ago' },
    { id: 2, employee: 'Michael Chen', query: 'Remote work guidelines', rating: 'up', time: '15 min ago' },
    { id: 3, employee: 'Emily Davis', query: 'Health insurance coverage', rating: 'down', time: '1 hour ago' },
    { id: 4, employee: 'David Wilson', query: 'Performance review schedule', rating: 'up', time: '2 hours ago' },
  ];

  const topQueries = [
    { query: 'PTO days allowance', count: 156 },
    { query: 'Remote work policy', count: 142 },
    { query: 'Health benefits', count: 128 },
    { query: 'Performance reviews', count: 89 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">H</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900">Helix HR</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.department}</p>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">HR Dashboard</h2>
          <p className="mt-2 text-gray-600">Monitor system performance and employee interactions</p>
        </div>

        <div className="mb-6">
          <nav className="flex space-x-4">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'queries', label: 'Query Analytics' },
              { id: 'employees', label: 'Employee Progress' },
              { id: 'policies', label: 'Policy Management' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Queries</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{analyticsData.total_queries}</p>
                    <p className="text-sm text-green-600 mt-1 flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      +12% this month
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{analyticsData.avg_response_time}s</p>
                    <p className="text-sm text-green-600 mt-1 flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      Target: ≤3s
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-cyan-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Satisfaction Rate</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{analyticsData.satisfaction_rate}%</p>
                    <p className="text-sm text-green-600 mt-1 flex items-center">
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      Excellent
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <ThumbsUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Users</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{analyticsData.active_users}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      of {analyticsData.total_employees} employees
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Queries</h3>
                  <BarChart3 className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-4">
                  {recentQueries.map((query) => (
                    <div key={query.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{query.employee}</p>
                        <p className="text-sm text-gray-600">{query.query}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-xs text-gray-500">{query.time}</span>
                        {query.rating === 'up' ? (
                          <ThumbsUp className="w-4 h-4 text-green-600" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Top Queries</h3>
                  <TrendingUp className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-4">
                  {topQueries.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{item.query}</p>
                        <span className="text-sm font-semibold text-blue-600">{item.count}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(item.count / topQueries[0].count) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'queries' && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center space-x-3 mb-6">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-900">Query Analytics</h3>
            </div>
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Detailed query analytics and trends will be displayed here</p>
            </div>
          </div>
        )}

        {activeTab === 'employees' && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center space-x-3 mb-6">
              <UserCheck className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-900">Employee Progress Tracking</h3>
            </div>
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Employee career progression data and insights will be displayed here</p>
            </div>
          </div>
        )}

        {activeTab === 'policies' && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center space-x-3 mb-6">
              <FileText className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-900">Policy Management</h3>
            </div>
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">HR policy documents and knowledge base management will be displayed here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
