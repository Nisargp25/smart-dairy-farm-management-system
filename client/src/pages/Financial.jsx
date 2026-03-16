import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Filter, Trash2, Edit, X, 
  ArrowUpRight, ArrowDownRight, IndianRupee, 
  PieChart, Calendar, MoreHorizontal 
} from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Financial() {
  const [financials, setFinancials] = useState({ income: [], expenses: [], totalIncome: 0, totalExpense: 0 });
  const [loading, setLoading] = useState(true);
  const [filterPeriod, setFilterPeriod] = useState('month');

  useEffect(() => {
    fetchFinancials();
  }, [filterPeriod]);

  const fetchFinancials = async () => {
    try {
      setLoading(true);
      const [incomeRes, expenseRes] = await Promise.all([
        api.get('/income'),
        api.get('/expenses')
      ]);

      if (incomeRes.data.success && expenseRes.data.success) {
        setFinancials({
          income: incomeRes.data.income,
          expenses: expenseRes.data.expenses,
          totalIncome: incomeRes.data.totalAmount,
          totalExpense: expenseRes.data.totalAmount
        });
      }
    } catch (err) {
      toast.error('Failed to load financial records');
    } finally {
      setLoading(false);
    }
  };

  const netProfit = financials.totalIncome - financials.totalExpense;

  const allTransactions = [
    ...financials.income.map(i => ({ ...i, type: 'income' })),
    ...financials.expenses.map(e => ({ ...e, type: 'expense' }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}><div className="loader"></div></div>;

  return (
    <div className="animate-fade">
      <div className="dashboard-header flex justify-between items-start">
        <div>
          <h1 className="dashboard-title">Financial <span className="indian-accent" style={{fontSize: '1rem', verticalAlign: 'middle', marginLeft: '0.5rem'}}>Ledger</span> 💰</h1>
          <p className="dashboard-subtitle">Monitor and analyze your farm's cash flow</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={18} /> New Transaction
        </button>
      </div>

      {/* Summary Cards */}
      <div className="dashboard-stats mt-8">
        <div className="stat-card success">
          <div className="flex justify-between items-start mb-2">
            <div className="stat-icon" style={{ background: 'rgba(30, 77, 43, 0.1)', color: 'var(--primary)' }}><ArrowUpRight size={20} /></div>
            <div className="stat-trend" style={{ color: 'var(--primary)' }}>Snapshot</div>
          </div>
          <div className="stat-label">Total Income</div>
          <div className="stat-value">₹{financials.totalIncome.toLocaleString()}</div>
        </div>

        <div className="stat-card danger">
          <div className="flex justify-between items-start mb-2">
            <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}><ArrowDownRight size={20} /></div>
            <div className="stat-trend" style={{ color: 'var(--danger)' }}>Snapshot</div>
          </div>
          <div className="stat-label">Total Expenses</div>
          <div className="stat-value">₹{financials.totalExpense.toLocaleString()}</div>
        </div>

        <div className="stat-card">
          <div className="flex justify-between items-start mb-2">
            <div className="stat-icon" style={{ background: 'rgba(0, 0, 0, 0.05)', color: 'var(--text)' }}><IndianRupee size={20} /></div>
            <div className="stat-trend" style={{ color: netProfit >= 0 ? 'var(--primary)' : 'var(--danger)' }}>
              {netProfit >= 0 ? 'Surplus' : 'Deficit'}
            </div>
          </div>
          <div className="stat-label">Net Position</div>
          <div className="stat-value">₹{netProfit.toLocaleString()}</div>
        </div>

        <div className="stat-card">
          <div className="flex justify-between items-start mb-2">
            <div className="stat-icon" style={{ background: 'rgba(212, 163, 115, 0.1)', color: 'var(--accent)' }}><PieChart size={20} /></div>
            <div className="stat-trend" style={{ color: 'var(--primary)' }}>Optimal</div>
          </div>
          <div className="stat-label">Margin Rate</div>
          <div className="stat-value">{financials.totalIncome > 0 ? Math.round((netProfit / financials.totalIncome) * 100) : 0}%</div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="dashboard-section mt-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="section-title">Record of Transactions</h2>
          <div className="flex gap-2">
            <div className="search-box">
              <div className="flex items-center gap-2" style={{ background: 'white', borderRadius: 'var(--radius-sm)', padding: '0 0.75rem', border: '1px solid var(--border)' }}>
                <Search size={16} color="var(--text-light)" />
                <input type="text" placeholder="Search entries..." style={{ border: 'none', boxShadow: 'none', fontSize: '0.85rem' }} />
              </div>
            </div>
            <button className="btn btn-secondary btn-sm"><Filter size={16} /></button>
          </div>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Classification</th>
                <th>Narrative</th>
                <th>Type</th>
                <th style={{ textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {allTransactions.length > 0 ? allTransactions.map((tx, i) => (
                <tr key={i}>
                  <td style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>{new Date(tx.date).toLocaleDateString()}</td>
                  <td style={{ fontWeight: '700', textTransform: 'capitalize' }}>{tx.category || 'General'}</td>
                  <td style={{ fontSize: '0.9rem' }}>{tx.description}</td>
                  <td>
                    <span className={`badge badge-${tx.type === 'income' ? 'success' : 'danger'}`} style={{fontSize: '0.7rem'}}>
                      {tx.type}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: '800' }}>
                    <span style={{ color: tx.type === 'income' ? 'var(--primary)' : 'var(--danger)' }}>
                      {tx.type === 'income' ? '+' : '-'} ₹{Math.abs(tx.amount).toLocaleString()}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)' }}>No financial transactions identified.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
