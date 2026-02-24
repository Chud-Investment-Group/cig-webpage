'use client';

import { useState } from 'react';

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
            <li><a href="#services">Services</a></li>
            <li><a href="#products">Products</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-content">
          <div className="hero-text">
            <h1>
              Unlocking <span>Liquidity</span> for Michigan Students
            </h1>
            <p>
              We create innovative derivative products that provide UMich students
              with access to capital when they need it most. Turn your future potential
              into present opportunity.
            </p>
            <div>
              <a href="#contact" className="btn btn-primary">Get Started</a>
              <a href="#products" className="btn btn-secondary">Our Products</a>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-graphic">
              <div className="hero-stats">
                <div className="stat">
                  <div className="stat-value">$2M+</div>
                  <div className="stat-label">Liquidity Provided</div>
                </div>
                <div className="stat">
                  <div className="stat-value">500+</div>
                  <div className="stat-label">Students Served</div>
                </div>
                <div className="stat">
                  <div className="stat-value">15+</div>
                  <div className="stat-label">Asset Classes</div>
                </div>
                <div className="stat">
                  <div className="stat-value">98%</div>
                  <div className="stat-label">Satisfaction Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services" id="services">
        <div className="container">
          <div className="section-header">
            <h2>Our Services</h2>
            <p>
              We specialize in creating customized financial solutions tailored
              to the unique needs of university students.
            </p>
          </div>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">📊</div>
              <h3>Derivative Structuring</h3>
              <p>
                Custom derivative products designed around your specific assets
                and liquidity needs, from future earnings to tangible assets.
              </p>
            </div>
            <div className="service-card">
              <div className="service-icon">💰</div>
              <h3>Liquidity Solutions</h3>
              <p>
                Access capital without selling your assets outright. Our structures
                let you maintain upside while getting cash today.
              </p>
            </div>
            <div className="service-card">
              <div className="service-icon">🎓</div>
              <h3>Student-First Approach</h3>
              <p>
                Products designed specifically for UMich students, with terms
                that align with academic schedules and career trajectories.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="products" id="products">
        <div className="container">
          <div className="section-header">
            <h2>Derivative Products</h2>
            <p>
              Innovative financial instruments backed by various underlying assets
            </p>
          </div>
          <div className="products-grid">
            <div className="product-card">
              <h3>Income Share Derivatives</h3>
              <p>
                Structured products based on projected future earnings, allowing
                students to monetize their career potential today.
              </p>
              <ul className="product-features">
                <li>Flexible repayment tied to income</li>
                <li>No fixed monthly payments during school</li>
                <li>Career-aligned terms</li>
              </ul>
            </div>
            <div className="product-card">
              <h3>Asset-Backed Notes</h3>
              <p>
                Liquidity against tangible assets including vehicles, equipment,
                and other valuable property.
              </p>
              <ul className="product-features">
                <li>Retain asset ownership</li>
                <li>Competitive rates</li>
                <li>Quick approval process</li>
              </ul>
            </div>
            <div className="product-card">
              <h3>Tuition Forward Contracts</h3>
              <p>
                Lock in current tuition rates or hedge against increases with
                our forward contract structures.
              </p>
              <ul className="product-features">
                <li>Protection against tuition hikes</li>
                <li>Predictable education costs</li>
                <li>Transferable contracts</li>
              </ul>
            </div>
            <div className="product-card">
              <h3>Scholarship Monetization</h3>
              <p>
                Convert future scholarship disbursements into immediate capital
                for current needs.
              </p>
              <ul className="product-features">
                <li>Immediate access to funds</li>
                <li>Structured payback options</li>
                <li>No credit check required</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about" id="about">
        <div className="container about-content">
          <div className="about-text">
            <h2>About Chud Investment Group</h2>
            <p>
              Founded by University of Michigan alumni, Chud Investment Group
              understands the unique financial challenges facing today&apos;s students.
              We&apos;ve built a platform that bridges the gap between future potential
              and present needs.
            </p>
            <p>
              Our team combines expertise in quantitative finance, risk management,
              and student lending to create products that work for students, not
              against them. We&apos;re committed to transparent terms, fair pricing,
              and student success.
            </p>
          </div>
          <div className="about-stats">
            <div className="about-stat">
              <div className="about-stat-value">2019</div>
              <div className="about-stat-label">Founded</div>
            </div>
            <div className="about-stat">
              <div className="about-stat-value">$50M</div>
              <div className="about-stat-label">AUM</div>
            </div>
            <div className="about-stat">
              <div className="about-stat-value">12</div>
              <div className="about-stat-label">Team Members</div>
            </div>
            <div className="about-stat">
              <div className="about-stat-value">A+</div>
              <div className="about-stat-label">BBB Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact" id="contact">
        <div className="container contact-content">
          <div className="contact-info">
            <h2>Get In Touch</h2>
            <p>
              Ready to explore your liquidity options? Contact our team to discuss
              how we can help you access the capital you need.
            </p>
            <ul className="contact-details">
              <li>📍 Ann Arbor, MI 48104</li>
              <li>📧 info@chudinvestment.com</li>
              <li>📞 (734) 555-0123</li>
              <li>🕐 Mon-Fri: 9:00 AM - 6:00 PM EST</li>
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
              <label htmlFor="interest">Product Interest</label>
              <select
                id="interest"
                name="interest"
                value={formData.interest}
                onChange={handleChange}
                required
              >
                <option value="">Select a product</option>
                <option value="income-share">Income Share Derivatives</option>
                <option value="asset-backed">Asset-Backed Notes</option>
                <option value="tuition-forward">Tuition Forward Contracts</option>
                <option value="scholarship">Scholarship Monetization</option>
                <option value="other">Other / General Inquiry</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your liquidity needs..."
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Submit Inquiry
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
                Providing innovative liquidity solutions for University of Michigan
                students since 2019.
              </p>
            </div>
            <div className="footer-links">
              <h4>Products</h4>
              <ul>
                <li><a href="#products">Income Share</a></li>
                <li><a href="#products">Asset-Backed</a></li>
                <li><a href="#products">Tuition Forward</a></li>
                <li><a href="#products">Scholarship</a></li>
              </ul>
            </div>
            <div className="footer-links">
              <h4>Company</h4>
              <ul>
                <li><a href="#about">About Us</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#contact">Contact</a></li>
                <li><a href="#">Careers</a></li>
              </ul>
            </div>
            <div className="footer-links">
              <h4>Legal</h4>
              <ul>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Disclosures</a></li>
                <li><a href="#">Compliance</a></li>
              </ul>
            </div>
          </div>
          <div className="disclaimer">
            <strong>Important Disclosure:</strong> Chud Investment Group products involve
            financial risk. Past performance does not guarantee future results. All derivative
            products are subject to terms and conditions. Not FDIC insured. Please review all
            documentation carefully before entering into any agreement.
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Chud Investment Group. All rights reserved. Go Blue! 〽️</p>
          </div>
        </div>
      </footer>
    </>
  );
}
