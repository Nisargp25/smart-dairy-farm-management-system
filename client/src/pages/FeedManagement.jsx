import React, { useEffect, useState } from 'react';
import { 
  Plus, Package, Trash2, AlertTriangle, X, 
  Search, Filter, ShoppingBag, TrendingUp, 
  Layers, ChevronRight, Activity, Zap, Info
} from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function FeedManagement() {
  const [feeds, setFeeds] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ 
    feedName: '', category: 'grain', quantity: '', 
    unit: 'kg', costPerUnit: '' 
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [feedRes, recRes] = await Promise.all([
        api.get('/feed').catch(() => ({ data: { success: true, inventory: [] } })),
        api.get('/feed/recommendations').catch(() => ({ data: { success: true, recommendations: [] } }))
      ]);
      
      if (feedRes.data.success) {
        setFeeds(feedRes.data.inventory || []);
      }
      if (recRes.data.success) {
        setRecommendations(recRes.data.recommendations || []);
      }
    } catch (err) {
      toast.error('Failed to sync inventory registry');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/feed', formData);
      toast.success('Stock inventory updated');
      setShowModal(false);
      setFormData({ feedName: '', category: 'grain', quantity: '', unit: 'kg', costPerUnit: '' });
      fetchData();
    } catch (err) {
      toast.error('Inventory synchronization failed');
    }
  };

  const totalValue = feeds.reduce((sum, f) => sum + (parseFloat(f.quantity) * parseFloat(f.costPerUnit) || 0), 0);
  const lowStockCount = feeds.filter(f => f.quantity < 50).length;

  return (
    <div className="animate-fade-in">
      <header className="mb-12 flex justify-between items-end">
        <div>
           <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-[2px] bg-emerald-500 rounded-full" />
              <p className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.2em]">Resource Control</p>
           </div>
           <h1 className="text-4xl text-slate-900 mb-2 font-black tracking-tight">Nutrition <span className="serif-italic text-emerald-600 font-normal">Reserve</span> Control</h1>
           <p className="text-slate-500 text-sm font-medium">Control and analyze your livestock feed inventory and procurement.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={20} /> Purchase Stock
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
         <div className="card hover:shadow-xl transition-all duration-300 border-slate-100">
            <div className="flex justify-between items-center mb-6">
               <div className="p-3 bg-amber-50 rounded-xl text-amber-500"><Package size={20} /></div>
               <span className="text-[10px] uppercase font-black tracking-[0.2em] text-amber-600">Snapshot</span>
            </div>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-2">Total Reserve</p>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">{feeds.reduce((sum, f) => sum + (parseFloat(f.quantity) || 0), 0).toLocaleString()} <span className="text-xs font-medium opacity-40">KG</span></h2>
         </div>

         <div className="card hover:shadow-xl transition-all duration-300 border-slate-100">
            <div className="flex justify-between items-center mb-6">
               <div className="p-3 bg-red-50 rounded-xl text-red-500"><AlertTriangle size={20} /></div>
               <span className="text-[10px] uppercase font-black tracking-[0.2em] text-red-600">Alert</span>
            </div>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-2">Low Inventory</p>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">{lowStockCount} <span className="text-xs font-medium opacity-40">ITEMS</span></h2>
         </div>

         <div className="card hover:shadow-xl transition-all duration-300 border-slate-100">
            <div className="flex justify-between items-center mb-6">
               <div className="p-3 bg-emerald-50 rounded-xl text-emerald-500"><ShoppingBag size={20} /></div>
               <span className="text-[10px] uppercase font-black tracking-[0.2em] text-emerald-600">Valuation</span>
            </div>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-2">Asset Value</p>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">₹{totalValue.toLocaleString()}</h2>
         </div>

         <div className="card hover:shadow-xl transition-all duration-300 border-slate-100">
            <div className="flex justify-between items-center mb-6">
               <div className="p-3 bg-indigo-50 rounded-xl text-indigo-500"><Activity size={20} /></div>
               <span className="text-[10px] uppercase font-black tracking-[0.2em] text-indigo-600">Protocol</span>
            </div>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-2">Flow Status</p>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">OPTIMAL</h2>
         </div>
      </div>

      <div className="mb-12">
         <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-emerald-50 text-emerald-500 rounded-lg"><Zap size={20} /></div>
            <h3 className="text-2xl text-slate-800 font-black tracking-tight">Smart AI Recommendations</h3>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recommendations.slice(0, 3).map((rec, i) => (
              <div key={i} className="card bg-slate-900 text-white border-none shadow-xl transform hover:-translate-y-1 transition-all">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-sm border border-emerald-500/30">{rec.animalName[0]}</div>
                    <div className="font-extrabold text-sm text-emerald-400 tracking-tight">{rec.animalName}</div>
                 </div>
                 <div className="font-bold text-lg text-slate-50 mb-4 leading-relaxed">{rec.recommendation}</div>
                 <div className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-emerald-500" />
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{rec.reason}</p>
                 </div>
              </div>
            ))}
            {recommendations.length === 0 && (
              <div className="card col-span-3 text-center py-12 text-slate-400 text-xs font-black uppercase tracking-[0.2em] border-dashed">Initializing Smart Extraction Analysis...</div>
            )}
         </div>
      </div>

      <div className="flex justify-between items-center mb-10">
        <h3 className="text-2xl text-slate-800 font-black tracking-tight">Reserve Registry</h3>
        <div className="flex gap-4">
           <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-premium">
              <Search size={14} className="text-slate-400" />
              <input type="text" placeholder="Search registry..." className="bg-transparent border-none outline-none text-xs w-48 font-bold" />
           </div>
           <button className="btn btn-secondary"><Filter size={14} /> Refine Audit</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {feeds.map(feed => (
          <div key={feed._id} className="card group hover:shadow-2xl transition-all p-0 overflow-hidden relative">
            <div className="p-8 pb-4">
              <div className="flex justify-between items-start mb-8">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex-center shadow-inner group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  <Layers size={24} />
                </div>
                {feed.quantity < 50 && (
                  <span className="badge badge-danger">CRITICAL</span>
                )}
              </div>
              
              <div>
                 <p className="text-[10px] text-emerald-600 font-black uppercase tracking-[0.2em] mb-1">{feed.category} Protocol</p>
                 <h3 className="text-xl text-slate-900 font-black mb-6 group-hover:text-emerald-600 transition-colors">{feed.feedName}</h3>
              </div>
            </div>

            <div className="px-8 pb-8 pt-6 border-t border-slate-50 bg-slate-50/50">
               <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">Available Reserve</p>
                    <div className="text-2xl font-black text-slate-800">
                      {feed.quantity} <span className="text-xs font-bold opacity-30 uppercase">{feed.unit}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">Unit Value</p>
                    <div className="font-extrabold text-emerald-600">₹{feed.costPerUnit}</div>
                  </div>
               </div>
            </div>
            
            <button className="w-full py-4 bg-white hover:bg-slate-900 hover:text-white text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] border-t border-slate-100 transition-all flex items-center justify-center gap-2">
               Access Allocation <ChevronRight size={14} />
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex-center z-[2000] p-8">
          <div className="card animate-fade-in shadow-2xl w-full max-w-xl p-16 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 blur-[80px]" />
             
            <div className="flex justify-between items-center mb-12 relative z-10">
              <div>
                 <h2 className="text-4xl text-slate-900 mb-2 font-black tracking-tight">Supply <br/><span className="serif-italic text-emerald-600 font-normal">Audit</span> Entry</h2>
                 <p className="text-sm text-slate-400 font-medium">Authorize a new procurement cycle.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-300 hover:text-slate-900 flex-center transition-colors"><X size={28} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-8 relative z-10">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 ml-1">Resource Nomenclature</label>
                <input required className="form-input" value={formData.feedName} onChange={e => setFormData({...formData, feedName: e.target.value})} placeholder="e.g. High-Protein Silage" />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 ml-1">Classification Cluster</label>
                <select className="form-input" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  <option value="grain">Grain Protocols</option>
                  <option value="hay">Roughage / Hay Cluster</option>
                  <option value="concentrate">Special Concentrate</option>
                  <option value="mineral">Biological Minerals</option>
                  <option value="other">Unclassified Registry</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 ml-1">Reserve Volume</label>
                  <input type="number" required className="form-input" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 ml-1">Protocol Unit</label>
                  <select className="form-input" value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})}>
                    <option value="kg">KILOGRAMS (KG)</option>
                    <option value="ton">TONNES (TON)</option>
                    <option value="bag">BAGS (STD)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 ml-1">Valuation (per unit)</label>
                <input type="number" required className="form-input" value={formData.costPerUnit} onChange={e => setFormData({...formData, costPerUnit: e.target.value})} />
              </div>

              <div className="mt-8 flex gap-4">
                 <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary w-full py-4 uppercase text-xs font-black tracking-widest">Abort Process</button>
                 <button type="submit" className="btn btn-primary w-full py-4 uppercase text-xs font-black tracking-widest shadow-xl">Commit Stock</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
