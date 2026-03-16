import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Search, Filter, ShoppingCart, 
  Trash2, Star, CreditCard, Package, ChevronRight 
} from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/shop/products');
      if (res.data.success) {
        setProducts(res.data.products);
      }
    } catch (err) {
      toast.error('Failed to sync with farm marketplace');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    const exists = cart.find(item => item._id === product._id);
    if (exists) {
      toast.success(`Increased ${product.name} quantity`);
      setCart(cart.map(item => item._id === product._id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      toast.success(`${product.name} added to cart`);
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item._id !== id));
  };

  const checkout = async () => {
    toast.promise(
      api.post('/shop/orders', {
        items: cart.map(i => ({ product: i._id, quantity: i.qty, price: i.price })),
        totalAmount: cart.reduce((sum, item) => sum + (item.price * item.qty), 0)
      }),
      {
        loading: 'Processing your harvest order...',
        success: () => {
          setCart([]);
          return 'Order placed! Expect delivery soon.';
        },
        error: 'Order failed. Please try again.'
      }
    );
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade">
      <div className="dashboard-header flex justify-between items-start">
        <div>
          <h1 className="dashboard-title">Organic <span className="indian-accent" style={{fontSize: '1rem', verticalAlign: 'middle', marginLeft: '0.5rem'}}>Market</span> 🛒</h1>
          <p className="dashboard-subtitle">Fresh from Swaraj Farm to your doorstep</p>
        </div>
        <div className="flex gap-4">
          <div className="search-box">
             <div className="flex items-center gap-2" style={{ background: 'white', borderRadius: 'var(--radius-sm)', padding: '0 0.75rem', border: '1px solid var(--border)' }}>
              <Search size={16} color="var(--text-light)" />
              <input 
                type="text" 
                placeholder="Find harvest..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ border: 'none', boxShadow: 'none', fontSize: '0.85rem' }} 
              />
            </div>
          </div>
          <button className="btn btn-secondary" style={{position: 'relative', padding: '0.75rem'}}>
            <ShoppingCart size={20} />
            {cart.length > 0 && <span className="badge badge-danger" style={{position: 'absolute', top: '-5px', right: '-5px', padding: '0.2rem 0.4rem', fontSize: '0.65rem'}}>{cart.length}</span>}
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '6rem', textAlign: 'center' }}><div className="loader"></div></div>
      ) : (
        <div className="grid grid-3 mt-8 gap-6">
          {filteredProducts.map((product) => (
            <div key={product._id} className="product-card card hover-float" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ height: '200px', background: 'var(--bg-glass)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', backdropFilter: 'blur(5px)' }}>
                {product.category === 'milk' ? '🥛' : product.category === 'ghee' ? '🧴' : '📦'}
              </div>
              <div className="product-content" style={{ padding: '1.5rem' }}>
                <div className="flex justify-between items-start mb-2">
                  <h3 style={{ fontWeight: 800 }}>{product.name}</h3>
                  <span className="badge badge-success" style={{fontSize: '0.7rem'}}>{product.unit}</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {product.description || 'Pure organic production from our certified high-yield herds.'}
                </p>
                <div className="flex justify-between items-center">
                  <div style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--primary)' }}>₹{product.price}</div>
                  <button className="btn btn-primary btn-sm" onClick={() => addToCart(product)}>
                    <ShoppingBag size={14} /> Buy
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cart Summary Panel */}
      {cart.length > 0 && (
        <div className="card mt-10" style={{ background: 'var(--bg-glass)', border: '1px solid var(--primary)', borderLeftWidth: '5px' }}>
          <div className="flex justify-between items-center" style={{ padding: '1.5rem' }}>
            <div className="flex items-center gap-4">
              <div className="stat-icon" style={{ background: 'var(--primary)', color: 'white' }}><Package size={20} /></div>
              <div>
                <h3 style={{ fontWeight: 800 }}>Your Harvest Cart ({cart.length} items)</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                  {cart.map(i => `${i.name} x${i.qty}`).join(', ')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 600 }}>ORDER TOTAL</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>₹{cart.reduce((sum, i) => sum + (i.price * i.qty), 0).toLocaleString()}</div>
              </div>
              <button className="btn btn-primary btn-lg" onClick={checkout}>
                <CreditCard size={18} /> Checkout
              </button>
              <button className="btn btn-ghost" onClick={() => setCart([])} style={{color: 'var(--danger)'}}><Trash2 size={18} /></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
