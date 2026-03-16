import React, { useEffect, useState } from 'react';
import { 
  ShoppingBag, Package, Truck, CheckCircle, Clock, 
  Search, Filter, ExternalLink, Calendar, IndianRupee,
  ChevronRight, Box, AlertCircle, Info, FileText
} from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/shop/orders');
      setOrders(res.data.orders);
    } catch (err) {
      toast.error('Log initialization failed');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(o => 
    o._id.toLowerCase().includes(search.toLowerCase()) ||
    o.status.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'delivered': return <span className="badge badge-success">DELIVERED</span>;
      case 'shipped': return <span className="badge badge-info">IN TRANSIT</span>;
      case 'processing': return <span className="badge badge-warning">PROCESSING</span>;
      case 'pending': return <span className="badge badge-warning">PENDING AUTH</span>;
      default: return <span className="badge">{status.toUpperCase()}</span>;
    }
  };

  return (
    <div className="animate-fade">
      {/* Header */}
      <header className="mb-12 flex justify-between items-end">
        <div>
          <p style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Transaction Registry</p>
          <h1 className="section-title">My Supply <span style={{ color: 'var(--primary)' }}>Orders</span> 📦</h1>
          <p className="section-subtitle">Track and manage your organic produce deliveries.</p>
        </div>
        <div className="flex gap-4">
          <button className="btn btn-secondary"><FileText size={18} /> Invoices</button>
          <button className="btn btn-primary">Start New Order</button>
        </div>
      </header>

      {/* Control Strip */}
      <div className="card mb-10" style={{ padding: '0.75rem 1.5rem' }}>
        <div className="flex justify-between items-center w-full">
           <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '1.25rem', paddingLeft: '1rem' }}>
              <Search size={20} color="var(--text-muted)" />
              <input 
                type="text" 
                placeholder="Query by Order ID, Status, or Product Item..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ border: 'none', background: 'transparent', padding: 0, outline: 'none', fontSize: '0.95rem' }}
              />
           </div>
           
           <div className="flex items-center gap-4">
              <button className="btn btn-ghost" style={{ padding: '0.5rem 0.75rem' }}>
                 <Filter size={18} /> Filter Status
              </button>
           </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-container"><div className="loader"></div><p>Synchronizing Ledger...</p></div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredOrders.map(order => (
            <div key={order._id} className="card" style={{ padding: '2rem' }}>
               <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-4">
                     <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'var(--bg-main)', display: 'grid', placeItems: 'center', border: '1px solid var(--border-subtle)' }}>
                        <Package size={24} color="var(--primary)" />
                     </div>
                     <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Order ID # {order._id.slice(-8).toUpperCase()}</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Initiated on {new Date(order.orderDate).toLocaleDateString(undefined, { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <div style={{ marginBottom: '0.75rem' }}>{getStatusBadge(order.status)}</div>
                     <p style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>₹{order.totalAmount}</p>
                  </div>
               </div>

               <div style={{ background: 'var(--bg-main)', borderRadius: '16px', padding: '1.5rem', border: '1px solid var(--border-subtle)' }}>
                  <div className="flex flex-col gap-4">
                     {order.items?.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                           <div className="flex items-center gap-3">
                              <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800, border: '1px solid var(--border-subtle)' }}>{item.quantity}x</div>
                              <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{item.product?.name || 'Organic Product'}</span>
                           </div>
                           <span style={{ color: 'var(--text-dim)', fontWeight: 600 }}>₹{item.price * item.quantity}</span>
                        </div>
                     ))}
                  </div>
               </div>

               <div className="mt-8 pt-8 border-subtle flex justify-between items-center" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                  <div className="flex gap-6">
                     <div className="flex items-center gap-2">
                        <Truck size={16} color="var(--text-muted)" />
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: 600 }}>Delivery Standard Priority</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <Box size={16} color="var(--text-muted)" />
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: 600 }}>Zero Transit Packaging</span>
                     </div>
                  </div>
                  <div className="flex gap-4">
                     <button className="btn btn-secondary" style={{ padding: '0.5rem 1.25rem' }}>Track Order</button>
                     <button className="btn btn-ghost" style={{ padding: '0.5rem 1rem' }}><ExternalLink size={16} /> Summary</button>
                  </div>
               </div>
            </div>
          ))}
          
          {filteredOrders.length === 0 && (
             <div className="card text-center py-20" style={{ borderStyle: 'dashed', background: 'transparent' }}>
                <div style={{ opacity: 0.3 }}><ShoppingBag size={64} style={{ margin: '0 auto 1.5rem', display: 'block' }} /></div>
                <h3 style={{ fontSize: '1.5rem', color: 'var(--text-dim)' }}>Registry Empty</h3>
                <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Capture your first organic experience by visiting the Marketplace.</p>
                <div className="mt-8"><button className="btn btn-primary">Establish Initial Order</button></div>
             </div>
          )}
        </div>
      )}
    </div>
  );
}
