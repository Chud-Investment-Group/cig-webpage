'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

// Password hash generated with SHA-256 + salt
// To generate a new hash: echo -n "PASSWORD + SALT" | sha256sum
const ADMIN_CREDENTIALS = {
  username: 'admin',
  passwordHash: 'cf806e3cb742006fccc85302a339afff30204be1ac6149f58a3d323d274dde13',
  salt: 'cig-admin-salt-2024'
};

// Hash function using Web Crypto API
async function hashPassword(password, salt) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

const DEFAULT_NEW_MARKET = {
  title: '',
  category: 'salary',
  description: '',
  yesPrice: 0.5,
  endDate: '',
  isMultiple: false,
  options: [
    { name: '', price: 0.5 },
    { name: '', price: 0.5 }
  ]
};

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingMarket, setEditingMarket] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [resolveModal, setResolveModal] = useState(null);

  const [newMarket, setNewMarket] = useState(DEFAULT_NEW_MARKET);

  const fetchMarkets = useCallback(async () => {
    try {
      const res = await fetch('/api/markets');
      const data = await res.json();
      if (data.markets) {
        setMarkets(data.markets);
      }
    } catch (err) {
      console.error('Error fetching markets:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const session = sessionStorage.getItem('cig-admin-session');
    if (session === 'authenticated') {
      setIsLoggedIn(true);
    }
    fetchMarkets();
  }, [fetchMarkets]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    try {
      const inputHash = await hashPassword(password, ADMIN_CREDENTIALS.salt);

      if (username === ADMIN_CREDENTIALS.username && inputHash === ADMIN_CREDENTIALS.passwordHash) {
        setIsLoggedIn(true);
        sessionStorage.setItem('cig-admin-session', 'authenticated');
        setLoginError('');
      } else {
        setLoginError('Invalid credentials. Please try again.');
      }
    } catch {
      setLoginError('Authentication error. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('cig-admin-session');
  };

  const saveMarkets = async (updatedMarkets) => {
    setSaving(true);
    try {
      const res = await fetch('/api/markets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markets: updatedMarkets }),
      });
      if (!res.ok) throw new Error('Failed to save');
      setMarkets(updatedMarkets);
      return true;
    } catch (err) {
      console.error('Error saving markets:', err);
      alert('Failed to save changes. Please try again.');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const getOptionsTotal = (options) => {
    return options.reduce((sum, opt) => sum + (parseFloat(opt.price) || 0), 0);
  };

  const handleCreateMarket = async (e) => {
    e.preventDefault();

    if (newMarket.isMultiple) {
      const total = getOptionsTotal(newMarket.options);
      if (Math.abs(total - 1) > 0.05) {
        alert(`Option prices must sum to 100%. Currently: ${(total * 100).toFixed(0)}%`);
        return;
      }
      if (newMarket.options.some(opt => !opt.name.trim())) {
        alert('All options must have a name.');
        return;
      }
    }

    const market = {
      id: Date.now(),
      title: newMarket.title,
      category: newMarket.category,
      description: newMarket.description,
      endDate: newMarket.endDate,
      yesPrice: newMarket.isMultiple
        ? Math.max(...newMarket.options.map(o => parseFloat(o.price) || 0))
        : parseFloat(newMarket.yesPrice),
      volume: 0,
      status: 'open',
      createdAt: new Date().toISOString().split('T')[0],
      isMultiple: newMarket.isMultiple,
      ...(newMarket.isMultiple && {
        options: newMarket.options.map(opt => ({
          name: opt.name.trim(),
          price: parseFloat(opt.price) || 0
        }))
      })
    };

    const updatedMarkets = [...markets, market];
    const success = await saveMarkets(updatedMarkets);
    if (success) {
      setNewMarket(DEFAULT_NEW_MARKET);
      setShowCreateForm(false);
    }
  };

  const handleUpdateMarket = async (e) => {
    e.preventDefault();

    if (editingMarket.isMultiple) {
      const total = getOptionsTotal(editingMarket.options);
      if (Math.abs(total - 1) > 0.05) {
        alert(`Option prices must sum to 100%. Currently: ${(total * 100).toFixed(0)}%`);
        return;
      }
      if (editingMarket.options.some(opt => !opt.name.trim())) {
        alert('All options must have a name.');
        return;
      }
    }

    const updatedMarkets = markets.map(m => {
      if (m.id === editingMarket.id) {
        return {
          ...editingMarket,
          yesPrice: editingMarket.isMultiple
            ? Math.max(...editingMarket.options.map(o => parseFloat(o.price) || 0))
            : parseFloat(editingMarket.yesPrice),
          options: editingMarket.isMultiple
            ? editingMarket.options.map(opt => ({
                name: opt.name.trim(),
                price: parseFloat(opt.price) || 0
              }))
            : undefined
        };
      }
      return m;
    });

    const success = await saveMarkets(updatedMarkets);
    if (success) {
      setEditingMarket(null);
    }
  };

  const handleResolveMarket = async (marketId, resolution) => {
    const updatedMarkets = markets.map(m => {
      if (m.id === marketId) {
        if (m.isMultiple) {
          return {
            ...m,
            status: 'resolved',
            resolution,
            options: m.options.map(opt => ({
              ...opt,
              price: opt.name === resolution ? 1 : 0
            })),
            yesPrice: 1
          };
        } else {
          return {
            ...m,
            status: 'resolved',
            resolution,
            yesPrice: resolution === 'YES' ? 1 : 0
          };
        }
      }
      return m;
    });

    const success = await saveMarkets(updatedMarkets);
    if (success) {
      setResolveModal(null);
    }
  };

  const handleDeleteMarket = async (marketId) => {
    if (confirm('Are you sure you want to delete this market?')) {
      const updatedMarkets = markets.filter(m => m.id !== marketId);
      await saveMarkets(updatedMarkets);
    }
  };

  const handleReopenMarket = async (marketId) => {
    const updatedMarkets = markets.map(m => {
      if (m.id === marketId) {
        if (m.isMultiple) {
          const equalPrice = 1 / m.options.length;
          return {
            ...m,
            status: 'open',
            resolution: undefined,
            options: m.options.map(opt => ({ ...opt, price: equalPrice })),
            yesPrice: equalPrice
          };
        } else {
          return { ...m, status: 'open', resolution: undefined, yesPrice: 0.5 };
        }
      }
      return m;
    });
    await saveMarkets(updatedMarkets);
  };

  const addOption = (isEditing = false) => {
    if (isEditing) {
      setEditingMarket({
        ...editingMarket,
        options: [...editingMarket.options, { name: '', price: 0 }]
      });
    } else {
      setNewMarket({
        ...newMarket,
        options: [...newMarket.options, { name: '', price: 0 }]
      });
    }
  };

  const removeOption = (index, isEditing = false) => {
    if (isEditing) {
      if (editingMarket.options.length <= 2) return;
      setEditingMarket({
        ...editingMarket,
        options: editingMarket.options.filter((_, i) => i !== index)
      });
    } else {
      if (newMarket.options.length <= 2) return;
      setNewMarket({
        ...newMarket,
        options: newMarket.options.filter((_, i) => i !== index)
      });
    }
  };

  const updateOption = (index, field, value, isEditing = false) => {
    if (isEditing) {
      const newOptions = [...editingMarket.options];
      newOptions[index] = { ...newOptions[index], [field]: value };
      setEditingMarket({ ...editingMarket, options: newOptions });
    } else {
      const newOptions = [...newMarket.options];
      newOptions[index] = { ...newOptions[index], [field]: value };
      setNewMarket({ ...newMarket, options: newOptions });
    }
  };

  const distributeEvenly = (isEditing = false) => {
    if (isEditing) {
      const evenPrice = 1 / editingMarket.options.length;
      setEditingMarket({
        ...editingMarket,
        options: editingMarket.options.map(opt => ({ ...opt, price: evenPrice }))
      });
    } else {
      const evenPrice = 1 / newMarket.options.length;
      setNewMarket({
        ...newMarket,
        options: newMarket.options.map(opt => ({ ...opt, price: evenPrice }))
      });
    }
  };

  if (!isLoggedIn) {
    return (
      <>
        <nav className="nav">
          <div className="container nav-content">
            <Link href="/" className="logo">
              <span>C</span>HUD <span>I</span>NVESTMENT <span>G</span>ROUP
            </Link>
            <ul className="nav-links">
              <li><Link href="/markets">Markets</Link></li>
              <li><Link href="/#how-it-works">How It Works</Link></li>
              <li><Link href="/#about">About</Link></li>
              <li><Link href="/#contact">Contact</Link></li>
            </ul>
          </div>
        </nav>

        <main className="admin-login-page">
          <div className="login-container">
            <h1>Admin Login</h1>
            <p>Enter your credentials to access the admin panel.</p>

            {loginError && <div className="login-error">{loginError}</div>}

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Enter username"
                  disabled={isLoggingIn}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter password"
                  disabled={isLoggingIn}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%' }}
                disabled={isLoggingIn}
              >
                {isLoggingIn ? 'Authenticating...' : 'Login'}
              </button>
            </form>

            <p className="login-hint">
              Contact a CIG admin for access credentials.
            </p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <nav className="nav">
        <div className="container nav-content">
          <Link href="/" className="logo">
            <span>C</span>HUD <span>I</span>NVESTMENT <span>G</span>ROUP
          </Link>
          <ul className="nav-links">
            <li><Link href="/markets">Markets</Link></li>
            <li><Link href="/#how-it-works">How It Works</Link></li>
            <li><Link href="/#about">About</Link></li>
            <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
          </ul>
        </div>
      </nav>

      <main className="admin-page">
        <div className="container">
          <div className="admin-header">
            <div>
              <h1>Admin Panel</h1>
              <p>Manage prediction markets {saving && <span style={{ color: 'var(--secondary)' }}>(Saving...)</span>}</p>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => setShowCreateForm(true)}
              disabled={saving}
            >
              + Create Market
            </button>
          </div>

          <div className="admin-stats">
            <div className="admin-stat">
              <span className="stat-number">{markets.length}</span>
              <span className="stat-text">Total</span>
            </div>
            <div className="admin-stat">
              <span className="stat-number">{markets.filter(m => m.status === 'open').length}</span>
              <span className="stat-text">Open</span>
            </div>
            <div className="admin-stat">
              <span className="stat-number">{markets.filter(m => m.status === 'resolved').length}</span>
              <span className="stat-text">Resolved</span>
            </div>
            <div className="admin-stat">
              <span className="stat-number">${markets.reduce((s, m) => s + m.volume, 0).toLocaleString()}</span>
              <span className="stat-text">Volume</span>
            </div>
          </div>

          <div className="admin-markets-list">
            <h2>All Markets</h2>
            {loading ? (
              <div className="admin-empty">
                <p>Loading markets...</p>
              </div>
            ) : markets.length === 0 ? (
              <div className="admin-empty">
                <p>No markets yet.</p>
                <button className="btn btn-primary" onClick={() => setShowCreateForm(true)}>
                  Create your first market
                </button>
              </div>
            ) : (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Type</th>
                      <th>Category</th>
                      <th>Volume</th>
                      <th>Status</th>
                      <th>End Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {markets.map(market => (
                      <tr key={market.id} className={market.status}>
                        <td className="market-title-cell" title={market.title}>{market.title}</td>
                        <td>
                          <span className={`type-badge ${market.isMultiple ? 'multiple' : 'binary'}`}>
                            {market.isMultiple ? 'Multi' : 'Y/N'}
                          </span>
                        </td>
                        <td>{market.category}</td>
                        <td>${market.volume.toLocaleString()}</td>
                        <td>
                          <span className={`status-badge status-${market.status}`}>
                            {market.status === 'resolved' ? market.resolution : market.status}
                          </span>
                        </td>
                        <td>{market.endDate}</td>
                        <td className="actions-cell">
                          <button
                            className="action-btn edit"
                            onClick={() => setEditingMarket({ ...market, options: market.options ? [...market.options] : undefined })}
                            disabled={saving}
                          >
                            Edit
                          </button>
                          {market.status === 'open' && (
                            market.isMultiple ? (
                              <button
                                className="action-btn resolve-yes"
                                onClick={() => setResolveModal(market)}
                                disabled={saving}
                              >
                                Resolve
                              </button>
                            ) : (
                              <>
                                <button
                                  className="action-btn resolve-yes"
                                  onClick={() => handleResolveMarket(market.id, 'YES')}
                                  disabled={saving}
                                >
                                  Yes
                                </button>
                                <button
                                  className="action-btn resolve-no"
                                  onClick={() => handleResolveMarket(market.id, 'NO')}
                                  disabled={saving}
                                >
                                  No
                                </button>
                              </>
                            )
                          )}
                          {market.status === 'resolved' && (
                            <button
                              className="action-btn reopen"
                              onClick={() => handleReopenMarket(market.id)}
                              disabled={saving}
                            >
                              Reopen
                            </button>
                          )}
                          <button
                            className="action-btn delete"
                            onClick={() => handleDeleteMarket(market.id)}
                            disabled={saving}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Create Market Modal */}
      {showCreateForm && (
        <div className="modal-overlay" onClick={() => setShowCreateForm(false)}>
          <div className="modal admin-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowCreateForm(false)}>×</button>
            <h2>Create New Market</h2>

            <form onSubmit={handleCreateMarket}>
              <div className="form-group">
                <label>Market Type</label>
                <div className="type-toggle">
                  <button
                    type="button"
                    className={`toggle-btn ${!newMarket.isMultiple ? 'active' : ''}`}
                    onClick={() => setNewMarket({ ...newMarket, isMultiple: false })}
                  >
                    Yes / No
                  </button>
                  <button
                    type="button"
                    className={`toggle-btn ${newMarket.isMultiple ? 'active' : ''}`}
                    onClick={() => setNewMarket({ ...newMarket, isMultiple: true })}
                  >
                    Multiple Choice
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Market Title</label>
                <input
                  type="text"
                  value={newMarket.title}
                  onChange={(e) => setNewMarket({ ...newMarket, title: e.target.value })}
                  placeholder={newMarket.isMultiple ? "Which outcome will occur?" : "Will [person] achieve [outcome]?"}
                  required
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  value={newMarket.category}
                  onChange={(e) => setNewMarket({ ...newMarket, category: e.target.value })}
                >
                  <option value="salary">Salary</option>
                  <option value="placement">Placement</option>
                  <option value="return-offer">Return Offer</option>
                  <option value="career">Career</option>
                </select>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newMarket.description}
                  onChange={(e) => setNewMarket({ ...newMarket, description: e.target.value })}
                  placeholder="Detailed resolution criteria..."
                  required
                />
              </div>

              {newMarket.isMultiple ? (
                <div className="form-group">
                  <label>
                    Options
                    <span className={`price-total ${Math.abs(getOptionsTotal(newMarket.options) - 1) <= 0.05 ? 'valid' : 'invalid'}`}>
                      (Total: {(getOptionsTotal(newMarket.options) * 100).toFixed(0)}%)
                    </span>
                  </label>
                  <div className="options-list">
                    {newMarket.options.map((opt, i) => (
                      <div key={i} className="option-row">
                        <input
                          type="text"
                          value={opt.name}
                          onChange={(e) => updateOption(i, 'name', e.target.value)}
                          placeholder={`Option ${i + 1}`}
                          className="option-name-input"
                        />
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          max="1"
                          value={opt.price}
                          onChange={(e) => updateOption(i, 'price', e.target.value)}
                          className="option-price-input"
                        />
                        <span className="option-percent">{((parseFloat(opt.price) || 0) * 100).toFixed(0)}%</span>
                        {newMarket.options.length > 2 && (
                          <button type="button" className="option-remove" onClick={() => removeOption(i)}>×</button>
                        )}
                      </div>
                    ))}
                    <div className="options-actions">
                      <button type="button" className="btn-small" onClick={() => addOption()}>+ Add Option</button>
                      <button type="button" className="btn-small" onClick={() => distributeEvenly()}>Distribute Evenly</button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="form-group">
                  <label>Initial YES Price (0-1)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max="0.99"
                    value={newMarket.yesPrice}
                    onChange={(e) => setNewMarket({ ...newMarket, yesPrice: e.target.value })}
                    required
                  />
                  <span className="price-hint">{((parseFloat(newMarket.yesPrice) || 0) * 100).toFixed(0)}% probability of YES</span>
                </div>
              )}

              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  value={newMarket.endDate}
                  onChange={(e) => setNewMarket({ ...newMarket, endDate: e.target.value })}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={saving}>
                {saving ? 'Creating...' : 'Create Market'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Market Modal */}
      {editingMarket && (
        <div className="modal-overlay" onClick={() => setEditingMarket(null)}>
          <div className="modal admin-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setEditingMarket(null)}>×</button>
            <h2>Edit Market</h2>

            <form onSubmit={handleUpdateMarket}>
              <div className="form-group">
                <label>Market Type: <strong>{editingMarket.isMultiple ? 'Multiple Choice' : 'Yes/No'}</strong></label>
              </div>

              <div className="form-group">
                <label>Market Title</label>
                <input
                  type="text"
                  value={editingMarket.title}
                  onChange={(e) => setEditingMarket({ ...editingMarket, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  value={editingMarket.category}
                  onChange={(e) => setEditingMarket({ ...editingMarket, category: e.target.value })}
                >
                  <option value="salary">Salary</option>
                  <option value="placement">Placement</option>
                  <option value="return-offer">Return Offer</option>
                  <option value="career">Career</option>
                </select>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={editingMarket.description}
                  onChange={(e) => setEditingMarket({ ...editingMarket, description: e.target.value })}
                  required
                />
              </div>

              {editingMarket.isMultiple ? (
                <div className="form-group">
                  <label>
                    Options
                    <span className={`price-total ${Math.abs(getOptionsTotal(editingMarket.options) - 1) <= 0.05 ? 'valid' : 'invalid'}`}>
                      (Total: {(getOptionsTotal(editingMarket.options) * 100).toFixed(0)}%)
                    </span>
                  </label>
                  <div className="options-list">
                    {editingMarket.options.map((opt, i) => (
                      <div key={i} className="option-row">
                        <input
                          type="text"
                          value={opt.name}
                          onChange={(e) => updateOption(i, 'name', e.target.value, true)}
                          placeholder={`Option ${i + 1}`}
                          className="option-name-input"
                        />
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          max="1"
                          value={opt.price}
                          onChange={(e) => updateOption(i, 'price', e.target.value, true)}
                          className="option-price-input"
                        />
                        <span className="option-percent">{((parseFloat(opt.price) || 0) * 100).toFixed(0)}%</span>
                        {editingMarket.options.length > 2 && (
                          <button type="button" className="option-remove" onClick={() => removeOption(i, true)}>×</button>
                        )}
                      </div>
                    ))}
                    <div className="options-actions">
                      <button type="button" className="btn-small" onClick={() => addOption(true)}>+ Add Option</button>
                      <button type="button" className="btn-small" onClick={() => distributeEvenly(true)}>Distribute Evenly</button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="form-group">
                  <label>YES Price (0-1)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    value={editingMarket.yesPrice}
                    onChange={(e) => setEditingMarket({ ...editingMarket, yesPrice: e.target.value })}
                    required
                  />
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={editingMarket.endDate}
                    onChange={(e) => setEditingMarket({ ...editingMarket, endDate: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Volume ($)</label>
                  <input
                    type="number"
                    value={editingMarket.volume}
                    onChange={(e) => setEditingMarket({ ...editingMarket, volume: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Resolve Multiple Choice Modal */}
      {resolveModal && (
        <div className="modal-overlay" onClick={() => setResolveModal(null)}>
          <div className="modal admin-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setResolveModal(null)}>×</button>
            <h2>Resolve Market</h2>
            <p className="modal-market-title">{resolveModal.title}</p>
            <p style={{ marginBottom: '1rem', color: 'var(--gray)', fontSize: '0.9rem' }}>Select the winning outcome:</p>

            <div className="resolve-options">
              {resolveModal.options.map((opt, i) => (
                <button
                  key={i}
                  className="resolve-option-btn"
                  onClick={() => handleResolveMarket(resolveModal.id, opt.name)}
                  disabled={saving}
                >
                  {opt.name}
                  <span className="resolve-option-price">{(opt.price * 100).toFixed(0)}%</span>
                </button>
              ))}
            </div>

            <button
              className="btn btn-secondary"
              style={{ width: '100%', marginTop: '1rem' }}
              onClick={() => setResolveModal(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <footer className="footer" style={{ marginTop: '3rem' }}>
        <div className="container">
          <div className="footer-bottom">
            <p>&copy; 2024 Chud Investment Group. Admin Panel.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
