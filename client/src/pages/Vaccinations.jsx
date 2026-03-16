import React, { useEffect, useState } from 'react';
import { 
  Plus, Calendar, Trash2, Edit, X, 
  ShieldCheck, Activity, AlertTriangle, ChevronRight,
  Filter, Search, Droplets, Info, CheckCircle2,
  Syringe, Heart, ClipboardCheck, History
} from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Vaccinations() {
  const [vaccinations, setVaccinations] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ 
    animal: '', 
    vaccineName: '', 
    date: new Date().toISOString().split('T')[0], 
    nextDueDate: '', 
    administeredBy: '', 
    notes: '' 
  });

  useEffect(() => {
    fetchVaccinations();
    fetchAnimals();
  }, []);

  const fetchVaccinations = async () => {
    try {
      const res = await api.get('/vaccinations');
      setVaccinations(res.data.vaccinations);
    } catch (err) {
      toast.error('Registry sync failure');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnimals = async () => {
    try {
      const res = await api.get('/animals');
      setAnimals(res.data.animals);
    } catch (err) {
      console.error('Failed to resolve livestock inventory');
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData._id) {
        await api.put(`/vaccinations/${formData._id}`, formData);
        toast.success('Protocol update authorized');
      } else {
        await api.post('/vaccinations', formData);
        toast.success('New Protocol Administrative Record Logged');
      }
      setShowModal(false);
      setFormData({ 
        animal: '', 
        vaccineName: '', 
        date: new Date().toISOString().split('T')[0], 
        nextDueDate: '', 
        administeredBy: '', 
        notes: '' 
      });
      fetchVaccinations();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Administrative failure');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Erase this immunization record permanently?')) {
      try {
        await api.delete(`/vaccinations/${id}`);
        setVaccinations(vaccinations.filter(v => v._id !== id));
        toast.success('Record purged from health registry');
      } catch (err) {
        toast.error('Deletion operation failed');
      }
    }
  };

  // Status computation for professional badges
  const getStatusBadge = (nextDate) => {
    const today = new Date();
    const due = new Date(nextDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return <span className="badge badge-danger" style={{ fontWeight: 800 }}>OVERDUE ({Math.abs(diffDays)}D)</span>;
    if (diffDays < 7) return <span className="badge badge-warning" style={{ fontWeight: 800 }}>DUE SOON ({diffDays}D)</span>;
    return <span className="badge badge-success" style={{ fontWeight: 800 }}>COMPLETED</span>;
  };

  return (
    <div className="animate-fade">
      {/* Header Section */}
      <header className="mb-12 flex justify-between items-end">
        <div>
          <p style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Bovine Immunology</p>
          <h1 className="section-title">Health <span style={{ color: 'var(--primary)' }}>Protocol</span> Registry 🛡️</h1>
          <p className="section-subtitle">Track and manage immunization cycles for the entire herd.</p>
        </div>
        <div className="flex gap-4">
          <button className="btn btn-secondary"><History size={18} /> Protocol History</button>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={20} /> Auth Entry
          </button>
        </div>
      </header>

      {/* Snapshot Section */}
      <div className="stats-grid mb-12">
        <div className="card">
          <div className="flex justify-between items-start mb-6">
             <div style={{ background: 'var(--primary-soft)', padding: '0.75rem', borderRadius: '12px' }}><ShieldCheck size={22} color="var(--primary)" /></div>
             <span className="badge badge-success">Healthy Fleet</span>
          </div>
          <p className="stat-label">Total Valid Immunizations</p>
          <h2 className="stat-value">{vaccinations.length} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Protocols</span></h2>
        </div>
        
        <div className="card" style={{ borderLeft: '4px solid #ef4444' }}>
          <div className="flex justify-between items-start mb-6">
             <div style={{ background: '#fee2e2', padding: '0.75rem', borderRadius: '12px' }}><AlertTriangle size={22} color="#ef4444" /></div>
             <span className="badge badge-danger">Immediate Action</span>
          </div>
          <p className="stat-label">Overdue Protocols</p>
          <h2 className="stat-value" style={{ color: '#ef4444' }}>{vaccinations.filter(v => new Date(v.nextDueDate) < new Date()).length}</h2>
        </div>

        <div className="card">
          <div className="flex justify-between items-start mb-6">
             <div style={{ background: 'var(--secondary-soft)', padding: '0.75rem', borderRadius: '12px' }}><History size={22} color="var(--secondary)" /></div>
             <span className="badge badge-info">Next 30 Days</span>
          </div>
          <p className="stat-label">Upcoming Cycles</p>
          <h2 className="stat-value">14 <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Scheduled</span></h2>
        </div>
      </div>

      {/* Table Interface */}
      <div className="flex justify-between items-center mb-8">
        <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)' }}>Administrative Ledger</h3>
        <div style={{ display: 'flex', gap: '0.5rem', background: 'white', padding: '0.4rem', border: '1px solid var(--border-subtle)', borderRadius: '10px' }}>
           <button className="btn btn-ghost" style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}><Filter size={16} /> Filter by Breed</button>
           <button className="btn btn-ghost" style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}><Search size={16} /> Query Vaccine</button>
        </div>
      </div>

      {loading ? (
        <div className="loading-container"><div className="loader"></div><p>Synchronizing Health Logs...</p></div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>SUBJECT IDENTITY</th>
                <th>VACCINE COMPOUND</th>
                <th>ADMINISTERED ON</th>
                <th>PROTOCOL EXPIRY</th>
                <th>AUTH STATUS</th>
                <th style={{ textAlign: 'right' }}>OPERATIONS</th>
              </tr>
            </thead>
            <tbody>
              {vaccinations.map(v => (
                <tr key={v._id}>
                  <td>
                    <div className="flex items-center gap-3">
                       <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--bg-main)', color: 'var(--primary)', display: 'grid', placeItems: 'center', border: '1px solid var(--border-subtle)' }}>
                         <Activity size={18} />
                       </div>
                       <div>
                          <p style={{ fontWeight: 800, fontSize: '0.9rem' }}>{v.animal?.name}</p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>#{v.animal?.animalId}</p>
                       </div>
                    </div>
                  </td>
                  <td style={{ fontWeight: 700, color: 'var(--text-dim)' }}>{v.vaccineName}</td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>{new Date(v.date).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                  <td style={{ fontWeight: 800, color: new Date(v.nextDueDate) < new Date() ? '#ef4444' : 'inherit', fontSize: '0.85rem' }}>{new Date(v.nextDueDate).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                  <td>{getStatusBadge(v.nextDueDate)}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="flex gap-3 justify-end">
                       <button className="btn btn-ghost" style={{ padding: '0.4rem', borderRadius: '8px' }}><Edit size={16} /></button>
                       <button onClick={() => handleDelete(v._id)} className="btn btn-ghost" style={{ padding: '0.4rem', borderRadius: '8px', color: '#ef4444' }}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {vaccinations.length === 0 && (
                <tr>
                   <td colSpan="6" style={{ height: '300px', textAlign: 'center' }}>
                      <div style={{ opacity: 0.5 }}>
                        <Syringe size={48} style={{ margin: '0 auto 1.5rem', display: 'block' }} />
                        <p style={{ fontWeight: 700 }}>Registry Empty.</p>
                        <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Start your herd's health tracking by adding a vaccine record.</p>
                      </div>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Auth Entry Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '2rem' }}>
          <div className="card animate-fade shadow-premium" style={{ width: '100%', maxWidth: '640px', padding: '4rem' }}>
            <div className="flex justify-between items-center mb-10">
              <div>
                 <h2 style={{ fontSize: '1.75rem' }}>Protocol Authorization</h2>
                 <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Define a new health immunization record for livestock.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="btn btn-ghost" style={{ padding: '0.5rem' }}><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="form-group">
                <label className="label">TARGET LIVESTOCK</label>
                <select name="animal" required value={formData.animal} onChange={handleChange}>
                  <option value="">-- Choose Subject from Registry --</option>
                  {animals.map(a => <option key={a._id} value={a._id}>{a.name} (Tag: {a.animalId})</option>)}
                </select>
              </div>
              
              <div className="form-group">
                <label className="label">VACCINE COMPOUND NAME</label>
                <input type="text" name="vaccineName" required value={formData.vaccineName} onChange={handleChange} placeholder="e.g. Foot & Mouth Disease (FMD)" />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="form-group">
                  <label className="label">ADMINISTRATION DATE</label>
                  <input type="date" name="date" required value={formData.date} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="label">PROTOCOL EXPIRY (NEXT DUE)</label>
                  <input type="date" name="nextDueDate" required value={formData.nextDueDate} onChange={handleChange} />
                </div>
              </div>

              <div className="form-group">
                <label className="label">CERTIFIED PERSONNEL (ADMINISTERED BY)</label>
                <input type="text" name="administeredBy" required value={formData.administeredBy} onChange={handleChange} placeholder="Consultant Vet Name" />
              </div>

              <div className="mt-8 flex gap-4">
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary w-full">Cancel Authorization</button>
                  <button type="submit" className="btn btn-primary w-full btn-lg">Finalize Health Entry</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
