import React, { useEffect, useState } from 'react';
import { 
  Plus, Search, Filter, QrCode, Trash2, Edit, X, 
  ExternalLink, LayoutGrid, List, FileDown, MoreHorizontal,
  ChevronRight, ArrowRight, Activity, Calendar, Award,
  Info, QrCode as QrIcon, ShieldCheck, Heart, Scale, FileText,
  Share2, Edit3, Leaf, Droplets
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Animals() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', animalId: '', breed: '', gender: 'female', age: '', weight: '', healthStatus: 'healthy', photo: null 
  });
  const [selectedQR, setSelectedQR] = useState(null);

  useEffect(() => {
    fetchAnimals();
  }, []);

  const fetchAnimals = async () => {
    try {
      const res = await api.get('/animals');
      setAnimals(res.data.animals);
    } catch (err) {
      toast.error('Asset Synchronization Failure');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData._id) {
        await api.put(`/animals/${formData._id}`, formData);
        toast.success('Asset Identity Synchronized');
      } else {
        const res = await api.post('/animals', formData);
        if (formData.photo) {
          const photoData = new FormData();
          photoData.append('photo', formData.photo);
          await api.post(`/animals/${res.data.animal._id}/photo`, photoData);
        }
        toast.success('New Asset Registered Successfully');
      }

      setShowModal(false);
      setFormData({ name: '', animalId: '', breed: '', gender: 'female', age: '', weight: '', healthStatus: 'healthy', photo: null });
      fetchAnimals();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registry Update Denied');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Erase this asset record permanently?')) {
      try {
        await api.delete(`/animals/${id}`);
        setAnimals(animals.filter(a => a._id !== id));
        toast.success('Asset Purged from Registry');
      } catch (err) {
        toast.error('Deletion operation failed');
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <header className="mb-12 flex justify-between items-end">
        <div>
           <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-[2px] bg-emerald-500 rounded-full" />
              <p className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.2em]">Livestock Registry</p>
           </div>
           <h1 className="text-4xl text-slate-900 mb-2 font-black tracking-tight">Farm <span className="serif-italic text-emerald-600 font-normal">Assets</span> Hub</h1>
           <p className="text-slate-500 text-sm font-medium">Comprehensive management of your high-yield bovine assets.</p>
        </div>
        <div className="flex gap-4">
           <button className="btn btn-secondary"><FileDown size={18} /> Export Registry</button>
           <button className="btn btn-primary" onClick={() => setShowModal(true)}>
             <Plus size={20} /> Register Asset
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
         <div className="lg:col-span-2 flex items-center gap-3 bg-white px-5 py-4 rounded-2xl border border-slate-200 shadow-premium focus-within:shadow-lg transition-all">
            <Search size={18} className="text-slate-400" />
            <input type="text" placeholder="Access asset by nomenclature, breed, or identity..." className="bg-transparent border-none outline-none text-sm w-full font-medium" />
         </div>
         <button className="btn btn-secondary h-full rounded-2xl border-slate-200"><Filter size={18} /> Protocol Filter</button>
      </div>

      {loading ? (
        <div className="loading-container"><div className="loader"></div><p className="font-bold text-emerald-600">Synchronizing Local Assets...</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Dashboard Prompt Card */}
          <div 
             onClick={() => setShowModal(true)}
             className="card flex flex-col items-center justify-center border-dashed cursor-pointer hover:border-emerald-500 transition-colors"
             style={{ minHeight: '340px', border: '2px dashed #e2e8f0', background: 'rgba(52, 211, 153, 0.02)' }}
          >
             <div className="bg-emerald-50 p-6 rounded-full text-emerald-500 mb-6 transition-transform hover:scale-110"><Plus size={40} /></div>
             <p className="font-heading font-extrabold text-xl text-slate-900 uppercase">Register New Subject</p>
             <p className="text-[10px] text-slate-400 font-bold tracking-widest mt-2">INITIALIZE NEW IDENTITY</p>
          </div>

          {animals.map((animal) => (
            <div key={animal._id} className="card group p-0 overflow-hidden relative border-slate-200 hover:shadow-2xl hover:border-emerald-200 transition-all duration-500">
              <div className="bg-slate-900 h-24 relative overflow-hidden flex-center">
                 <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500 to-transparent"></div>
                 {animal.photoUrl ? (
                    <img src={`http://localhost:5000${animal.photoUrl}`} alt={animal.name} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" />
                 ) : (
                    <div className="relative z-10 w-12 h-12 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl flex-center transform group-hover:rotate-12 transition-transform duration-500">
                      <Leaf size={24} className="text-emerald-400" />
                    </div>
                 )}
                 <div className="absolute top-4 right-4 z-20">
                    <QrIcon onClick={() => setSelectedQR(animal)} size={18} className="text-white/40 hover:text-white transition-colors cursor-pointer" />
                 </div>
              </div>


              <div className="p-8 pb-6">
                 <div className="flex justify-between items-start mb-6">
                    <div>
                       <h3 className="text-2xl text-slate-800 mb-1">{animal.name}</h3>
                       <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-[0.2em]">Registry ID: #{animal.animalId}</p>
                    </div>
                    <span className={`badge ${animal.healthStatus === 'healthy' || animal.healthStatus === 'Healthy' ? 'badge-success' : 'badge-warning'} shadow-sm capitalize`}>{animal.healthStatus}</span>

                 </div>

                 <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100 group-hover:bg-white transition-colors">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Subject Age</p>
                       <p className="font-extrabold text-slate-700 text-lg">{animal.age} <span className="text-xs font-medium opacity-40">YR</span></p>
                    </div>
                    <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100 group-hover:bg-white transition-colors">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Mass</p>
                       <p className="font-extrabold text-slate-700 text-lg">{animal.weight} <span className="text-xs font-medium opacity-40">KG</span></p>
                    </div>
                 </div>

                 <div className="mt-4 pt-4 border-t border-slate-50 flex gap-4">
                    <button onClick={() => { setFormData(animal); setShowModal(true); }} className="btn btn-secondary w-full h-12 text-[10px] font-black uppercase tracking-widest shadow-sm hover:shadow-md"><Edit size={14} className="mr-2 opacity-50" /> Modify Proxy</button>
                    <button onClick={() => handleDelete(animal._id)} className="w-12 h-12 rounded-xl bg-red-50 text-red-400 flex-center hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16} /></button>
                 </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Registry Authorization Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '2rem' }}>
          <div className="card animate-fade-in shadow-2xl w-full max-w-4xl p-16 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 blur-[80px]" />
             
            <div className="flex justify-between items-center mb-12 relative z-10">
              <div>
                 <h2 className="text-4xl text-slate-900 mb-2 font-black tracking-tight">Authorized <br/><span className="serif-italic text-emerald-600 font-normal">Asset</span> Entry</h2>
                 <p className="text-sm text-slate-400 font-medium">Define a new high-yield asset within the global dairy registry.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-300 hover:text-slate-900 flex-center transition-colors"><X size={28} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-8 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 ml-1">Asset Nomenclature</label>
                  <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="e.g. Heifer - Ganga" className="form-input" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 ml-1">Registry Tag ID</label>
                  <input type="text" name="animalId" required value={formData.animalId} onChange={handleChange} placeholder="e.g. IN-DH-1002" className="form-input" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 ml-1">Breed Classification</label>
                  <input type="text" name="breed" required value={formData.breed} onChange={handleChange} placeholder="e.g. Gir Pureheart" className="form-input" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 ml-1">Biological Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} className="form-input cursor-pointer">
                    <option value="female">Female (Cow)</option>
                    <option value="male">Male (Bull)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 ml-1">Current Health Status</label>
                  <select name="healthStatus" value={formData.healthStatus} onChange={handleChange} className="form-input cursor-pointer">
                    <option value="healthy">Healthy (Optimal)</option>
                    <option value="sick">Under Observation (Sick)</option>
                    <option value="recovering">Recovering Protocol</option>
                    <option value="pregnant">Gestating / Pregnant</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 ml-1">Subject Age (Yrs)</label>
                  <input type="number" name="age" required value={formData.age} onChange={handleChange} className="form-input" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 ml-1">Calculated Mass (Kg)</label>
                  <input type="number" name="weight" required value={formData.weight} onChange={handleChange} className="form-input" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 ml-1">Asset Identity Photo</label>
                  <input type="file" onChange={(e) => setFormData({...formData, photo: e.target.files[0]})} className="form-input pt-2" />
                </div>
              </div>


              <div className="mt-8 flex gap-4">
                 <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary w-full py-4 uppercase text-xs font-black tracking-widest">Abort Process</button>
                 <button type="submit" className="btn btn-primary w-full py-4 uppercase text-xs font-black tracking-widest shadow-xl">Commit Identity</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Code Inspection Modal */}
      {selectedQR && (
        <div onClick={() => setSelectedQR(null)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl flex-center z-[3000] p-8">
           <div onClick={e => e.stopPropagation()} className="card bg-white p-12 max-w-sm w-full text-center">
              <h3 className="text-2xl font-black mb-6 uppercase tracking-tight">Identity Token</h3>
              <div className="bg-slate-50 p-6 rounded-3xl mb-6 border border-slate-100 shadow-inner">
                 <img src={selectedQR.qrCode} alt="Asset QR" className="w-full h-auto rounded-xl" />
              </div>
              <p className="font-extrabold text-slate-800 mb-2">{selectedQR.name}</p>
              <p className="text-[10px] text-slate-400 font-black tracking-widest uppercase mb-8">Registry ID: {selectedQR.animalId}</p>
              <button onClick={() => setSelectedQR(null)} className="btn btn-primary w-full py-4">Dismiss Protocol</button>
           </div>
        </div>
      )}
    </div>
  );
}
