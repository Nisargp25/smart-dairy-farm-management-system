import React, { useEffect, useState } from 'react';
import { 
  Leaf, Droplets, TrendingUp, IndianRupee, Activity, 
  ChevronRight, Sprout, Clipboard as ClipboardIcon, Users, ShoppingBag, 
  Package, Star, Sun, ArrowUpRight, ArrowDownRight,
  TrendingDown, Zap, ShieldCheck, Heart, Info, Box
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Registry Synchronization Failure');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const isManagement = ['admin', 'farmer', 'worker'].includes(user?.role);

  const ownerStats = [
    { label: 'Total Animals', value: stats?.totalAnimals || 0, icon: Leaf, color: '#10b981', bg: '#ecfdf5', trend: '+12% month' },
    { label: 'Today Production', value: `${stats?.todayMilk || 0} L`, icon: Droplets, color: '#6366f1', bg: '#eef2ff', trend: `Next 7D: ${stats?.prediction || 0}L` },
    { label: 'Monthly Revenue', value: `₹${stats?.monthlyIncome || 0}`, icon: IndianRupee, color: '#f59e0b', bg: '#fffbeb', trend: '₹12.4k pending' },
    { label: 'Active Workers', value: stats?.totalWorkers || 0, icon: Users, color: '#64748b', bg: '#f8fafc', trend: '100% capacity' },
  ];

  if (loading) return <div className="loading-container"><div className="loader"></div><p className="font-bold text-emerald-600">Synchronizing Global Ledger...</p></div>;

  return (
    <div className="animate-fade-in">
      <header className="mb-10">
        <div className="flex items-center gap-2 mb-2">
           <div className="w-8 h-[2px] bg-emerald-500 rounded-full" />
           <p className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.2em]">Operational Overview</p>
        </div>
        <h1 className="text-4xl text-slate-900 mb-2">Welcome Back, <span className="serif-italic text-emerald-600">{user?.name}</span></h1>
        <p className="text-slate-500 text-sm font-medium">Monitoring <span className="font-extrabold text-slate-700">{user?.farmName || 'Registry'}</span> session status.</p>
      </header>

      {/* High-Precision Metrics Grid */}
      <div className="stats-grid">
        {isManagement ? ownerStats.map((stat, i) => (
          <div key={i} className="card group">
             <div className="flex justify-between items-start mb-6">
                <div className="stat-icon-wrapper" style={{ background: `${stat.bg}`, color: stat.color }}>
                   <stat.icon size={24} />
                </div>
                <div className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100 italic">
                   <ArrowUpRight size={12} className="text-emerald-500" />
                   <span className="text-[10px] font-bold text-slate-500">{stat.trend}</span>
                </div>
             </div>
             <div>
                <p className="stat-label mb-1">{stat.label}</p>
                <div className="flex items-baseline gap-1">
                   <h2 className="stat-value">{stat.value}</h2>
                   {typeof stat.value === 'string' && stat.value.includes('L') && <span className="text-xs font-black text-slate-300">QTY</span>}
                </div>
             </div>
          </div>
        )) : (
          /* Customer Snapshot */
          <>
            <div className="card col-span-2 bg-slate-900 border-none relative overflow-hidden flex flex-col justify-center p-12" style={{ gridColumn: 'span 2' }}>
               <div className="absolute top-0 right-0 w-2/3 h-full bg-emerald-500/10 blur-[100px]" />
               <div className="relative z-10 max-w-md">
                  <h3 className="text-white text-3xl mb-4 leading-tight font-black">Fresh Organic Harvest <br/><span className="serif-italic font-normal text-emerald-400">delivered to your registry.</span></h3>
                  <button className="btn btn-primary px-8">Dispatch Delivery</button>
               </div>
               <div className="opacity-5 absolute -right-16 -bottom-16 text-white"><Leaf size={320} /></div>
            </div>
            <div className="card flex-center text-center flex-col p-10 h-full">
               <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-500 flex-center mb-6 shadow-inner"><ShieldCheck size={32} /></div>
               <p className="font-black text-lg text-slate-900 mb-1">Quality Guaranteed</p>
               <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-loose">Organic Certified <br/> Registry Protocols</p>
            </div>
          </>
        )}
      </div>

      {/* Main Framework Stage */}
      {isManagement ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
           {/* Production Lifecycle Chart */}
           <div className="card lg:col-span-2 p-0 overflow-hidden">
              <div className="p-8 pb-4 flex justify-between items-center bg-slate-50/50">
                 <div>
                    <h3 className="text-xl text-slate-900">Yield extraction analytics</h3>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Multi-session performace tracking</p>
                 </div>
                 <div className="bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-xl">
                    <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Prediction: </span>
                    <span className="text-sm font-black text-emerald-800">{stats?.prediction || '0.0'} L</span>
                 </div>
              </div>
              <div className="p-8 pt-4">
                <div style={{ height: '300px', width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats?.milkStats && stats.milkStats.length > 0 ? stats.milkStats : [
                      { name: 'Day 1', yield: 120 }, { name: 'Day 2', yield: 135 }, { name: 'Day 3', yield: 128 }, 
                      { name: 'Day 4', yield: 142 }, { name: 'Day 5', yield: 138 }, { name: 'Day 6', yield: 155 }, { name: 'Day 7', yield: 148 }
                    ]}>
                      <defs>
                        <linearGradient id="yieldGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} />
                      <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }} />
                      <Area type="monotone" dataKey="yield" stroke="#10b981" strokeWidth={5} fillOpacity={1} fill="url(#yieldGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
           </div>

           {/* Activity Timeline Console */}
           <div className="card">
              <div className="flex-between mb-8 pb-4 border-b border-slate-50">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex-center bg-indigo-50 text-indigo-500 rounded-xl"><Activity size={20} /></div>
                    <h3 className="text-xl">Timeline Activity</h3>
                 </div>
                 <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-emerald-500 transition-colors">View Hub</button>
              </div>
              <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                 {(stats?.timeline || []).map((activity, i) => (
                   <div key={i} className="flex-between p-4 rounded-2xl border border-slate-50 hover:border-emerald-100 hover:bg-emerald-50/20 transition-all cursor-default group">
                      <div className="flex gap-4 items-center">
                         <div className={`w-2.5 h-2.5 rounded-full shadow-sm ring-4 ring-opacity-10 ${activity.type === 'animal' ? 'bg-emerald-400 ring-emerald-400' : activity.type === 'milk' ? 'bg-blue-400 ring-blue-400' : 'bg-amber-400 ring-amber-400'}`} />
                         <div>
                            <p className="font-extrabold text-[13px] text-slate-800">{activity.text}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-0.5">{new Date(activity.date).toLocaleDateString('en-IN', {day: 'numeric', month: 'short'})} • SYNCHRONIZED</p>
                         </div>
                      </div>
                      <ChevronRight size={14} className="text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                   </div>
                 ))}
                 {(!stats?.timeline || stats.timeline.length === 0) && (
                   <div className="flex flex-col items-center justify-center py-20 opacity-30">
                      <Box size={48} className="mb-4" />
                      <p className="text-xs font-black uppercase tracking-widest">No Protocol Activity</p>
                   </div>
                 )}
              </div>
           </div>

           {/* Health Monitor Terminal */}
           <div className="card">
              <div className="flex-between mb-8 pb-4 border-b border-slate-50">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex-center bg-red-50 text-red-500 rounded-xl"><Heart size={20} /></div>
                    <h3 className="text-xl">Health Status Hub</h3>
                 </div>
                 <span className="badge badge-success">Optimized</span>
              </div>
              <div className="flex flex-col gap-4">
                 {[
                   { name: 'Cow-102 (Gir)', alert: 'Vaccination Imminent', date: 'Tomorrow' },
                   { name: 'Cow-105 (Sahiwal)', alert: 'Checkup Protocol', date: 'Session 4' }
                 ].map((item, i) => (
                   <div key={i} className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 flex-between">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex-center font-black text-slate-400 text-xs">#{i+1}</div>
                         <div>
                            <p className="font-black text-slate-800 text-sm">{item.name}</p>
                            <p className="text-[11px] text-slate-400 font-bold">{item.alert}</p>
                         </div>
                      </div>
                      <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.date}</div>
                   </div>
                 ))}
                 <button className="btn btn-secondary w-full py-4 mt-4 font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-900 hover:text-white transition-all">Access Health Node</button>
              </div>
           </div>
        </div>
      ) : (
        /* Customer Featured Selection */
        <div className="grid grid-2 gap-8">
           <div className="card border-t-4 border-emerald-500">
              <div className="flex justify-between items-center mb-8">
                 <div>
                    <h4 className="font-heading font-extrabold text-xl">A2 Desi Cow Milk</h4>
                    <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Pure Organic Harvest</p>
                 </div>
                 <div className="text-2xl font-black text-emerald-600">₹95<span className="text-[10px] text-slate-300 ml-1">/ LITRE</span></div>
              </div>
              <div className="w-full h-32 bg-slate-50 rounded-2xl flex items-center justify-center border border-dashed border-slate-200 mb-6">
                 <Droplets size={48} className="text-emerald-100" />
              </div>
              <button className="btn btn-primary w-full py-4 text-sm tracking-wide">Subscribe Monthly Plan</button>
           </div>
           
           <div className="card flex flex-col items-center justify-center py-10">
              <div className="bg-amber-50 p-6 rounded-3xl text-amber-500 mb-8 shadow-sm border border-amber-100"><Star size={48} /></div>
              <h4 className="font-heading font-extrabold text-2xl mb-2">Heritage Rewards</h4>
              <p className="text-sm text-slate-400 text-center max-w-[240px] mb-8 font-medium leading-relaxed">Unlock consistent health perks with our recurring supply audit system.</p>
              <div className="text-5xl font-black text-slate-900 font-heading">1,240 <span className="text-xs text-slate-300 font-bold -ml-1">PTS</span></div>
           </div>
        </div>
      )}
    </div>
  );
}
