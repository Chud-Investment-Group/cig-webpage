'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

export default function Markets() {
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('open');
  const [sortBy, setSortBy] = useState('volume');
  const [selectedMarket, setSelectedMarket] = useState(null);
  const [betAmount, setBetAmount] = useState('');
  const [betSide, setBetSide] = useState('yes');
  const [placing, setPlacing] = useState(false);

  const fetchMarkets = useCallback(async () => {
    try {
      const res = await fetch('/api/markets');
      const data = await res.json();
      if (data.markets) {
        setMarkets(data.markets);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching markets:', err);
      setError('Failed to load markets');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMarkets();
    // Poll for updates every 10 seconds
    const interval = setInterval(fetchMarkets, 10000);
    return () => clearInterval(interval);
  }, [fetchMarkets]);

  const saveMarkets = async (updatedMarkets) => {
    try {
      const res = await fetch('/api/markets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markets: updatedMarkets }),
      });
      if (!res.ok) throw new Error('Failed to save');
      return true;
    } catch (err) {
      console.error('Error saving markets:', err);
      return false;
    }
  };

  const filteredMarkets = markets
    .filter(m => filter === 'all' || m.category === filter)
    .filter(m => statusFilter === 'all' || m.status === statusFilter)
    .sort((a, b) => {
      if (sortBy === 'volume') return b.volume - a.volume;
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'ending') return new Date(a.endDate) - new Date(b.endDate);
      return 0;
    });

  const handleBet = async (e) => {
    e.preventDefault();
    if (!betAmount || parseFloat(betAmount) <= 0) return;

    setPlacing(true);
    const amount = parseFloat(betAmount);
    const updatedMarkets = markets.map(m => {
      if (m.id === selectedMarket.id) {
        const newVolume = m.volume + amount;
        let newYesPrice = m.yesPrice;
        if (betSide === 'yes') {
          newYesPrice = Math.min(0.99, m.yesPrice + (amount / 10000));
        } else {
          newYesPrice = Math.max(0.01, m.yesPrice - (amount / 10000));
        }
        return { ...m, volume: newVolume, yesPrice: newYesPrice };
      }
      return m;
    });

    const success = await saveMarkets(updatedMarkets);
    if (success) {
      setMarkets(updatedMarkets);
      alert(`Bet placed! $${amount} on ${betSide.toUpperCase()} for "${selectedMarket.title}"`);
      setSelectedMarket(null);
      setBetAmount('');
    } else {
      alert('Failed to place bet. Please try again.');
    }
    setPlacing(false);
  };

  const getCategoryLabel = (cat) => {
    const labels = {
      'salary': '💰 Salary',
      'placement': '🏢 Placement',
      'return-offer': '📋 Return Offer',
      'career': '📈 Career'
    };
    return labels[cat] || cat;
  };

  if (loading) {
    return (
      <>
        <nav className="nav">
          <div className="container nav-content">
            <Link href="/" className="logo">
              <span>C</span>HUD <span>I</span>NVESTMENT <span>G</span>ROUP
            </Link>
            <ul className="nav-links">
              <li><Link href="/markets" className="active">Markets</Link></li>
              <li><Link href="/#how-it-works">How It Works</Link></li>
              <li><Link href="/#about">About</Link></li>
              <li><Link href="/#contact">Contact</Link></li>
              <li><Link href="/admin" className="nav-admin">Admin</Link></li>
            </ul>
          </div>
        </nav>
        <main className="markets-page">
          <div className="container">
            <div className="loading-state">
              <p>Loading markets...</p>
            </div>
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
            <li><Link href="/markets" className="active">Markets</Link></li>
            <li><Link href="/#how-it-works">How It Works</Link></li>
            <li><Link href="/#about">About</Link></li>
            <li><Link href="/#contact">Contact</Link></li>
            <li><Link href="/admin" className="nav-admin">Admin</Link></li>
          </ul>
        </div>
      </nav>

      <main className="markets-page">
        <div className="container">
          <div className="markets-header">
            <h1>Prediction Markets</h1>
            <p>Trade on MIG member career outcomes</p>
          </div>

          {error && (
            <div className="error-banner">
              {error} - <button onClick={fetchMarkets}>Retry</button>
            </div>
          )}

          <div className="markets-filters">
            <div className="filter-group">
              <label>Category:</label>
              <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="all">All Categories</option>
                <option value="salary">💰 Salary</option>
                <option value="placement">🏢 Placement</option>
                <option value="return-offer">📋 Return Offer</option>
                <option value="career">📈 Career</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Status:</label>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="open">Open</option>
                <option value="resolved">Resolved</option>
                <option value="all">All</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Sort by:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="volume">Highest Volume</option>
                <option value="newest">Newest</option>
                <option value="ending">Ending Soon</option>
              </select>
            </div>
          </div>

          <div className="markets-stats">
            <div className="markets-stat">
              <span className="stat-number">{markets.filter(m => m.status === 'open').length}</span>
              <span className="stat-text">Open Markets</span>
            </div>
            <div className="markets-stat">
              <span className="stat-number">${markets.reduce((sum, m) => sum + m.volume, 0).toLocaleString()}</span>
              <span className="stat-text">Total Volume</span>
            </div>
            <div className="markets-stat">
              <span className="stat-number">{markets.filter(m => m.status === 'resolved').length}</span>
              <span className="stat-text">Resolved</span>
            </div>
          </div>

          <div className="markets-list">
            {filteredMarkets.map(market => (
              <div key={market.id} className={`market-card ${market.status}`}>
                <div className="market-header">
                  <span className="market-category">{getCategoryLabel(market.category)}</span>
                  <span className={`market-status status-${market.status}`}>
                    {market.status === 'resolved' ? `Resolved: ${market.resolution}` : 'Open'}
                  </span>
                </div>
                <h3 className="market-title">{market.title}</h3>
                <p className="market-description">{market.description}</p>

                {market.isMultiple ? (
                  <div className="market-options">
                    {market.options.map((opt, i) => (
                      <div key={i} className="market-option">
                        <span className="option-name">{opt.name}</span>
                        <span className="option-price">{(opt.price * 100).toFixed(0)}%</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="market-prices">
                    <div className="price yes-price">
                      <span className="price-label">YES</span>
                      <span className="price-value">{(market.yesPrice * 100).toFixed(0)}¢</span>
                    </div>
                    <div className="price-bar">
                      <div className="price-fill" style={{ width: `${market.yesPrice * 100}%` }}></div>
                    </div>
                    <div className="price no-price">
                      <span className="price-label">NO</span>
                      <span className="price-value">{((1 - market.yesPrice) * 100).toFixed(0)}¢</span>
                    </div>
                  </div>
                )}

                <div className="market-footer">
                  <span className="market-volume">${market.volume.toLocaleString()} volume</span>
                  <span className="market-date">
                    {market.status === 'resolved' ? 'Resolved' : `Ends ${new Date(market.endDate).toLocaleDateString()}`}
                  </span>
                </div>

                {market.status === 'open' && !market.isMultiple && (
                  <button
                    className="btn btn-primary market-bet-btn"
                    onClick={() => setSelectedMarket(market)}
                  >
                    Place Bet
                  </button>
                )}
              </div>
            ))}
          </div>

          {filteredMarkets.length === 0 && (
            <div className="no-markets">
              <p>No markets found matching your filters.</p>
            </div>
          )}
        </div>
      </main>

      {/* Bet Modal */}
      {selectedMarket && (
        <div className="modal-overlay" onClick={() => setSelectedMarket(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedMarket(null)}>×</button>
            <h2>Place a Bet</h2>
            <p className="modal-market-title">{selectedMarket.title}</p>

            <div className="current-prices">
              <div className="current-price">
                <span>YES: {(selectedMarket.yesPrice * 100).toFixed(0)}¢</span>
              </div>
              <div className="current-price">
                <span>NO: {((1 - selectedMarket.yesPrice) * 100).toFixed(0)}¢</span>
              </div>
            </div>

            <form onSubmit={handleBet}>
              <div className="bet-sides">
                <button
                  type="button"
                  className={`bet-side-btn yes ${betSide === 'yes' ? 'active' : ''}`}
                  onClick={() => setBetSide('yes')}
                >
                  Buy YES
                </button>
                <button
                  type="button"
                  className={`bet-side-btn no ${betSide === 'no' ? 'active' : ''}`}
                  onClick={() => setBetSide('no')}
                >
                  Buy NO
                </button>
              </div>

              <div className="form-group">
                <label>Amount ($)</label>
                <input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  placeholder="Enter amount"
                  min="1"
                  step="1"
                  required
                  disabled={placing}
                />
              </div>

              {betAmount && (
                <div className="bet-summary">
                  <p>You&apos;ll get approximately <strong>
                    {(parseFloat(betAmount) / (betSide === 'yes' ? selectedMarket.yesPrice : 1 - selectedMarket.yesPrice)).toFixed(0)} shares
                  </strong></p>
                  <p>Potential payout if {betSide.toUpperCase()}: <strong>
                    ${(parseFloat(betAmount) / (betSide === 'yes' ? selectedMarket.yesPrice : 1 - selectedMarket.yesPrice)).toFixed(2)}
                  </strong></p>
                </div>
              )}

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={placing}>
                {placing ? 'Placing...' : 'Confirm Bet'}
              </button>
            </form>
          </div>
        </div>
      )}

      <footer className="footer" style={{ marginTop: '4rem' }}>
        <div className="container">
          <div className="footer-bottom">
            <p>&copy; 2024 Chud Investment Group. All rights reserved. Go Blue!</p>
          </div>
        </div>
      </footer>
    </>
  );
}
