'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const INITIAL_MARKETS = [
  {
    id: 3,
    title: "Number of MIG members at Citadel internships ≥ 3?",
    category: "placement",
    description: "Counts Citadel Securities and Citadel LLC. Summer 2025 internships only.",
    yesPrice: 0.38,
    volume: 3200,
    endDate: "2025-07-01",
    status: "open",
    createdAt: "2024-11-28"
  },
  {
    id: 10,
    title: "Most common MIG destination: GS, MS, or JPM?",
    category: "placement",
    description: "Which bulge bracket will have the most MIG interns in summer 2025?",
    yesPrice: 0.40,
    volume: 1230,
    endDate: "2025-06-15",
    status: "open",
    createdAt: "2024-12-18",
    isMultiple: true,
    options: [
      { name: "Goldman Sachs", price: 0.40 },
      { name: "Morgan Stanley", price: 0.35 },
      { name: "JPMorgan", price: 0.25 }
    ]
  }
];

export default function Markets() {
  const [markets, setMarkets] = useState([]);
  const [filter, setFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('open');
  const [sortBy, setSortBy] = useState('volume');
  const [selectedMarket, setSelectedMarket] = useState(null);
  const [betAmount, setBetAmount] = useState('');
  const [betSide, setBetSide] = useState('yes');

  useEffect(() => {
    const stored = localStorage.getItem('cig-markets');
    if (stored) {
      setMarkets(JSON.parse(stored));
    } else {
      setMarkets(INITIAL_MARKETS);
      localStorage.setItem('cig-markets', JSON.stringify(INITIAL_MARKETS));
    }
  }, []);

  const filteredMarkets = markets
    .filter(m => filter === 'all' || m.category === filter)
    .filter(m => statusFilter === 'all' || m.status === statusFilter)
    .sort((a, b) => {
      if (sortBy === 'volume') return b.volume - a.volume;
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'ending') return new Date(a.endDate) - new Date(b.endDate);
      return 0;
    });

  const handleBet = (e) => {
    e.preventDefault();
    if (!betAmount || parseFloat(betAmount) <= 0) return;

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

    setMarkets(updatedMarkets);
    localStorage.setItem('cig-markets', JSON.stringify(updatedMarkets));
    alert(`Bet placed! $${amount} on ${betSide.toUpperCase()} for "${selectedMarket.title}"`);
    setSelectedMarket(null);
    setBetAmount('');
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

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                Confirm Bet
              </button>
            </form>
          </div>
        </div>
      )}

      <footer className="footer" style={{ marginTop: '4rem' }}>
        <div className="container">
          <div className="footer-bottom">
            <p>&copy; 2024 Chud Investment Group. All rights reserved. Go Blue! 〽️</p>
          </div>
        </div>
      </footer>
    </>
  );
}
