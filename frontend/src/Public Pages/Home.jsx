import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useCountUp from '../Hooks/useCountUp';

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  const statsRef = useRef(null);

  // Intersection Observer to detect visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, []);

  // Use the custom hook for counting
  const yearsOfExperience = useCountUp(20, isVisible);
  const satisfiedCustomers = useCountUp(500, isVisible);
  const branchLocations = useCountUp(30, isVisible);
  const assetsManaged = useCountUp(50, isVisible);
  
  return (
        <div>
          {/* Hero Section */}
          <section
            className="position-relative overflow-hidden text-white min-vh-100 d-flex align-items-center justify-content-center"
            style={{
              backgroundColor: '#1A3D8F',
              backgroundImage: `url('/online_banking_hero_image.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundBlendMode: 'overlay',
              opacity: 0.95,
            }}
          >
            <div className="container text-center position-relative">
              <h1
                className="display-3 fw-bold mb-4"
                style={{
                  color: '#FFFFFF',
                  textShadow: '0 4px 8px rgba(0, 0, 0, 0.7)',
                  lineHeight: '1.2',
                }}
              >
                Banking Made Simple, Secure, and Smart
              </h1>
              <p
                className="lead mb-5"
                style={{
                  color: '#E0E0E0',
                  fontSize: '1.25rem',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.6)',
                }}
              >
                Discover innovative banking solutions tailored to your financial success. Experience the future of banking today.
              </p>
              <div className="d-flex justify-content-center gap-4">
                <Link
                  to="/login"
                  className="btn btn-outline-light px-4 py-2"
                  style={{
                    borderColor: '#FFFFFF',
                    color: '#FFFFFF',
                    fontWeight: 'bold',
                    borderRadius: '30px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF', e.currentTarget.style.color = '#1A3D8F')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent', e.currentTarget.style.color = '#FFFFFF')}
                >
                  Log In
                </Link>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-5 bg-white">
            <div className="container text-center">
              <h2 className="fw-bold">Why Choose Neon Trust Bank</h2>
              <p className="text-muted">
                We provide innovative banking solutions with a focus on security, convenience, and personalized service.
              </p>
              <div className="row mt-4">
                <div className="col-md-4">
                  <div className="card border-0 shadow-sm">
                    <div className="card-body">
                      <div className="icon text-white rounded-circle mb-3 mx-auto" style={{ width: '50px', height: '50px', lineHeight: '50px', backgroundColor: '#1A3D8F' }}>
                        <i className="fas fa-shield-alt"></i>
                      </div>
                      <h5 className="card-title">Secure Banking</h5>
                      <p className="card-text">
                        State-of-the-art security protocols and encryption to keep your financial data safe and protected.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card border-0 shadow-sm">
                    <div className="card-body">
                      <div className="icon text-white rounded-circle mb-3 mx-auto" style={{ width: '50px', height: '50px', lineHeight: '50px', backgroundColor: '#1A3D8F' }}>
                        <i className="fas fa-mobile-alt"></i>
                      </div>
                      <h5 className="card-title">Mobile Banking</h5>
                      <p className="card-text">
                        Access your accounts, make transfers, pay bills, and more from anywhere with our intuitive mobile app.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card border-0 shadow-sm">
                    <div className="card-body">
                      <div className="icon text-white rounded-circle mb-3 mx-auto" style={{ width: '50px', height: '50px', lineHeight: '50px', backgroundColor: '#1A3D8F' }}>
                        <i className="fas fa-chart-line"></i>
                      </div>
                      <h5 className="card-title">Financial Planning</h5>
                      <p className="card-text">
                        Personalized financial advice and tools to help you achieve your short and long-term financial goals.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

                {/* Services Preview */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-4">
            <h2 className="fw-bold">Our Banking Services</h2>
            <p className="text-muted">
              Comprehensive financial solutions tailored to meet your personal and business needs.
            </p>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm">
                <div
                  className="card-img-top"
                  style={{
                    height: '200px',
                    backgroundImage: `url('/personal_banking.png')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                ></div>
                <div className="card-body">
                  <h5 className="card-title">Personal Banking</h5>
                  <p className="card-text">
                    Checking and savings accounts, credit cards, personal loans, and more to manage your daily finances.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm">
                <div
                  className="card-img-top"
                  style={{
                    height: '200px',
                    backgroundImage: `url('/business_banking.png')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                ></div>
                <div className="card-body">
                  <h5 className="card-title">Business Banking</h5>
                  <p className="card-text">
                    Business accounts, merchant services, commercial loans, and cash management solutions for businesses.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm">
                <div
                  className="card-img-top"
                  style={{
                    height: '200px',
                    backgroundImage: `url('/wealth_management.png')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                ></div>
                <div className="card-body">
                  <h5 className="card-title">Wealth Management</h5>
                  <p className="card-text">
                    Investment services, retirement planning, estate planning, and wealth preservation strategies.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-4">
            <Link to="/services" className="btn" style={{ backgroundColor: '#1A3D8F', color: '#FFFFFF' }}>View All Services</Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-5 text-white" style={{ backgroundColor: '#1A3D8F' }} ref={statsRef}>
        <div className="container">
          <div className="row text-center g-4">
            <div className="col-md-3">
              <h3 className="display-6 fw-bold">{yearsOfExperience}+</h3>
              <p className="text-light">Years of Experience</p>
            </div>
            <div className="col-md-3">
              <h3 className="display-6 fw-bold">{satisfiedCustomers}K +</h3>
              <p className="text-light">Satisfied Customers</p>
            </div>
            <div className="col-md-3">
              <h3 className="display-6 fw-bold">{branchLocations}+</h3>
              <p className="text-light">Branch Locations</p>
            </div>
            <div className="col-md-3">
              <h3 className="display-6 fw-bold">${assetsManaged}M +</h3>
              <p className="text-light">Assets Managed</p>
            </div>
          </div>
        </div>
      </section>
    
          {/* Testimonials */}
          <section className="py-5 bg-light">
            <div className="container">
              <h2 className="fw-bold">What Our Clients Say</h2>
              <p className="text-muted">
                Hear from our satisfied customers about their experience with SecureBank.
              </p>
              <div className="row mt-4">
                <div className="col-md-4 mt-2">
                  <div className="card border-0 shadow-sm">
                    <div className="card-body">
                      <div className="text-warning mb-3">
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                      </div>
                      <p className="card-text">
                        "Neon Trust Bank has transformed how I manage my finances. Their mobile app is intuitive and their customer service is exceptional."
                      </p>
                      <div className="d-flex align-items-center mt-3">
                        <div className="rounded-circle text-white d-flex justify-content-center align-items-center" style={{ width: '40px', height: '40px', backgroundColor: '#1A3D8F' }}>
                          JD
                        </div>
                        <div className="ms-3">
                          <h6 className="mb-0">John Doe</h6>
                          <small className="text-muted">Personal Banking Customer</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mt-2">
                  <div className="card border-0 shadow-sm">
                    <div className="card-body">
                      <div className="text-warning mb-3">
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                      </div>
                      <p className="card-text">
                        "As a small business owner, I needed a bank that understood my unique challenges. Neon Trust Bank's business solutions have helped me streamline operations."
                      </p>
                      <div className="d-flex align-items-center mt-3">
                        <div className="rounded-circle text-white d-flex justify-content-center align-items-center" style={{ width: '40px', height: '40px', backgroundColor: '#1A3D8F' }}>
                          JS
                        </div>
                        <div className="ms-3">
                          <h6 className="mb-0">Jane Smith</h6>
                          <small className="text-muted">Business Banking Customer</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mt-2">
                  <div className="card border-0 shadow-sm">
                    <div className="card-body">
                      <div className="text-warning mb-3">
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star-half-alt"></i>
                      </div>
                      <p className="card-text">
                        "The wealth management team at Neon Trust Bank has been instrumental in helping me plan for retirement. Their personalized approach has given me peace of mind."
                      </p>
                      <div className="d-flex align-items-center mt-3">
                        <div className="rounded-circle text-white d-flex justify-content-center align-items-center" style={{ width: '40px', height: '40px', backgroundColor: '#1A3D8F' }}>
                          RJ
                        </div>
                        <div className="ms-3">
                          <h6 className="mb-0">Robert Johnson</h6>
                          <small className="text-muted">Wealth Management Client</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
    
          {/* CTA Section */}
          <section className="py-5 text-white" style={{ backgroundColor: '#1A3D8F' }}>
            <div className="container text-center">
              <h2 className="fw-bold">Ready to experience better banking?</h2>
              <p className="lead">Open an account today and discover why thousands of customers trust SecureBank with their financial needs.</p>
              <Link to="/register" className="btn" style={{ backgroundColor: '#FFFFFF', color: '#1A3D8F' }}>Get Started Now </Link>
            </div>
          </section>
        </div>


  );
};

export default Home;