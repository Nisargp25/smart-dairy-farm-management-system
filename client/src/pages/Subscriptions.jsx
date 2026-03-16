import React, { useEffect, useState } from 'react';
import { 
  History, Calendar, CheckCircle, Clock, 
  Search, Filter, ExternalLink, IndianRupee,
  ChevronRight, Box, AlertCircle, Info, FileText,
  Zap, CalendarCheck, ShieldCheck, Heart
} from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubs();
  }, []);

  const fetchSubs = async () => {
    try {
      const res = await api.get('/shop/subscriptions');
      setSubscriptions(res.data.subscriptions);
    } catch (err) {
      toast.error('Subscription registry sync failure');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active': return <span className="badge badge-success">ACTIVE PLAN</span>;
      case 'pending': return <span className="badge badge-warning">PENDING AUTH</span>;
      case 'cancelled': return <span className="badge badge-danger">TERMINATED</span>;
      default: return <span className="badge">{status.toUpperCase()}</span>;
    }
  };

  return (
    <div className="animate-fade">
      {/* Header */}
      <header className="mb-12 flex justify-between items-end">
        <div>
          <p style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Subscription Lifecycle</p>
          <h1 className="section-title">Plan <span style={{ color: 'var(--primary)' }}>Registry</span> 📅</h1>
          <p className="section-subtitle">Manage high-precision organic delivery cycles.</p>
        </div>
        <div className="flex gap-4">
          <button className="btn btn-secondary"><CalendarCheck size={18} /> Schedule Matrix</button>
          <button className="btn btn-primary">Authorize New Plan</button>
        </div>
      </header>

      {loading ? (
        <div className="loading-container"><div className="loader"></div><p>Synchronizing Plan Registry...</p></div>
      ) : (
        <div className="grid grid-cols-2 gap-8">
          {subscriptions.map(sub => (
            <div key={sub._id} className="card" style={{ padding: '2.5rem' }}>
               <div className="flex justify-between items-start mb-10">
                  <div className="flex items-center gap-5">
                     <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: 'var(--primary-soft)', display: 'grid', placeItems: 'center', border: '1px solid var(--primary-soft)' }}>
                        <Zap size={28} color="var(--primary)" />
                     </div>
                     <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{sub.product?.name || 'Organic Plan Entry'}</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>{sub.frequency.toUpperCase()} RECURRING CYCLE</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <div style={{ marginBottom: '1rem' }}>{getStatusBadge(sub.status)}</div>
                     <p style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)' }}>₹{sub.product?.price || 0}<span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>/cycle</span></p>
                  </div>
               </div>

               <div className="flex flex-col gap-6 mb-10">
                  <div className="flex items-center gap-4">
                     <div style={{ padding: '0.6rem', background: 'var(--bg-main)', borderRadius: '10px' }}><Calendar size={18} color="var(--text-dim)" /></div>
                     <div className="flex-1">
                        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Established On</p>
                        <p style={{ fontSize: '0.95rem', fontWeight: 600 }}>{new Date(sub.startDate).toLocaleDateString(undefined, { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <div style={{ padding: '0.6rem', background: 'var(--bg-main)', borderRadius: '10px' }}><History size={18} color="var(--text-dim)" /></div>
                     <div className="flex-1">
                        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Registry Duration</p>
                        <p style={{ fontSize: '0.95rem', fontWeight: 600 }}>Active for {Math.floor((new Date() - new Date(sub.startDate))/(1000*60*60*24))} days</p>
                     </div>
                  </div>
               </div>

               <div className="mt-4 pt-8 border-subtle flex justify-between gap-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                  <button className="btn btn-secondary w-full" style={{ padding: '0.85rem' }}>Modify Cycle</button>
                  <button className="btn btn-ghost w-full" style={{ padding: '0.85rem', color: '#ef4444' }}>Terminate Plan</button>
               </div>
            </div>
          ))}
          
          {subscriptions.length === 0 && (
             <div className="card text-center py-24" style={{ gridColumn: 'span 2', borderStyle: 'dashed', background: 'transparent' }}>
                <div style={{ opacity: 0.3 }}><CalendarCheck size={64} style={{ margin: '0 auto 2rem', display: 'block' }} /></div>
                <h3 style={{ fontSize: '1.5rem', color: 'var(--text-dim)' }}>Plan Registry Empty</h3>
                <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', maxWidth: '400px', margin: '0.5rem auto 0 auto' }}>Establish recurrent organic metrics by authorizing a new delivery plan.</p>
                <div className="mt-12"><button className="btn btn-primary btn-lg">Explore Available Protocols</button></div>
             </div>
          )}
        </div>
      )}
    </div>
  );
}
