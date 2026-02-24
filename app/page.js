'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    interest: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your interest! Our team will contact you shortly.');
    setFormData({ name: '', email: '', interest: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      {/* Navigation */}
      <nav className="nav">
        <div className="container nav-content">
          <a href="#" className="logo">
            <span>C</span>HUD <span>I</span>NVESTMENT <span>G</span>ROUP
          </a>
          <ul className="nav-links">
            <li><Link href="/markets">Markets</Link></li>
            <li><a href="#how-it-works">How It Works</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><Link href="/admin" className="nav-admin">Admin</Link></li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-content">
          <div className="hero-text">
            <h1>
              Predict the <span>Future</span> of MIG Members
            </h1>
            <p>
              The premier prediction market for University of Michigan students.
              Bet on summer intern salaries, company placements, and career outcomes
              of Michigan Investment Group members.
            </p>
            <div>
              <Link href="/markets" className="btn btn-primary">View Markets</Link>
              <a href="#how-it-works" className="btn btn-secondary">Learn More</a>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-graphic">
              <div className="hero-stats">
                <div className="stat">
                  <div className="stat-value">$300</div>
                  <div className="stat-label">Total Volume</div>
                </div>
                <div className="stat">
                  <div className="stat-value">10</div>
                  <div className="stat-label">Active Traders</div>
                </div>
                <div className="stat">
                  <div className="stat-value">2</div>
                  <div className="stat-label">Open Markets</div>
                </div>
                <div className="stat">
                  <div className="stat-value">0</div>
                  <div className="stat-label">Resolved</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="services" id="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>
              Trade on the outcomes of MIG members&apos; careers and internships.
              Put your insider knowledge to work.
            </p>
          </div>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">🎯</div>
              <h3>Choose a Market</h3>
              <p>
                Browse open markets on intern salaries, company placements,
                return offer rates, and more. Each market has clear resolution criteria.
              </p>
            </div>
            <div className="service-card">
              <div className="service-icon">💵</div>
              <h3>Place Your Bets</h3>
              <p>
                Buy shares in outcomes you believe in. Prices reflect the crowd&apos;s
                probability estimate. Buy low, sell high.
              </p>
            </div>
            <div className="service-card">
              <div className="service-icon">🏆</div>
              <h3>Win Big</h3>
              <p>
                When markets resolve, correct predictions pay out. The better
                your information, the more you can earn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Markets Section */}
      <section className="products" id="markets-preview">
        <div className="container">
          <div className="section-header">
            <h2>Featured Markets</h2>
            <p>
              Hot markets with the most action right now
            </p>
          </div>
          <div className="products-grid">
            <div className="product-card">
              <h3>Intern Salary Markets</h3>
              <p>
                Predict the total compensation packages for MIG members&apos;
                summer internships. Will they break $15K/month?
              </p>
              <ul className="product-features">
                <li>Over/under on monthly salary</li>
                <li>Signing bonus predictions</li>
                <li>Total comp rankings</li>
              </ul>
            </div>
            <div className="product-card">
              <h3>Company Placement</h3>
              <p>
                Which firms will MIG members land at? Bet on specific
                companies or categories.
              </p>
              <ul className="product-features">
                <li>Bulge bracket vs boutique</li>
                <li>Tech vs finance placement</li>
                <li>Specific firm predictions</li>
              </ul>
            </div>
            <div className="product-card">
              <h3>Return Offer Rates</h3>
              <p>
                Will they get the return offer? Predict conversion rates
                for individual members or cohorts.
              </p>
              <ul className="product-features">
                <li>Individual return offers</li>
                <li>Cohort conversion rates</li>
                <li>Full-time placement odds</li>
              </ul>
            </div>
            <div className="product-card">
              <h3>Career Outcomes</h3>
              <p>
                Longer-term bets on career trajectories, promotions,
                and industry switches.
              </p>
              <ul className="product-features">
                <li>First-year analyst rankings</li>
                <li>MBA admission odds</li>
                <li>5-year career predictions</li>
              </ul>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link href="/markets" className="btn btn-primary">View All Markets</Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about" id="about">
        <div className="container about-content">
          <div className="about-text">
            <h2>About Chud Investment Group</h2>
            <p>
              Founded by University of Michigan students in 2024, Chud Investment Group
              brings prediction markets to the world of campus recruiting. We believe
              that collective intelligence can forecast career outcomes better than
              any individual.
            </p>
            <p>
              Our platform lets MIG members and friends put their social knowledge
              to work. Who&apos;s going to crush their internship? Who&apos;s getting that
              Jane Street offer? Now you can bet on it.
            </p>
          </div>
          <div className="about-stats">
            <div className="about-stat">
              <div className="about-stat-value">2026</div>
              <div className="about-stat-label">Founded</div>
            </div>
            <div className="about-stat">
              <div className="about-stat-value">$300</div>
              <div className="about-stat-label">Volume Traded</div>
            </div>
            <div className="about-stat">
              <div className="about-stat-value">10</div>
              <div className="about-stat-label">Active Users</div>
            </div>
            <div className="about-stat">
              <div className="about-stat-value">Beta</div>
              <div className="about-stat-label">Status</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact" id="contact">
        <div className="container contact-content">
          <div className="contact-info">
            <h2>Get Access</h2>
            <p>
              We&apos;re currently in private beta with MIG members and friends.
              Request access to start trading.
            </p>
            <ul className="contact-details">
              <li>📍 Ann Arbor, MI</li>
              <li>📧 kzheng@chudinvestmentgroup.com</li>
            </ul>
          </div>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your.email@umich.edu"
              />
            </div>
            <div className="form-group">
              <label htmlFor="interest">How do you know MIG?</label>
              <select
                id="interest"
                name="interest"
                value={formData.interest}
                onChange={handleChange}
                required
              >
                <option value="">Select one</option>
                <option value="member">Current MIG Member</option>
                <option value="alumni">MIG Alumni</option>
                <option value="friend">Friend of MIG</option>
                <option value="ross">Ross Student</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="message">Why do you want access?</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us why you'd be a good trader..."
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Request Access
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="logo">
                <span>C</span>HUD <span>I</span>NVESTMENT <span>G</span>ROUP
              </div>
              <p>
                The prediction market for MIG career outcomes.
                Founded 2024 at the University of Michigan.
              </p>
            </div>
            <div className="footer-links">
              <h4>Markets</h4>
              <ul>
                <li><Link href="/markets">All Markets</Link></li>
                <li><Link href="/markets?category=salary">Salary</Link></li>
                <li><Link href="/markets?category=placement">Placement</Link></li>
                <li><Link href="/markets?category=outcomes">Outcomes</Link></li>
              </ul>
            </div>
            <div className="footer-links">
              <h4>Company</h4>
              <ul>
                <li><a href="#about">About Us</a></li>
                <li><a href="#how-it-works">How It Works</a></li>
                <li><a href="#contact">Contact</a></li>
                <li><Link href="/admin">Admin</Link></li>
              </ul>
            </div>
            <div className="footer-links">
              <h4>Legal</h4>
              <ul>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Rules</a></li>
              </ul>
            </div>
          </div>
          <div className="disclaimer">
            <strong>Disclaimer:</strong> This platform is for entertainment and educational
            purposes only. All trading involves risk. This is not a licensed gambling platform.
            Participation is limited to approved University of Michigan community members.
            Please trade responsibly.
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Chud Investment Group. All rights reserved. Go Blue! 〽️</p>
          </div>
        </div>
      </footer>
    </>
  );
}
