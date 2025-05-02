import React from 'react';
import { Link } from 'react-router-dom';

const Services = () => {
  return (
    <div className="min-vh-100">
      {/* Services Header */}
      <section className="text-white py-5" style={{ backgroundColor: '#1A3D8F' }}>
        <div className="container text-center py-4">
          <h1 className="display-4 fw-bold mb-2">Our Banking Services</h1>
          <p className="lead">
            Comprehensive financial solutions designed to meet your personal and business needs.
          </p>
        </div>
      </section>

      {/* Services Categories */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row g-4">
            {/* Personal Banking */}
            <div className="col-md-4">
              <div className="card border-0 shadow-sm">
                <div
                  className="card-img-top"
                  style={{
                    height: "200px",
                    backgroundImage: `url('/personal_banking.png')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>
                <div className="card-body">
                  <h5 className="card-title">Personal Banking</h5>
                  <ul className="list-unstyled mb-3">
                    <li>
                      <i className="fas fa-check text-success me-2"></i>Checking & Savings Accounts
                    </li>
                    <li>
                      <i className="fas fa-check text-success me-2"></i>Credit & Debit Cards
                    </li>
                    <li>
                      <i className="fas fa-check text-success me-2"></i>Personal Loans
                    </li>
                    <li>
                      <i className="fas fa-check text-success me-2"></i>Mortgage & Home Equity
                    </li>
                    <li>
                      <i className="fas fa-check text-success me-2"></i>Online & Mobile Banking
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Business Banking */}
            <div className="col-md-4">
              <div className="card border-0 shadow-sm">
                <div
                  className="card-img-top"
                  style={{
                    height: "200px",
                    backgroundImage: `url('/business_banking.png')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>
                <div className="card-body">
                  <h5 className="card-title">Business Banking</h5>
                  <ul className="list-unstyled mb-3">
                    <li>
                      <i className="fas fa-check text-success me-2"></i>Business Checking & Savings
                    </li>
                    <li>
                      <i className="fas fa-check text-success me-2"></i>Merchant Services
                    </li>
                    <li>
                      <i className="fas fa-check text-success me-2"></i>Business Loans & Lines of Credit
                    </li>
                    <li>
                      <i className="fas fa-check text-success me-2"></i>Cash Management Solutions
                    </li>
                    <li>
                      <i className="fas fa-check text-success me-2"></i>Payroll Services
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Wealth Management */}
            <div className="col-md-4">
              <div className="card border-0 shadow-sm">
                <div
                  className="card-img-top"
                  style={{
                    height: "200px",
                    backgroundImage: `url('/wealth_management.png')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>
                <div className="card-body">
                  <h5 className="card-title">Wealth Management</h5>
                  <ul className="list-unstyled mb-3">
                    <li>
                      <i className="fas fa-check text-success me-2"></i>Investment Services
                    </li>
                    <li>
                      <i className="fas fa-check text-success me-2"></i>Retirement Planning
                    </li>
                    <li>
                      <i className="fas fa-check text-success me-2"></i>Estate Planning
                    </li>
                    <li>
                      <i className="fas fa-check text-success me-2"></i>Trust Services
                    </li>
                    <li>
                      <i className="fas fa-check text-success me-2"></i>Private Banking
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Digital Banking */}
            <div className="col-md-4">
              <div className="card border-0 shadow-sm">
                <div
                  className="card-img-top"
                  style={{
                    height: "200px",
                    backgroundImage: `url('/digital_banking.png')`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                  }}
                ></div>
                <div className="card-body">
                  <h5 className="card-title">Digital Banking</h5>
                  <ul className="list-unstyled mb-3">
                    <li>
                      <i className="fas fa-check text-success me-2"></i>Online Banking Platform
                    </li>
                    <li>
                      <i className="fas fa-check text-success me-2"></i>Mobile Banking App
                    </li>
                    <li>
                      <i className="fas fa-check text-success me-2"></i>Digital Payments
                    </li>
                    <li>
                      <i className="fas fa-check text-success me-2"></i>E-Statements
                    </li>
                    <li>
                      <i className="fas fa-check text-success me-2"></i>Fraud Monitoring
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Loans & Mortgages */}
            <div className="col-md-4">
              <div className="card border-0 shadow-sm">
                <div
                  className="card-img-top"
                  style={{
                    height: "200px",
                    backgroundImage: `url('/loans_mortgages.png')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>
                <div className="card-body">
                  <h5 className="card-title">Loans & Mortgages</h5>
                  <ul className="list-unstyled mb-3">
                    <li>
                      <i className="fas fa-check text-success me-2"></i>Home Mortgages
                    </li>
                    <li>
                      <i className="fas fa-check text-success me-2"></i>Home Equity Loans
                    </li>
                    <li>
                      <i className="fas fa-check text-success me-2"></i>Auto Loans
                    </li>
                    <li>
                      <i className="fas fa-check text-success me-2"></i>Personal Loans
                    </li>
                    <li>
                      <i className="fas fa-check text-success me-2"></i>Student Loans
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Insurance Services */}
            <div className="col-md-4">
              <div className="card border-0 shadow-sm">
                <div
                  className="card-img-top"
                  style={{
                    height: "200px",
                    backgroundImage: `url('/Insurance_services.png')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>
                <div className="card-body">
                  <h5 className="card-title">Insurance Services</h5>
                  <ul className="list-unstyled mb-3">
                    <li>
                      <i className="fas fa-check text-success me-2"></i>Life Insurance
                    </li>
                    <li>
                      <i className="fas fa-check text-success me-2"></i>Health Insurance
                    </li>
                    <li>
                      <i className="fas fa-check text-success me-2"></i>Home Insurance
                    </li>
                    <li>
                      <i className="fas fa-check text-success me-2"></i>Auto Insurance
                    </li>
                    <li>
                      <i className="fas fa-check text-success me-2"></i>Business Insurance
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="text-center mb-4">
            <h2 className="fw-bold">Frequently Asked Questions</h2>
            <p className="text-muted">
              Find answers to common questions about our banking services.
            </p>
          </div>
          <div className="accordion" id="faqAccordion">
            <div className="accordion-item">
              <h2 className="accordion-header" id="faq1">
                <button
                  className="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapse1"
                  aria-expanded="true"
                  aria-controls="collapse1"
                >
                  How do I open a new account?
                </button>
              </h2>
              <div
                id="collapse1"
                className="accordion-collapse collapse show"
                aria-labelledby="faq1"
                data-bs-parent="#faqAccordion"
              >
                <div className="accordion-body">
                  You can open a new account online through our website, via our mobile app, or by visiting any of our
                  branch locations. You'll need to provide identification, proof of address, and an initial deposit
                  depending on the account type.
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header" id="faq2">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapse2"
                  aria-expanded="false"
                  aria-controls="collapse2"
                >
                  What are the benefits of digital banking?
                </button>
              </h2>
              <div
                id="collapse2"
                className="accordion-collapse collapse"
                aria-labelledby="faq2"
                data-bs-parent="#faqAccordion"
              >
                <div className="accordion-body">
                  Digital banking offers 24/7 access to your accounts, convenient bill payments and transfers, mobile
                  check deposits, real-time account alerts, secure messaging, and financial management tools—all from
                  your computer or mobile device.
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header" id="faq3">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapse3"
                  aria-expanded="false"
                  aria-controls="collapse3"
                >
                  How secure is online and mobile banking?
                </button>
              </h2>
              <div
                id="collapse3"
                className="accordion-collapse collapse"
                aria-labelledby="faq3"
                data-bs-parent="#faqAccordion"
              >
                <div className="accordion-body">
                  We employ industry-leading security measures including encryption, multi-factor authentication,
                  biometric login options, and continuous monitoring for suspicious activities. We also provide fraud
                  monitoring and zero liability protection for unauthorized transactions.
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header" id="faq4">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapse4"
                  aria-expanded="false"
                  aria-controls="collapse4"
                >
                  What types of loans do you offer?
                </button>
              </h2>
              <div
                id="collapse4"
                className="accordion-collapse collapse"
                aria-labelledby="faq4"
                data-bs-parent="#faqAccordion"
              >
                <div className="accordion-body">
                  We offer a wide range of loan products including home mortgages, home equity loans, auto loans,
                  personal loans, student loans, and various business loans. Each loan type has different terms, rates,
                  and qualification requirements.
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header" id="faq5">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapse5"
                  aria-expanded="false"
                  aria-controls="collapse5"
                >
                  How can I start investing with Neon Trust Bank?
                </button>
              </h2>
              <div
                id="collapse5"
                className="accordion-collapse collapse"
                aria-labelledby="faq5"
                data-bs-parent="#faqAccordion"
              >
                <div className="accordion-body">
                  You can schedule a consultation with one of our financial advisors to discuss your investment goals
                  and options. We offer various investment services including retirement accounts, brokerage accounts,
                  managed portfolios, and more.
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-4">
            <p className="text-muted mb-3">Still have questions? Contact our customer support team.</p>
            <Link to="/contact" className="btn" style={{ backgroundColor: '#1A3D8F', color: '#FFFFFF' }}>Contact Us</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;