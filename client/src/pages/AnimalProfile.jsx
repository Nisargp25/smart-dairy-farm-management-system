import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Activity, Calendar, Award, 
  Info, QrCode, ShieldCheck, Heart, 
  Scale, FileText, ChevronRight, Share2,
  Trash2, Edit3, Clock, Download, AlertCircle
} from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function AnimalProfile() {
  const { id } = useParams();
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnimal();
  }, [id]);

  const fetchAnimal = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/animals/${id}`);
      if (res.data.success) {
        setAnimal(res.data.animal);
      }
    } catch (err) {
      toast.error('Failed to access biological profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '10rem', textAlign: 'center' }}><div className="loader"></div></div>;
  if (!animal) return (
    <div className="card text-center py-20" style={{ background: 'var(--bg-glass)', border: '1px dashed var(--border)' }}>
      <AlertCircle size={48} color="var(--muted)" style={{ margin: '0 auto 1rem' }} />
      <h3 style={{ color: 'var(--muted)' }}>Identity not found in registry.</h3>
      <Link to="/owner/animals" className="btn btn-primary btn-sm mt-6">Return to Herd</Link>
    </div>
  );

  return (
    <div className="animate-fade" style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div className="flex justify-between items-center mb-8">
        <Link to="/owner/animals" className="flex items-center gap-2" style={{ color: 'var(--text-light)', fontSize: '0.9rem', fontWeight: 600 }}>
          <ArrowLeft size={16} /> HERD REGISTRY
        </Link>
        <div className="flex gap-2">
           <button className="btn btn-ghost btn-sm" title="Share Profile"><Share2 size={16} /></button>
           <button className="btn btn-ghost btn-sm" title="Edit Registry"><Edit3 size={16} /></button>
           <button className="btn btn-ghost btn-sm" style={{color: 'var(--danger)'}} title="Strike Record"><Trash2 size={16} /></button>
        </div>
      </div>

      <div className="card p-0 overflow-hidden mb-8" style={{ background: 'var(--bg-glass)', border: '1px solid var(--border)' }}>
        <div style={{ height: '120px', background: 'var(--primary)', opacity: 0.05 }}></div>
        <div style={{ padding: '0 2rem 2rem', marginTop: '-60px' }}>
          <div className="flex items-end gap-6">
            <div style={{ 
              width: '140px', height: '140px', borderRadius: 'var(--radius-md)', 
              background: 'white', border: '4px solid white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <Award size={72} color="var(--primary)" />
            </div>
            <div className="flex-grow pb-2">
              <div className="flex items-center gap-4 mb-2">
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>{animal.name}</h1>
                <span className={`badge badge-${animal.healthStatus === 'healthy' ? 'success' : 'warning'}`} style={{ fontSize: '0.75rem', fontWeight: 800 }}>
                  {animal.healthStatus.toUpperCase()}
                </span>
              </div>
              <div style={{ color: 'var(--primary)', fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <span>ID: #{animal.animalId}</span>
                <span style={{ color: 'var(--muted)', fontWeight: 400 }}>•</span>
                <span>{animal.breed}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-3 gap-8">
        <div className="card" style={{ background: 'var(--bg-glass)', border: '1px solid var(--border)' }}>
          <h3 className="section-title mb-6 flex items-center gap-2"><Info size={18} /> Biological Metrics</h3>
          <div className="flex flex-col gap-4">
             <div className="flex justify-between items-center py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                <div className="flex items-center gap-3" style={{ fontSize: '0.85rem', color: 'var(--muted)', fontWeight: 600 }}>
                   <Activity size={14} /> GENETIC BREED
                </div>
                <span style={{ fontWeight: 800 }}>{animal.breed}</span>
             </div>
             <div className="flex justify-between items-center py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                <div className="flex items-center gap-3" style={{ fontSize: '0.85rem', color: 'var(--muted)', fontWeight: 600 }}>
                   <Calendar size={14} /> CHRONOLOGICAL AGE
                </div>
                <span style={{ fontWeight: 800 }}>{animal.age} Years</span>
             </div>
             <div className="flex justify-between items-center py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                <div className="flex items-center gap-3" style={{ fontSize: '0.85rem', color: 'var(--muted)', fontWeight: 600 }}>
                   <Heart size={14} /> REPRODUCTIVE SEX
                </div>
                <span style={{ fontWeight: 800, textTransform: 'capitalize' }}>{animal.gender}</span>
             </div>
             <div className="flex justify-between items-center py-3">
                <div className="flex items-center gap-3" style={{ fontSize: '0.85rem', color: 'var(--muted)', fontWeight: 600 }}>
                   <Scale size={14} /> CURRENT WEIGHT
                </div>
                <span style={{ fontWeight: 800 }}>{animal.weight ? `${animal.weight} kg` : 'Protocol Pending'}</span>
             </div>
          </div>
        </div>

        <div className="card" style={{ background: 'var(--bg-glass)', border: '1px solid var(--border)' }}>
          <h3 className="section-title mb-6 flex items-center gap-2"><ShieldCheck size={18} /> Audit Integrity</h3>
          <div className="flex flex-col gap-4">
             <div className="flex justify-between items-center py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                <div className="flex items-center gap-3" style={{ fontSize: '0.85rem', color: 'var(--muted)', fontWeight: 600 }}>
                   <Clock size={14} /> REGISTRATION
                </div>
                <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>{new Date(animal.createdAt).toLocaleDateString()}</span>
             </div>
             <div>
                <div className="flex items-center gap-3 mb-3" style={{ fontSize: '0.85rem', color: 'var(--muted)', fontWeight: 600 }}>
                   <FileText size={14} /> OBSERVATIONS
                </div>
                <div className="card" style={{ padding: '1rem', background: 'rgba(0, 0, 0, 0.02)', border: 'none', minHeight: '100px' }}>
                   <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', lineHeight: 1.6 }}>
                      {animal.notes || 'No specialized observations recorded for this biological subject.'}
                   </p>
                </div>
             </div>
          </div>
        </div>

        <div className="card" style={{ background: 'var(--bg-glass)', border: '1px solid var(--border)', textAlign: 'center' }}>
          <h3 className="section-title mb-6 flex items-center gap-2 justify-center"><QrCode size={18} /> Digital Identity</h3>
          <div style={{ 
            background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-md)', 
            border: '1px solid var(--border)', display: 'inline-block',
            boxShadow: 'var(--shadow-sm)'
          }}>
             <img src={animal.qrCode} alt="Identity QR" style={{ width: '160px', height: '160px', objectFit: 'contain' }} />
          </div>
          <p className="mt-6" style={{ fontSize: '0.75rem', color: 'var(--muted)', lineHeight: 1.5 }}>
            Authorized Identity QR for mobile interaction and rapid inventory synchronization.
          </p>
          <button className="btn btn-outline btn-sm w-full mt-6" style={{ gap: '0.5rem' }}>
             <Download size={14} /> Export Identity Link
          </button>
        </div>
      </div>

      <div className="mt-10 card" style={{ background: 'rgba(30, 77, 43, 0.05)', border: 'none', cursor: 'pointer' }}>
         <div className="flex justify-between items-center px-4 py-2">
            <div className="flex items-center gap-6">
               <div style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 800 }}>PRODUCTION METRICS</div>
               <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary)' }}>342 L Total Yield</div>
               <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary)' }}>Avg. 12.4 L/Day</div>
            </div>
            <ChevronRight size={20} color="var(--primary)" />
         </div>
      </div>
    </div>
  );
}
