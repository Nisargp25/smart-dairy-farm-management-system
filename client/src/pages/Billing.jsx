import React, { useEffect, useState } from 'react';
import { 
  CreditCard, FileText, Download, CheckCircle, Clock, 
  Search, Filter, ExternalLink, IndianRupee,
  ChevronRight, ArrowRight, ShieldCheck, Zap,
  AlertCircle, Info, Calendar, DollarSign
} from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Billing() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const res = await api.get('/shop/billing'); // This endpoint might vary
      setBills(res.data.bills || []);
    } catch (err) {
      toast.error('Billing ledger initialization failure');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid': return <span className="badge badge-success">CLEARED</span>;
      case 'pending': return <span className="badge badge-warning">AWAITING PMT</span>;
      case 'overdue': return <span className="badge badge-danger">LATE PMT</span>;
      default: return <span className="badge">{status.toUpperCase()}</span>;
    }
  };

  return (
    <div className="animate-fade">
      {/* Header */}
      <header className="mb-12 flex justify-between items-end">
        <div>
          <p style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Financial Operations</p>
          <h1 className="section-title">Invoice <span style={{ color: 'var(--primary)' }}>Registry</span> 🏦</h1>
          <p className="section-subtitle">Monitor and finalize your organic consumption payments.</p>
        </div>
        <div className="flex gap-4">
          <button className="btn btn-secondary">Download Audit Log</button>
          <button className="btn btn-primary">Pay Balance Cycle</button>
        </div>
      </header>

      {/* Overview Cards (Focus on Gaps) */}
      <div className="stats-grid mb-12">
        <div className="card">
           <div className="flex justify-between items-start mb-6">
              <div style={{ background: 'var(--primary-soft)', padding: '0.75rem', borderRadius: '12px' }}><CreditCard size={22} color="var(--primary)" /></div>
              <span className="badge badge-success">ACTIVE LEDGER</span>
           </div>
           <p className="stat-label">Verified Invoices</p>
           <h2 className="stat-value">{bills.length} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Files</span></h2>
        </div>

        <div className="card">
           <div className="flex justify-between items-start mb-6">
              <div style={{ background: '#fef3c7', padding: '0.75rem', borderRadius: '12px' }}><Clock size={22} color="#d97706" /></div>
              <span className="badge badge-warning">AWAITING</span>
           </div>
           <p className="stat-label">Pending Settlement</p>
           <h2 className="stat-value">₹{bills.filter(b => b.status === 'pending').reduce((s, b) => s + b.amount, 0)}</h2>
        </div>

        <div className="card">
           <div className="flex justify-between items-start mb-6">
              <div style={{ background: '#e0f2fe', padding: '0.75rem', borderRadius: '12px' }}><ShieldCheck size={22} color="#075985" /></div>
              <span className="badge badge-info">30D SPEND</span>
           </div>
           <p className="stat-label">Monthly Expenditure</p>
           <h2 className="stat-value">₹{bills.reduce((s, b) => s + b.amount, 0)}</h2>
        </div>
      </div>

      {loading ? (
        <div className="loading-container"><div className="loader"></div><p>Synchronizing Invoices...</p></div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>INVOICE NUMBER</th>
                <th>PERIOD RANGE</th>
                <th>ESTABLISHED ON</th>
                <th>CURRENCY AMOUNT</th>
                <th>SETTLEMENT STATUS</th>
                <th style={{ textAlign: 'right' }}>OPERATIONS</th>
              </tr>
            </thead>
            <tbody>
              {bills.map(bill => (
                <tr key={bill._id}>
                  <td style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.9rem' }}>INV-{bill._id.slice(-6).toUpperCase()}</td>
                  <td style={{ fontWeight: 600, color: 'var(--text-dim)', fontSize: '0.85rem' }}>{bill.period || 'Consumption Cycle'}</td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{new Date(bill.createdAt).toLocaleDateString()}</td>
                  <td style={{ fontWeight: 800, fontSize: '0.95rem' }}>₹{bill.amount}</td>
                  <td>{getStatusBadge(bill.status)}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="flex gap-4 justify-end">
                       <button className="btn btn-ghost" style={{ padding: '0.4rem' }}><Download size={18} /></button>
                       <button className="btn btn-ghost" style={{ padding: '0.4rem' }}><ExternalLink size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {bills.length === 0 && (
                <tr>
                   <td colSpan="6" style={{ height: '300px', textAlign: 'center' }}>
                      <div style={{ opacity: 0.3 }}>
                        <FileText size={48} style={{ margin: '0 auto 1.5rem', display: 'block' }} />
                        <p style={{ fontWeight: 800 }}>Ledger Documentation Empty.</p>
                        <p style={{ fontSize: '0.85rem' }}>Wait for the automated billing cycle to generate your initial invoice.</p>
                      </div>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
