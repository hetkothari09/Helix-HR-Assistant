import { useState } from 'react';
import {
  MessageSquare,
  TrendingUp,
  Target,
  Award,
  BookOpen,
  Briefcase,
  ThumbsUp,
  ThumbsDown,
  Send,
  FileUp,
  User
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function EmployeeDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'chat' | 'progress'>('chat');
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{
    id: string;
    question: string;
    answer: string;
    rating?: 'up' | 'down';
  }>>([
    {
      id: '1',
      question: 'How many PTO days do I get per year?',
      answer: 'Based on our company policy, full-time employees receive 15 PTO days per year in their first year of employment. After 3 years, this increases to 20 days, and after 5 years, you receive 25 days per year.',
      rating: 'up',
    },
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      question: message,
      answer: 'This is a demo response. In production, this would be answered by the RAG system analyzing HR policies.',
    };

    setChatHistory([...chatHistory, newMessage]);
    setMessage('');
  };

  const handleRating = (messageId: string, rating: 'up' | 'down') => {
    setChatHistory(chatHistory.map(msg =>
      msg.id === messageId ? { ...msg, rating } : msg
    ));
  };

  const mockSkills = [
    { name: 'Python', level: 85 },
    { name: 'React', level: 75 },
    { name: 'SQL', level: 70 },
    { name: 'Communication', level: 90 },
    { name: 'Project Management', level: 65 },
  ];

  const mockRecommendations = {
    nextRole: 'Senior Software Engineer',
    skillGaps: ['System Design', 'Docker', 'Kubernetes'],
    suggestedProjects: [
      'Lead the microservices migration project',
      'Mentor junior developers',
      'Contribute to architecture decisions',
    ],
    suggestedTraining: [
      'AWS Solutions Architect Certification',
      'Advanced System Design Course',
      'Leadership & Communication Workshop',
    ],
  };

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
                <h1 className="text-xl font-bold text-gray-900">Helix</h1>
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
          <h2 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name?.split(' ')[0]}!</h2>
          <p className="mt-2 text-gray-600">How can I help you today?</p>
        </div>

        <div className="mb-6">
          <nav className="flex space-x-4">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'chat'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>HR Assistant</span>
            </button>
            <button
              onClick={() => setActiveTab('progress')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'progress'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>My Career Progress</span>
            </button>
          </nav>
        </div>

        {activeTab === 'chat' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-[600px] flex flex-col">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Ask me anything about HR policies</h3>
                  <p className="text-sm text-gray-500 mt-1">Get instant answers backed by company documentation</p>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {chatHistory.map((chat) => (
                    <div key={chat.id} className="space-y-4">
                      <div className="flex justify-end">
                        <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%]">
                          <p className="text-sm">{chat.question}</p>
                        </div>
                      </div>

                      <div className="flex justify-start">
                        <div className="bg-gray-100 text-gray-900 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%]">
                          <p className="text-sm leading-relaxed">{chat.answer}</p>
                          <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-gray-200">
                            <span className="text-xs text-gray-500">Was this helpful?</span>
                            <button
                              onClick={() => handleRating(chat.id, 'up')}
                              className={`p-1 rounded transition-colors ${
                                chat.rating === 'up'
                                  ? 'bg-green-100 text-green-600'
                                  : 'text-gray-400 hover:text-green-600'
                              }`}
                            >
                              <ThumbsUp className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleRating(chat.id, 'down')}
                              className={`p-1 rounded transition-colors ${
                                chat.rating === 'down'
                                  ? 'bg-red-100 text-red-600'
                                  : 'text-gray-400 hover:text-red-600'
                              }`}
                            >
                              <ThumbsDown className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Ask a question about HR policies..."
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Quick Topics</h4>
                <div className="space-y-2">
                  {[
                    'PTO and Leave Policies',
                    'Benefits & Insurance',
                    'Remote Work Guidelines',
                    'Performance Reviews',
                    'Professional Development',
                  ].map((topic, index) => (
                    <button
                      key={index}
                      onClick={() => setMessage(topic)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl shadow-sm p-6 border border-blue-100">
                <div className="flex items-center space-x-2 mb-3">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  <h4 className="text-sm font-semibold text-gray-900">Pro Tip</h4>
                </div>
                <p className="text-sm text-gray-700">
                  Be specific in your questions for the most accurate answers. For example: "What is the policy for sick leave?"
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">Career Roadmap</h3>
                      <p className="text-sm text-gray-500 mt-1">Your path to the next level</p>
                    </div>
                    <label className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors">
                      <FileUp className="w-4 h-4" />
                      <span className="text-sm font-medium">Upload Resume</span>
                      <input type="file" className="hidden" accept=".pdf,.docx" />
                    </label>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-100">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Next Recommended Role</p>
                        <p className="text-lg font-semibold text-gray-900">{mockRecommendations.nextRole}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Your Skills</h4>
                      <div className="space-y-3">
                        {mockSkills.map((skill) => (
                          <div key={skill.name}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                              <span className="text-sm font-semibold text-blue-600">{skill.level}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-blue-600 to-cyan-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${skill.level}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center space-x-2 mb-4">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                    <h4 className="text-lg font-semibold text-gray-900">Suggested Projects</h4>
                  </div>
                  <div className="space-y-3">
                    {mockRecommendations.suggestedProjects.map((project, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-semibold text-blue-600">{index + 1}</span>
                        </div>
                        <p className="text-sm text-gray-700">{project}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center space-x-2 mb-4">
                    <Award className="w-5 h-5 text-blue-600" />
                    <h4 className="text-sm font-semibold text-gray-900">Skill Gaps</h4>
                  </div>
                  <div className="space-y-2">
                    {mockRecommendations.skillGaps.map((skill, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 bg-amber-50 rounded-lg border border-amber-100">
                        <div className="w-2 h-2 bg-amber-500 rounded-full" />
                        <span className="text-sm text-gray-700">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center space-x-2 mb-4">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    <h4 className="text-sm font-semibold text-gray-900">Suggested Training</h4>
                  </div>
                  <div className="space-y-3">
                    {mockRecommendations.suggestedTraining.map((training, index) => (
                      <div key={index} className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                        <p className="text-sm font-medium text-gray-900">{training}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl shadow-sm p-6 text-white">
                  <div className="flex items-center space-x-2 mb-3">
                    <User className="w-5 h-5" />
                    <h4 className="text-sm font-semibold">Profile Completion</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">75%</span>
                    </div>
                    <div className="w-full bg-blue-400 rounded-full h-2">
                      <div className="bg-white h-2 rounded-full" style={{ width: '75%' }} />
                    </div>
                    <p className="text-xs mt-2 opacity-90">Upload your resume to unlock personalized insights</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
