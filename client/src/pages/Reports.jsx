import React, { useState } from 'react';
import { 
  FileText, Download, Calendar, Search, 
  Filter, CheckCircle, Clock, BarChart, 
  PieChart, TrendingUp, ChevronRight, Activity 
} from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Reports() {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });

  const handleDownload = async (type) => {
    setLoading(true);
    try {
      const { startDate, endDate } = dateRange;
      const response = await api.get(`/reports/${type}`, {
        params: { startDate, endDate },
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}-report-${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} protocol generated`);
    } catch (err) {
      toast.error('System failed to generate document');
    } finally {
      setLoading(false);
    }
  };

  const reportTypes = [
    { id: 'milk', title: 'Production Metric Protocol', description: 'Advanced daily records of milk volumes across the entire herd.', icon: BarChart, color: 'var(--primary)' },
    { id: 'financial', title: 'Fiscal Audit Summary', description: 'Comprehensive income and expense breakdown with profit analysis.', icon: PieChart, color: 'var(--secondary)' },
    { id: 'health', title: 'Biological Status Report', description: 'Summary of health audits and immunization history per animal.', icon: Activity, color: 'var(--accent)' },
  ];

  return (
    <div className="animate-fade">
      <div className="dashboard-header flex justify-between items-start">
        <div>
          <h1 className="dashboard-title">System <span className="indian-accent" style={{fontSize: '1rem', verticalAlign: 'middle', marginLeft: '0.5rem'}}>Intelligence</span> 📊</h1>
          <p className="dashboard-subtitle">Generate export-grade analytical protocols and business summaries</p>
        </div>
        <div className="flex gap-2">
            <button className="btn btn-secondary btn-sm" disabled><Clock size={16} /> History</button>
        </div>
      </div>

      <div className="card mt-8 p-0 overflow-hidden" style={{ background: 'var(--bg-glass)', border: '1px solid var(--border)' }}>
        <div style={{ padding: '1.5rem', background: 'rgba(30, 77, 43, 0.05)', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ fontWeight: 800, fontSize: '1rem' }}>Protocol Filtration Parameters</h3>
        </div>
        <div style={{ padding: '1.5rem' }} className="grid grid-2 gap-6">
          <div className="form-group">
            <label className="form-label" style={{ fontSize: '0.7rem', fontWeight: 800 }}>STARTING DATE</label>
            <input type="date" className="form-input" value={dateRange.startDate} onChange={e => setDateRange({...dateRange, startDate: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label" style={{ fontSize: '0.7rem', fontWeight: 800 }}>TERMINATION DATE</label>
            <input type="date" className="form-input" value={dateRange.endDate} onChange={e => setDateRange({...dateRange, endDate: e.target.value})} />
          </div>
        </div>
      </div>

      <div className="grid grid-3 mt-8 gap-6">
        {reportTypes.map(report => (
          <div key={report.id} className="card hover-float p-0 overflow-hidden" style={{ background: 'var(--bg-glass)', border: '1px solid var(--border)' }}>
            <div style={{ padding: '2rem' }}>
              <div style={{ 
                width: '56px', height: '56px', borderRadius: 'var(--radius-md)', 
                background: 'rgba(0, 0, 0, 0.05)', color: report.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '1.5rem'
              }}>
                <report.icon size={28} />
              </div>
              <h3 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>{report.title}</h3>
              <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', marginBottom: '2rem', height: '3.2rem', overflow: 'hidden' }}>
                {report.description}
              </p>
              
              <div className="flex items-center justify-between mt-auto">
                 <div className="flex items-center gap-2" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--success)' }}>
                   <CheckCircle size={14} /> CERTIFIED
                 </div>
                 <button 
                  className="btn btn-primary btn-sm" 
                  onClick={() => handleDownload(report.id)}
                  disabled={loading}
                  style={{ gap: '0.5rem' }}
                >
                  <Download size={14} /> {loading ? 'Compiling...' : 'Generate PDF'}
                </button>
              </div>
            </div>
            <div style={{ padding: '0.75rem 2rem', background: 'rgba(0, 0, 0, 0.02)', fontSize: '0.7rem', color: 'var(--muted)', fontWeight: 600, borderTop: '1px solid var(--border)' }} className="flex justify-between items-center">
               <span>VERSION 2.4.1</span>
               <ChevronRight size={12} />
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-section mt-10">
         <h2 className="section-title mb-6">Analytical Overview</h2>
         <div className="grid grid-2 gap-8">
            <div className="card" style={{ background: 'rgba(255, 255, 255, 0.5)', border: '1px dashed var(--border)' }}>
               <div className="flex items-center gap-4 mb-4">
                  <div className="stat-icon" style={{ background: 'var(--primary)', color: 'white' }}><TrendingUp size={20} /></div>
                  <h3 style={{ fontWeight: 800 }}>Protocol Usage Stat</h3>
               </div>
               <p style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>Most generated protocol this month: <strong>Fiscal Audit Summary</strong>. Total exports: 12 systems.</p>
            </div>
            <div className="card" style={{ background: 'rgba(255, 255, 255, 0.5)', border: '1px dashed var(--border)' }}>
               <div className="flex items-center gap-4 mb-4">
                  <div className="stat-icon" style={{ background: 'var(--secondary)', color: 'white' }}><FileText size={20} /></div>
                  <h3 style={{ fontWeight: 800 }}>Audit Integrity</h3>
               </div>
               <p style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>Registry data sync status: <strong>Synced 4 minutes ago</strong>. Audit integrity score: 99.8%.</p>
            </div>
         </div>
      </div>
    </div>
  );
}
