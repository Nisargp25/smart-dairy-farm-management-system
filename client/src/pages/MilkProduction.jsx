import React, { useEffect, useState } from 'react';
import { 
  Plus, BarChart2, Calendar, Trash2, Edit, X, 
  Droplets, ArrowRight, ChevronRight, Filter, Search,
  TrendingUp, Activity, CheckCircle, Info, Clipboard as ClipboardIcon,
  TrendingDown, Zap, ShieldCheck, Download, History
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function MilkProduction() {
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState(null);
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ 
    animal: '', 
    date: new Date().toISOString().split('T')[0], 
    morningAmount: '', 
    eveningAmount: '', 
    notes: '' 
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const recordsRes = await api.get('/milk').catch(() => ({ data: { records: [] } }));
      const statsRes = await api.get('/milk/stats').catch(() => ({ data: { stats: [], todayTotal: 0 } }));
      const animalsRes = await api.get('/animals').catch(() => ({ data: { animals: [] } }));

      setRecords(recordsRes.data?.records || []);
      setStats(statsRes.data || { stats: [], todayTotal: 0 });
      setAnimals(animalsRes.data?.animals || []);
    } catch (err) {
      console.error('Registry Synchronization Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData._id) {
        await api.put(`/milk/${formData._id}`, formData);
        toast.success('Production Audit Synchronized');
      } else {
        await api.post('/milk', formData);
        toast.success('New Extraction Cycle Logged');
      }
      setShowModal(false);
      setFormData({ 
        animal: '', 
        date: new Date().toISOString().split('T')[0], 
        morningAmount: '', 
        eveningAmount: '', 
        notes: '' 
      });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Transaction Blocked');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Erase this extraction log from memory?')) {
      try {
        await api.delete(`/milk/${id}`);
        setRecords(records.filter(r => r._id !== id));
        toast.success('Audit Purged from Registry');
      } catch (err) {
        toast.error('Deletion operation failed');
      }
    }
  };

  const todayTotal = stats?.todayTotal || 0;
  const todayRecords = records.filter(r => new Date(r.date).toDateString() === new Date().toDateString());
  const morningToday = todayRecords.reduce((sum, r) => sum + (parseFloat(r.morningAmount) || 0), 0);
  const eveningToday = todayRecords.reduce((sum, r) => sum + (parseFloat(r.eveningAmount) || 0), 0);

  const chartData = stats?.stats?.map(s => ({
    time: s._id.day ? `${s._id.day}/${s._id.month}` : `${s._id.month}/${s._id.year}`,
    volume: s.totalMilk
  })) || [];

  return (
    <div className="animate-fade-in">
      <header className="mb-12 flex justify-between items-end">
        <div>
           <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-[2px] bg-emerald-500 rounded-full" />
              <p className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.2em]">Extraction Lifecycle</p>
           </div>
           <h1 className="text-4xl text-slate-900 mb-2 font-black tracking-tight">Yield <span className="serif-italic text-emerald-600 font-normal">Intelligence</span> Hub</h1>
           <p className="text-slate-500 text-sm font-medium">Real-time yields across morning and evening extraction sessions.</p>
        </div>
        <div className="flex gap-4">
          <button className="btn btn-secondary" onClick={() => fetchData()}><History size={18} /> Sync History</button>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={20} /> Log Session
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
         <div className="card bg-emerald-600 text-white border-none shadow-xl transform hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex-center backdrop-blur-md">
                   <Droplets size={24} />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Consolidated Volume</p>
            </div>
            <h2 className="text-5xl font-black tracking-tighter mb-1">{todayTotal.toFixed(1)} <span className="text-sm font-medium opacity-60">LITRES</span></h2>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">Today's Protocol Yield</p>
         </div>

         <div className="card hover:shadow-xl transition-all duration-300 border-slate-100">
            <div className="flex justify-between items-center mb-6">
               <div className="p-3 bg-amber-50 rounded-xl text-amber-500"><Zap size={20} /></div>
               <span className="text-[10px] uppercase font-black tracking-[0.2em] text-amber-600">Morning Cycle</span>
            </div>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-2">Dawn Yield</p>
            <h2 className="text-4xl font-black text-slate-800 tracking-tight">{morningToday.toFixed(1)} <span className="text-xs font-medium opacity-40 uppercase">L</span></h2>
         </div>

         <div className="card hover:shadow-xl transition-all duration-300 border-slate-100">
            <div className="flex justify-between items-center mb-6">
               <div className="p-3 bg-indigo-50 rounded-xl text-indigo-500"><Activity size={20} /></div>
               <span className="text-[10px] uppercase font-black tracking-[0.2em] text-indigo-600">Evening Cycle</span>
            </div>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-2">Dusk Yield</p>
            <h2 className="text-4xl font-black text-slate-800 tracking-tight">{eveningToday.toFixed(1)} <span className="text-xs font-medium opacity-40 uppercase">L</span></h2>
         </div>
      </div>

      <div className="card shadow-md mb-12 relative p-10 bg-slate-900 overflow-hidden" style={{ minHeight: '480px' }}>
         <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-500/5 blur-[120px]"></div>
         <div className="relative z-10 flex justify-between items-start mb-12">
            <div>
               <h3 className="text-3xl text-white mb-2 font-black tracking-tight">Yield <span className="serif-italic text-emerald-400 font-normal">Velocity</span> Analysis</h3>
               <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Authorized Data Log • 7-Day Performance</p>
            </div>
            <button className="btn btn-secondary bg-white/5 border-white/10 text-white hover:bg-white/10"><Download size={14} className="mr-2" /> Export Audit</button>
         </div>
         
         <div style={{ height: '320px', width: '100%', position: 'relative' }}>
            {chartData.length > 0 ? (
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                     <defs>
                        <linearGradient id="milkProdGrad" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                           <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                     <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10, fontWeight: 800}} />
                     <YAxis axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10, fontWeight: 800}} />
                     <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', background: '#1e293b', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)', color: 'white', fontSize: '11px' }} />
                     <Area type="monotone" dataKey="volume" stroke="#10b981" strokeWidth={5} fillOpacity={1} fill="url(#milkProdGrad)" />
                  </AreaChart>
               </ResponsiveContainer>
            ) : (
               <div className="flex-center flex-col h-full opacity-20">
                  <BarChart2 size={64} className="text-white mb-6" />
                  <p className="text-white font-black tracking-widest uppercase text-xs">Waiting for Production Logs Initialization</p>
               </div>
            )}
         </div>
      </div>

      <div className="flex justify-between items-center mb-10">
        <h3 className="text-2xl text-slate-800 font-black tracking-tight">Extraction Registry</h3>
        <div className="flex gap-4">
           <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-premium">
              <Search size={14} className="text-slate-400" />
              <input type="text" placeholder="Search registry..." className="bg-transparent border-none outline-none text-xs w-48 font-bold" />
           </div>
           <button className="btn btn-secondary"><Filter size={14} /> Refine Audit</button>
        </div>
      </div>

      {loading ? (
        <div className="loading-container"><div className="loader"></div><p className="font-bold text-emerald-600">Synchronizing...</p></div>
      ) : (
        <div className="table-container shadow-premium">
          <table>
            <thead>
              <tr>
                <th>Entry Timestamp</th>
                <th>Subject Asset</th>
                <th>Session Breakpoint (L)</th>
                <th>Consolidated (L)</th>
                <th style={{ textAlign: 'right' }}>Management Ops</th>
              </tr>
            </thead>
            <tbody>
              {records.map(record => (
                <tr key={record._id}>
                  <td className="font-extrabold text-slate-400 text-[10px] uppercase tracking-wider">{new Date(record.date).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                  <td>
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex-center font-black border border-emerald-100/50">{record.animal?.name?.[0]}</div>
                       <div>
                          <p className="font-black text-slate-800 text-sm">{record.animal?.name || 'Asset Identification Lost'}</p>
                          <p className="text-[10px] text-slate-400 font-bold">TAG: #{record.animal?.animalId || record.animalId}</p>
                       </div>
                    </div>
                  </td>
                  <td>
                     <div className="flex items-center gap-2">
                        <div className="bg-amber-50 text-amber-600 px-3 py-1.5 rounded-lg font-black text-[10px] tracking-tighter border border-amber-100/30">AM: {record.morningAmount}L</div>
                        <div className="bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg font-black text-[10px] tracking-tighter border border-indigo-100/30">PM: {record.eveningAmount}L</div>
                     </div>
                  </td>
                  <td>
                    <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl font-black text-xs border border-emerald-100/50">
                       {record.totalAmount} <span className="opacity-40 text-[9px] uppercase tracking-widest font-bold">Litres</span>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="flex gap-4 justify-end">
                      <button className="text-slate-300 hover:text-emerald-500 transition-colors"><Edit size={16} /></button>
                      <button onClick={() => handleDelete(record._id)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {records.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-24 text-center">
                     <div className="flex-center flex-col opacity-20">
                        <ClipboardIcon size={56} className="mb-6" />
                        <h4 className="text-xl text-slate-900 font-black uppercase">Extraction Registry Empty</h4>
                        <p className="text-xs font-bold uppercase tracking-widest mt-2">Initialize your first session log to populate the audit.</p>
                     </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex-center z-[2000] p-8">
          <div className="card animate-fade-in shadow-2xl w-full max-w-xl p-16 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 blur-[80px]" />
             
            <div className="flex justify-between items-center mb-12 relative z-10">
              <div>
                 <h2 className="text-4xl text-slate-900 mb-2 font-black tracking-tight">Execute <br/><span className="serif-italic text-emerald-600 font-normal">Audit</span> Log</h2>
                 <p className="text-sm text-slate-400 font-medium">Define a new production cycle entry.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-300 hover:text-slate-900 flex-center transition-colors"><X size={28} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-8 relative z-10">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 ml-1">Registry Subject Asset</label>
                <select name="animal" required value={formData.animal} onChange={handleChange} className="form-input cursor-pointer">
                  <option value="">-- AUTHORIZE SUBJECT ASSET --</option>
                  {animals.map(a => <option key={a._id} value={a._id}>{a.name} (Tag: {a.animalId})</option>)}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 ml-1">Chronological Snapshot Date</label>
                <input type="date" name="date" required value={formData.date} onChange={handleChange} className="form-input" />
              </div>
              
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 ml-1">Dawn Yield (L)</label>
                  <input type="number" step="0.1" name="morningAmount" required value={formData.morningAmount} onChange={handleChange} placeholder="0.0" className="form-input text-xl font-black" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 ml-1">Dusk Yield (L)</label>
                  <input type="number" step="0.1" name="eveningAmount" required value={formData.eveningAmount} onChange={handleChange} placeholder="0.0" className="form-input text-xl font-black" />
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                 <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary w-full py-4 uppercase text-xs font-black tracking-widest">Abort Process</button>
                 <button type="submit" className="btn btn-primary w-full py-4 uppercase text-xs font-black tracking-widest shadow-xl">Commit Entry</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
