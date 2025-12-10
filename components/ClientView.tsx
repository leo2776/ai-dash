import React, { useState, useEffect } from 'react';
import { getSiteConfig, addReservation, incrementVisitorCount } from '../services/storageService';
import { SiteConfig } from '../types';
import { Calendar, Users, Clock, Phone, MapPin, CheckCircle, Loader2 } from 'lucide-react';

export const ClientView: React.FC<{ onAdminClick: () => void }> = ({ onAdminClick }) => {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    date: '',
    time: '',
    guests: 2
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simulate loading data and counting visit
    incrementVisitorCount();
    const data = getSiteConfig();
    setConfig(data);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      addReservation(bookingForm);
      setSubmitted(true);
      setLoading(false);
    }, 1000);
  };

  if (!config) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin w-8 h-8 text-slate-400"/></div>;

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Navbar */}
      <nav className="fixed w-full bg-white/90 backdrop-blur-md border-b border-slate-100 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="font-bold text-xl tracking-tight">{config.name}</div>
          <button 
            onClick={onAdminClick}
            className="text-sm font-medium text-slate-500 hover:text-slate-900 transition"
          >
            Admin Access
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="pt-32 pb-20 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
            {config.welcomeMessage}
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {config.description}
          </p>
          <div className="mt-8 flex justify-center gap-6 text-sm font-medium text-slate-500">
             <span className="flex items-center gap-1"><Phone size={16} /> {config.contactPhone}</span>
             <span className="flex items-center gap-1"><MapPin size={16} /> {config.address}</span>
          </div>
        </div>
      </div>

      {/* Booking Section */}
      <div className="py-20 px-4">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden relative">
          <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-2">Make a Reservation</h2>
            <p className="text-slate-500 mb-8">Secure your spot with us today.</p>
            
            {submitted ? (
              <div className="text-center py-12 animate-fade-in">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Confirmed!</h3>
                <p className="text-slate-600 mt-2">We look forward to seeing you, {bookingForm.name}.</p>
                <button 
                  onClick={() => {
                    setSubmitted(false);
                    setBookingForm({ name: '', phone: '', date: '', time: '', guests: 2 });
                  }}
                  className="mt-6 text-blue-600 font-medium hover:underline"
                >
                  Make another booking
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input 
                    required
                    type="text"
                    value={bookingForm.name}
                    onChange={e => setBookingForm({...bookingForm, name: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                  <input 
                    required
                    type="tel"
                    value={bookingForm.phone}
                    onChange={e => setBookingForm({...bookingForm, phone: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition"
                    placeholder="(555) 000-0000"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input 
                        required
                        type="date"
                        value={bookingForm.date}
                        onChange={e => setBookingForm({...bookingForm, date: e.target.value})}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Time</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input 
                        required
                        type="time"
                        value={bookingForm.time}
                        onChange={e => setBookingForm({...bookingForm, time: e.target.value})}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Number of Guests</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <select 
                      value={bookingForm.guests}
                      onChange={e => setBookingForm({...bookingForm, guests: parseInt(e.target.value)})}
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition bg-white"
                    >
                      {[1,2,3,4,5,6,7,8,9,10].map(n => (
                        <option key={n} value={n}>{n} People</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-3 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Confirm Reservation'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      
      <footer className="py-8 text-center text-slate-400 text-sm">
        &copy; {new Date().getFullYear()} {config.name}. Powered by ReserveAI.
      </footer>
    </div>
  );
};