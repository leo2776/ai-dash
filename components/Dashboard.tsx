import React, { useState } from 'react';
import { ToolType } from '../types';
import { MarketAnalyzer, CopyWriter, StrategyChat } from './BusinessTools';
import { 
  BarChart2, 
  MessageSquare, 
  PenTool, 
  LayoutDashboard, 
  Settings, 
  LogOut,
  Bell,
  TrendingUp
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface DashboardProps {
  onLogout: () => void;
}

const mockData = [
  { name: 'Jan', revenue: 4000, users: 2400 },
  { name: 'Feb', revenue: 3000, users: 1398 },
  { name: 'Mar', revenue: 2000, users: 9800 },
  { name: 'Apr', revenue: 2780, users: 3908 },
  { name: 'May', revenue: 1890, users: 4800 },
  { name: 'Jun', revenue: 2390, users: 3800 },
  { name: 'Jul', revenue: 3490, users: 4300 },
];

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [activeTool, setActiveTool] = useState<ToolType | 'OVERVIEW'>('OVERVIEW');

  const renderContent = () => {
    switch (activeTool) {
      case ToolType.MARKET_ANALYSIS:
        return <MarketAnalyzer />;
      case ToolType.COPYWRITER:
        return <CopyWriter />;
      case ToolType.STRATEGY_CHAT:
        return <StrategyChat />;
      default:
        return <Overview data={mockData} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col flex-shrink-0 transition-all duration-300">
        <div className="p-6">
          <div className="flex items-center gap-2 text-white font-bold text-xl">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
              <BarChart2 className="w-5 h-5 text-white" />
            </div>
            StratEdge
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          <NavItem 
            icon={<LayoutDashboard />} 
            label="Overview" 
            active={activeTool === 'OVERVIEW'} 
            onClick={() => setActiveTool('OVERVIEW')} 
          />
          <div className="pt-4 pb-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            AI Tools
          </div>
          <NavItem 
            icon={<BarChart2 />} 
            label="Market Intelligence" 
            active={activeTool === ToolType.MARKET_ANALYSIS} 
            onClick={() => setActiveTool(ToolType.MARKET_ANALYSIS)} 
          />
          <NavItem 
            icon={<PenTool />} 
            label="Ad Copy Generator" 
            active={activeTool === ToolType.COPYWRITER} 
            onClick={() => setActiveTool(ToolType.COPYWRITER)} 
          />
          <NavItem 
            icon={<MessageSquare />} 
            label="Strategic Advisor" 
            active={activeTool === ToolType.STRATEGY_CHAT} 
            onClick={() => setActiveTool(ToolType.STRATEGY_CHAT)} 
          />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={onLogout}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-800 capitalize">
            {activeTool === 'OVERVIEW' ? 'Dashboard Overview' : activeTool.replace('_', ' ').toLowerCase()}
          </h1>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-brand-600 transition relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-brand-100 border border-brand-200 flex items-center justify-center text-brand-700 font-bold text-sm">
              JD
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-colors ${
      active 
        ? 'bg-brand-600 text-white' 
        : 'hover:bg-slate-800 hover:text-white'
    }`}
  >
    {React.cloneElement(icon as React.ReactElement<any>, { size: 20 })}
    <span className="font-medium">{label}</span>
  </button>
);

const Overview = ({ data }: { data: any[] }) => (
  <div className="space-y-8 animate-fade-in">
    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <p className="text-sm text-slate-500 font-medium">Total Revenue</p>
        <p className="text-3xl font-bold text-slate-900 mt-2">$84,200</p>
        <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
          <TrendingUp className="w-3 h-3" /> +12.5% from last month
        </p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <p className="text-sm text-slate-500 font-medium">Active Campaigns</p>
        <p className="text-3xl font-bold text-slate-900 mt-2">12</p>
        <p className="text-sm text-slate-500 mt-1">4 pending approval</p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <p className="text-sm text-slate-500 font-medium">AI Tokens Used</p>
        <p className="text-3xl font-bold text-slate-900 mt-2">1.2M</p>
        <p className="text-sm text-brand-600 mt-1">Pro Plan Active</p>
      </div>
    </div>

    {/* Chart */}
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-[400px]">
      <h3 className="text-lg font-semibold text-slate-800 mb-6">Performance Analytics</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
          <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Area type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default Dashboard;