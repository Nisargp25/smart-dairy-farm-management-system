import React, { useEffect, useState } from 'react';
import { 
  Plus, User, Phone, DollarSign, Trash2, X, 
  Briefcase, Mail, Search, Filter, MoreVertical, 
  ShieldCheck, Activity, MapPin, ChevronRight, History
} from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Workers() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', role: '', phone: '', email: '', 
    salary: '', status: 'active', experience: '' 
  });

  useEffect(() => { fetchWorkers(); }, []);

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/workers');
      if (res.data.success) {
        setWorkers(res.data.workers);
      }
    } catch (err) {
      toast.error('Failed to sync worker registry');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/workers', formData);
      toast.success('Professional profile integrated');
      setShowModal(false);
      setFormData({ name: '', role: '', phone: '', email: '', salary: '', status: 'active', experience: '' });
      fetchWorkers();
    } catch (err) {
      toast.error('System failed to register worker');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Terminate this profile integration?')) {
      try {
        await api.delete(`/workers/${id}`);
        setWorkers(workers.filter(w => w._id !== id));
        toast.success('Registry updated');
      } catch (err) {
        toast.error('Action failed');
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <header className="mb-12 flex justify-between items-end">
        <div>
           <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-[2px] bg-emerald-500 rounded-full" />
              <p className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.2em]">Personnel Management</p>
           </div>
           <h1 className="text-4xl text-slate-900 mb-2 font-black tracking-tight">Human <span className="serif-italic text-emerald-600 font-normal">Capital</span> Registry</h1>
           <p className="text-slate-500 text-sm font-medium">Manage your specialized farm force and professional payroll.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={20} /> Onboard Professional
        </button>
      </header>

      <div className="flex justify-between items-center mb-10">
        <h3 className="text-2xl text-slate-800 font-black tracking-tight">Worker Directory</h3>
        <div className="flex gap-4">
           <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-premium">
              <Search size={14} className="text-slate-400" />
              <input type="text" placeholder="Search profiles..." className="bg-transparent border-none outline-none text-xs w-48 font-bold" />
           </div>
           <button className="btn btn-secondary"><Filter size={14} /> Refine Audit</button>
        </div>
      </div>

      {loading ? (
        <div className="loading-container py-24"><div className="loader"></div><p className="font-bold text-emerald-600">Synchronizing Workforce...</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {workers.map(worker => (
            <div key={worker._id} className="card group hover:shadow-2xl transition-all p-0 overflow-hidden relative border-slate-100">
              <div className="h-24 bg-gradient-to-r from-emerald-600 to-emerald-800 opacity-10 group-hover:opacity-20 transition-opacity"></div>
              
              <div className="px-8 pb-8 -mt-12 relative z-10">
                <div className="flex justify-between items-end mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-white border-4 border-white shadow-xl flex items-center justify-center font-black text-2xl text-emerald-600">
                    {worker.name[0]}
                  </div>
                  <div className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${worker.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                    {worker.status}
                  </div>
                </div>
                
                <div>
                   <h3 className="text-xl text-slate-900 font-black mb-1">{worker.name}</h3>
                   <p className="text-[10px] text-emerald-600 font-black uppercase tracking-[0.2em] mb-6">{worker.role}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                   <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">Monthly</p>
                      <p className="text-sm font-black text-slate-800">₹{worker.salary}</p>
                   </div>
                   <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">Exp.</p>
                      <p className="text-sm font-black text-slate-800">{worker.experience || '3'}Y+</p>
                   </div>
                </div>

                <div className="space-y-3 mb-8">
                   <div className="flex items-center gap-3 text-slate-400">
                      <Phone size={14} className="text-slate-300" />
                      <span className="text-xs font-bold">{worker.phone || 'Contact pending'}</span>
                   </div>
                   <div className="flex items-center gap-3 text-slate-400">
                      <Mail size={14} className="text-slate-300" />
                      <span className="text-xs font-bold truncate">{worker.email || 'Email not linked'}</span>
                   </div>
                </div>

                <div className="flex gap-3">
                   <button className="btn btn-secondary w-full py-3 text-[10px] uppercase font-black tracking-widest">Profile</button>
                   <button onClick={() => handleDelete(worker._id)} className="w-12 h-12 flex-center bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-red-100"><Trash2 size={18} /></button>
                </div>
              </div>
              
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                 <div className="w-8 h-8 rounded-lg bg-white/50 backdrop-blur-sm flex-center cursor-pointer hover:bg-white"><MoreVertical size={16} /></div>
              </div>
            </div>
          ))}
          {workers.length === 0 && (
            <div className="card col-span-full border-dashed py-24 flex-center flex-col opacity-30">
               <User size={48} className="mb-4" />
               <p className="text-xs font-black uppercase tracking-widest">No Personnel Authenticated</p>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex-center z-[2000] p-8">
          <div className="card animate-fade-in shadow-2xl w-full max-w-2xl p-16 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px]" />
             
            <div className="flex justify-between items-center mb-12 relative z-10">
              <div>
                 <h2 className="text-4xl text-slate-900 mb-2 font-black tracking-tight">Onboard <br/><span className="serif-italic text-emerald-600 font-normal">Professional</span> Talent</h2>
                 <p className="text-sm text-slate-400 font-medium">Integrate a new specialized farm operative profile.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-300 hover:text-slate-900 flex-center transition-colors"><X size={28} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-8 relative z-10">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 ml-1">Legal Nomenclature</label>
                <input required className="form-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Rajesh Kumar" />
              </div>
              
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 ml-1">Assigned Protocol Role</label>
                  <input required className="form-input" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} placeholder="e.g. Senior Herdsman" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 ml-1">Monthly Remuneration (₹)</label>
                  <input type="number" required className="form-input font-black" value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} placeholder="0.0" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 ml-1">Primary Communication Node</label>
                  <input className="form-input" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+91 XXXX XXX XXX" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 ml-1">Digital Identity (Email)</label>
                  <input type="email" className="form-input" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="name@farm.registry" />
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                 <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary w-full py-4 uppercase text-xs font-black tracking-widest">Abort Process</button>
                 <button type="submit" className="btn btn-primary w-full py-4 uppercase text-xs font-black tracking-widest shadow-xl">Onboard Professional</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
