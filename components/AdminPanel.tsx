import React, { useState, useEffect } from 'react';
import { getAuthStatus, setupAdmin, verifyLogin, getSiteConfig, saveSiteConfig, getReservations, getStats } from '../services/storageService';
import { generateVenueDescription } from '../services/geminiService';
import { SiteConfig, Reservation } from '../types';
import { Settings, Users, Calendar, LogOut, Save, Wand2, Loader2, Lock, LayoutDashboard } from 'lucide-react';

interface AdminPanelProps {
  onLogout: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSetup, setIsSetup] = useState(false);
  
  // Auth Form State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Dashboard State
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'SETTINGS' | 'BOOKINGS'>('DASHBOARD');
  const [config, setConfig] = useState<SiteConfig>(getSiteConfig());
  const [bookings, setBookings] = useState<Reservation[]>([]);
  const [stats, setStats] = useState({ visitors: 0, bookings: 0 });
  
  // AI State
  const [aiPrompt, setAiPrompt] = useState({ vibe: '', type: '' });
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const setupStatus = getAuthStatus();
    setIsSetup(setupStatus);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      setBookings(getReservations());
      const s = getStats();
      setStats({ visitors: s.visitors, bookings: getReservations().length });
      setConfig(getSiteConfig());
    }
  }, [isAuthenticated, activeTab]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isSetup) {
      // First time setup
      if (username.length < 3 || password.length < 3) {
        setError('Username and password must be at least 3 characters.');
        return;
      }
      setupAdmin(username, password); // In real app, hash this!
      setIsSetup(true);
      setIsAuthenticated(true);
    } else {
      // Login
      const isValid = verifyLogin(username, password);
      if (isValid) {
        setIsAuthenticated(true);
      } else {
        setError('Invalid credentials.');
      }
    }
  };

  const handleSaveConfig = () => {
    saveSiteConfig(config);
    alert('Frontend settings updated successfully!');
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.type || !aiPrompt.vibe) return;
    setIsGenerating(true);
    try {
      const result = await generateVenueDescription(config.name, aiPrompt.vibe, aiPrompt.type);
      setConfig(prev => ({ ...prev, description: result.text }));
    } catch (e) {
      console.error(e);
      alert('Failed to generate content');
    } finally {
      setIsGenerating(false);
    }
  };

  // --- Render Auth Screen ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-slate-900 p-8 text-center">
            <div className="mx-auto w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mb-4 border border-slate-700">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              {isSetup ? 'Welcome Back' : 'Platform Setup'}
            </h2>
            <p className="text-slate-400 mt-2 text-sm">
              {isSetup ? 'Please enter your credentials to access the backend.' : 'Create your permanent admin account to get started.'}
            </p>
          </div>
          
          <form onSubmit={handleAuth} className="p-8 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 outline-none"
                placeholder="admin"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 outline-none"
                placeholder="••••••••"
              />
            </div>
            
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button type="submit" className="w-full py-3 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition">
              {isSetup ? 'Login' : 'Create Admin Account'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- Render Dashboard ---
  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">R</div>
            ReserveAI
          </h1>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <button 
            onClick={() => setActiveTab('DASHBOARD')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === 'DASHBOARD' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}
          >
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('BOOKINGS')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === 'BOOKINGS' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}
          >
            <Calendar size={20} /> Reservations
          </button>
          <button 
            onClick={() => setActiveTab('SETTINGS')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === 'SETTINGS' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}
          >
            <Settings size={20} /> Frontend Setup
          </button>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={onLogout} className="flex items-center gap-2 text-slate-400 hover:text-white transition">
            <LogOut size={18} /> Exit Backend
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8">
        {activeTab === 'DASHBOARD' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <p className="text-slate-500 text-sm font-medium uppercase">Total Visitors</p>
                <p className="text-4xl font-bold text-slate-900 mt-2">{stats.visitors}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <p className="text-slate-500 text-sm font-medium uppercase">Total Reservations</p>
                <p className="text-4xl font-bold text-slate-900 mt-2">{stats.bookings}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'BOOKINGS' && (
          <div className="space-y-6">
             <h2 className="text-2xl font-bold text-slate-800">Reservations</h2>
             <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-sm font-semibold text-slate-600">Name</th>
                      <th className="px-6 py-4 text-sm font-semibold text-slate-600">Date & Time</th>
                      <th className="px-6 py-4 text-sm font-semibold text-slate-600">Guests</th>
                      <th className="px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {bookings.map(b => (
                      <tr key={b.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <p className="font-medium text-slate-900">{b.name}</p>
                          <p className="text-sm text-slate-500">{b.phone}</p>
                        </td>
                        <td className="px-6 py-4 text-slate-600">{b.date} at {b.time}</td>
                        <td className="px-6 py-4 text-slate-600">{b.guests}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {bookings.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-slate-500">No reservations yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
             </div>
          </div>
        )}

        {activeTab === 'SETTINGS' && (
          <div className="max-w-3xl space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-800">Frontend Configuration</h2>
              <button onClick={handleSaveConfig} className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm">
                <Save size={18} /> Save Changes
              </button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
              <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">General Info</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Business Name</label>
                  <input 
                    value={config.name}
                    onChange={e => setConfig({...config, name: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone Contact</label>
                  <input 
                    value={config.contactPhone}
                    onChange={e => setConfig({...config, contactPhone: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Welcome Message (Hero)</label>
                <input 
                  value={config.welcomeMessage}
                  onChange={e => setConfig({...config, welcomeMessage: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-lg font-semibold text-slate-800">Description & AI Assistance</h3>
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">Powered by Gemini</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Venue Type</label>
                  <input 
                    placeholder="e.g., Italian Restaurant"
                    value={aiPrompt.type}
                    onChange={e => setAiPrompt({...aiPrompt, type: e.target.value})}
                    className="w-full px-3 py-2 text-sm border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Vibe / Keywords</label>
                  <input 
                    placeholder="e.g., Romantic, Candlelit, Jazz"
                    value={aiPrompt.vibe}
                    onChange={e => setAiPrompt({...aiPrompt, vibe: e.target.value})}
                    className="w-full px-3 py-2 text-sm border rounded-md"
                  />
                </div>
                <div className="md:col-span-2">
                  <button 
                    onClick={handleAiGenerate}
                    disabled={isGenerating || !aiPrompt.type}
                    className="w-full flex items-center justify-center gap-2 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm font-medium transition disabled:opacity-50"
                  >
                    {isGenerating ? <Loader2 className="animate-spin w-4 h-4"/> : <Wand2 className="w-4 h-4" />}
                    Generate Description with AI
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Website Description</label>
                <textarea 
                  value={config.description}
                  onChange={e => setConfig({...config, description: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-24"
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};