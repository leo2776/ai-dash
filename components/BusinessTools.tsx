import React, { useState, useEffect, useRef } from 'react';
import { analyzeMarketTrends, generateMarketingCopy, createStrategyChat } from '../services/geminiService';
import { AnalysisResult, GeneratedCopy, ChatMessage } from '../types';
import { Loader2, Send, BarChart2, CheckCircle, TrendingUp, Copy } from 'lucide-react';
import { Chat, GenerateContentResponse } from "@google/genai";

// --- Market Analysis Tool ---
export const MarketAnalyzer = () => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const data = await analyzeMarketTrends(topic);
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Failed to analyze market. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-slate-800 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-brand-600" /> Market Intelligence
        </h2>
        <form onSubmit={handleAnalyze} className="flex gap-4">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter industry, stock, or trend (e.g., 'EV market in Asia')"
            className="flex-1 px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 transition disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Analyze'}
          </button>
        </form>
      </div>

      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 col-span-1 md:col-span-2">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Executive Summary</h3>
            <p className="text-lg text-slate-800 leading-relaxed">{result.summary}</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Key Insights</h3>
            <ul className="space-y-3">
              {result.keyPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-slate-700">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Strategic Recommendation</h3>
              <p className="text-slate-700 italic border-l-4 border-brand-500 pl-4 py-1 mb-4">
                "{result.recommendation}"
              </p>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="text-sm text-slate-500">Market Sentiment</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize
                ${result.sentiment === 'positive' ? 'bg-green-100 text-green-700' : 
                  result.sentiment === 'negative' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}`}>
                {result.sentiment}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Copywriter Tool ---
export const CopyWriter = () => {
  const [formData, setFormData] = useState({ product: '', audience: '', tone: 'Professional' });
  const [loading, setLoading] = useState(false);
  const [copy, setCopy] = useState<GeneratedCopy | null>(null);

  const handleGenerate = async () => {
    if (!formData.product || !formData.audience) return;
    setLoading(true);
    try {
      const result = await generateMarketingCopy(formData.product, formData.audience, formData.tone);
      setCopy(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
      <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit sticky top-6">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Copy className="w-5 h-5 text-brand-600" /> Ad Generator
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Product/Service Name</label>
            <input 
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
              value={formData.product}
              onChange={e => setFormData({...formData, product: e.target.value})}
              placeholder="e.g., CloudScale DB"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Target Audience</label>
            <input 
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
              value={formData.audience}
              onChange={e => setFormData({...formData, audience: e.target.value})}
              placeholder="e.g., CTOs of startups"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tone of Voice</label>
            <select 
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
              value={formData.tone}
              onChange={e => setFormData({...formData, tone: e.target.value})}
            >
              <option>Professional</option>
              <option>Exciting</option>
              <option>Urgent</option>
              <option>Empathetic</option>
              <option>Luxury</option>
            </select>
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading || !formData.product}
            className="w-full py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition disabled:opacity-50 mt-2"
          >
            {loading ? 'Generating...' : 'Create Campaign'}
          </button>
        </div>
      </div>

      <div className="lg:col-span-2">
        {copy ? (
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-xl shadow-md border border-slate-200 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-brand-500"></div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">{copy.headline}</h3>
              <p className="text-slate-600 text-lg leading-relaxed mb-8">{copy.body}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {copy.ctas.map((cta, i) => (
                  <button key={i} className="px-4 py-2 border-2 border-slate-200 rounded-lg text-slate-700 font-medium hover:border-brand-500 hover:text-brand-600 transition text-sm text-center">
                    {cta}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
            <Copy className="w-12 h-12 mb-4 opacity-20" />
            <p>Enter details to generate high-conversion copy</p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Strategy Chat ---
export const StrategyChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatSessionRef.current = createStrategyChat();
    // Initial greeting
    setMessages([{
      id: 'init',
      role: 'model',
      text: 'Hello. I am your strategic advisor. What business challenge can I help you solve today?',
      timestamp: Date.now()
    }]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !chatSessionRef.current) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const result = await chatSessionRef.current.sendMessageStream({ message: userMsg.text });
      
      let fullText = '';
      const botMsgId = (Date.now() + 1).toString();
      
      // Initialize bot message
      setMessages(prev => [...prev, {
        id: botMsgId,
        role: 'model',
        text: '',
        timestamp: Date.now()
      }]);

      for await (const chunk of result) {
        const c = chunk as GenerateContentResponse;
        const text = c.text || '';
        fullText += text;
        
        setMessages(prev => prev.map(msg => 
          msg.id === botMsgId ? { ...msg, text: fullText } : msg
        ));
      }
    } catch (error) {
      console.error("Chat error", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: 'I encountered an error processing your request. Please try again.',
        timestamp: Date.now()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-xl shadow-sm border border-slate-200 max-w-4xl mx-auto overflow-hidden">
      <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
        <h3 className="font-semibold text-slate-700">Strategic Advisor</h3>
        <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Online
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
              msg.role === 'user' 
                ? 'bg-brand-600 text-white rounded-tr-none' 
                : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
            }`}>
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
              <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-200 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask for strategic advice..."
          className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
        />
        <button 
          type="submit" 
          disabled={!input.trim() || isTyping}
          className="p-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50 transition"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};