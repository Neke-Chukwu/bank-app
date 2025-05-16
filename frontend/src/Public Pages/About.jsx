import React from "react";

const AboutPage = () => {
  return (
    <div className="min-vh-100">
      {/* About Header */}
      <section className="text-white py-5 " style={{ backgroundColor: "#1A3D8F" }}>
        <div className="container text-center py-4">
          <h1 className="display-4 fw-bold mb-2">About Neon Trust Bank</h1>
          <p className="lead">
            A trusted financial partner committed to your success since 2005.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <div className="rounded overflow-hidden">
                <img
                  src="/bank_hq.png"
                  alt="Neon Trust Bank Headquarters"
                  loading="lazy"
                  className="img-fluid"
                />
              </div>
            </div>
            <div className="col-lg-6">
              <h2 className="h3 fw-bold mb-4">Our Story</h2>
              <p className="text-muted mb-3">
                Founded in 2005, Neon Trust Bank was established with a clear mission: to provide innovative financial
                solutions while maintaining the highest standards of security and customer service. What began as a
                single branch has grown into a nationwide network of over 100 locations.
              </p>
              <p className="text-muted mb-3">
                Throughout our journey, we've remained committed to our founding principles of integrity, innovation,
                and customer focus. We've continuously evolved our services and technology to meet the changing needs
                of our customers while maintaining the personal touch that sets us apart.
              </p>
              <p className="text-muted">
                Today, Neon Trust Bank serves over 500,000 customers across the country, from individuals and families to
                small businesses and large corporations. We're proud of our growth but even prouder of the trust our
                customers place in us every day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="h3 fw-bold">Our Mission & Values</h2>
            <p className="text-muted">
              The principles that guide everything we do at SecureBank.
            </p>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm text-center">
                <div className="card-body">
                <div
                className="rounded-circle text-white d-flex align-items-center justify-content-center mx-auto mb-4"
                style={{ width: "64px", height: "64px", backgroundColor: "#1A3D8F"}}>
                    <i className="fas fa-shield-alt"></i>
                  </div>
                  <h5 className="card-title fw-bold">Integrity</h5>
                  <p className="card-text text-muted">
                    We act with honesty, transparency, and ethical responsibility in everything we do, building trust
                    with our customers and communities.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm text-center">
                <div className="card-body">
                <div
                className="rounded-circle text-white d-flex align-items-center justify-content-center mx-auto mb-4"
                style={{ width: "64px", height: "64px", backgroundColor: "#1A3D8F"}}>
                    <i className="fas fa-lightbulb"></i>
                  </div>
                  <h5 className="card-title fw-bold">Innovation</h5>
                  <p className="card-text text-muted">
                    We continuously seek new and better ways to serve our customers, embracing technology and creative
                    solutions to meet evolving needs.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm text-center">
                <div className="card-body">
                <div
                className="rounded-circle text-white d-flex align-items-center justify-content-center mx-auto mb-4"
                style={{ width: "64px", height: "64px", backgroundColor: "#1A3D8F"}}>
                    <i className="fas fa-users"></i>
                  </div>
                  <h5 className="card-title fw-bold">Customer Focus</h5>
                  <p className="card-text text-muted">
                    We put our customers at the center of everything we do, listening to their needs and working
                    tirelessly to exceed their expectations.
                  </p>
                </div>
              </div>
            </div>
            <div className="container py-5">
      <div className="row g-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm text-center">
            <div className="card-body">
              <div
                className="rounded-circle text-white d-flex align-items-center justify-content-center mx-auto mb-4"
                style={{ width: "64px", height: "64px", backgroundColor: "#1A3D8F" }}
              >
                <i className="fas fa-chart-line fs-4"></i>
              </div>
              <h3 className="h5 fw-bold mb-3">Excellence</h3>
              <p className="text-muted">
                We strive for excellence in all aspects of our operations, maintaining the highest standards of quality
                and professionalism.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm text-center">
            <div className="card-body">
              <div
                className="rounded-circle text-white d-flex align-items-center justify-content-center mx-auto mb-4"
                style={{ width: "64px", height: "64px", backgroundColor: "#1A3D8F" }}
              >
                <i className="fas fa-hands-helping fs-4"></i>
              </div>
              <h3 className="h5 fw-bold mb-3">Community</h3>
              <p className="text-muted">
                We are committed to making a positive impact in the communities we serve through investment,
                volunteerism, and sustainable practices.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm text-center">
            <div className="card-body">
              <div
                className="rounded-circle text-white d-flex align-items-center justify-content-center mx-auto mb-4"
                style={{ width: "64px", height: "64px", backgroundColor: "#1A3D8F"}}
              >
                <i className="fas fa-lock fs-4"></i>
              </div>
              <h3 className="h5 fw-bold mb-3">Security</h3>
              <p className="text-muted">
                We prioritize the security and privacy of our customers' information and assets through rigorous
                safeguards and continuous vigilance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="h3 fw-bold">Our Leadership Team</h2>
            <p className="text-muted">
              Meet the experienced professionals guiding Neon Trust Bank's vision and strategy.
            </p>
          </div>
          <div className="row g-4">
            {/* Team Member 1 */}
            <div className="col-md-4">
              <div className="card border-0 shadow-sm">
                <div
                  className="card-img-top"
                  style={{
                    height: "350px",
                    backgroundImage: `url('/CEO.png')`,
                    backgroundSize: "cover",
                  }}
                ></div>
                <div className="card-body text-center">
                  <h5 className="card-title fw-bold">Michael Anderson</h5>
                  <p style={{color: "#1A3D8F"}}>Chief Executive Officer</p>
                  <p className="text-muted">
                    With over 25 years of experience in financial services, Michael has led Neon Trust Bank's growth and
                    innovation strategy since 2010.
                  </p>
                  <div className="d-flex justify-content-center gap-3">
                   <i className="fab fa-linkedin text-muted"></i>
                   <i className="fab fa-twitter text-muted"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Member 2 */}
            <div className="col-md-4">
              <div className="card border-0 shadow-sm">
                <div
                  className="card-img-top"
                  style={{
                    height: "350px",
                    backgroundImage: `url('/CFO.png')`,
                    backgroundSize: "cover",
                  }}
                ></div>
                <div className="card-body text-center">
                  <h5 className="card-title fw-bold">Sarah Johnson</h5>
                  <p style={{color: "#1A3D8F"}}>Chief Financial Officer</p>
                  <p className="text-muted">
                    Sarah brings 20 years of financial expertise and has been instrumental in strengthening Neon Trust Bank's
                    financial position since 2012.
                  </p>
                  <div className="d-flex justify-content-center gap-3">
                   <i className="fab fa-linkedin text-muted"></i>
                   <i className="fab fa-twitter text-muted"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Member 3 */}
            <div className="col-md-4">
              <div className="card border-0 shadow-sm">
                <div
                  className="card-img-top"
                  style={{
                    height: "350px",
                    backgroundImage: `url('/CTO.png')`,
                    backgroundSize: "cover",
                  }}
                ></div>
                <div className="card-body text-center">
                  <h5 className="card-title fw-bold">David Garcia</h5>
                  <p style={{color: "#1A3D8F"}}>Chief Technology Officer</p>
                  <p className="text-muted">
                    David leads our digital transformation initiatives, bringing 15 years of experience in financial
                    technology and cybersecurity.
                  </p>
                  <div className="d-flex justify-content-center gap-3">
                      <i className="fab fa-linkedin text-muted"></i>
                      <i className="fab fa-twitter text-muted"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Security */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="h3 fw-bold">Trust & Security</h2>
            <p className="text-muted">
              Your security is our top priority. We employ industry-leading measures to protect your financial
              information.
            </p>
          </div>
          <div className="row g-4">
            <div className="col-md-6">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-start mb-3">
                <div
                className="rounded-circle text-white d-flex align-items-center justify-content-center me-3 p-4"
                style={{ width: "40px", height: "40px", backgroundColor: "#1A3D8F"}}>
                      <i className="fas fa-lock"></i>
                    </div>
                    <div>
                      <h5 className="card-title fw-bold">Advanced Security Measures</h5>
                      <p className="card-text text-muted">
                        We implement multi-layered security protocols, including encryption, firewalls, and continuous
                        monitoring to safeguard your accounts and personal information.
                      </p>
                    </div>
                  </div>
                  <div className="d-flex align-items-start">
                  <div
                className="rounded-circle text-white d-flex align-items-center justify-content-center me-3 p-4"
                style={{ width: "40px", height: "40px", backgroundColor: "#1A3D8F"}}>
                      <i className="fas fa-shield-alt"></i>
                    </div>
                    <div>
                      <h5 className="card-title fw-bold">Fraud Protection</h5>
                      <p className="card-text text-muted">
                        Our advanced fraud detection systems monitor your accounts 24/7 for suspicious activities, with
                        real-time alerts and zero liability for unauthorized transactions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title fw-bold mb-3">Certifications & Compliance</h5>
                  <div className="row g-3">
                    <div className="col-6">
                    <div
                className="rounded-circle text-white d-flex align-items-center justify-content-center me-3 p-4"
                style={{ width: "40px", height: "40px", backgroundColor: "#1A3D8F"}}>
                        <i className="fas fa-certificate"></i>
                      </div>
                      <h6 className="fw-bold">FDIC Insured</h6>
                      <p className="text-muted small">Deposits insured up to $250,000</p>
                    </div>
                    <div className="col-6">
                    <div
                className="rounded-circle text-white d-flex align-items-center justify-content-center me-3 p-4"
                style={{ width: "40px", height: "40px", backgroundColor: "#1A3D8F"}}>
                        <i className="fas fa-shield-alt"></i>
                      </div>
                      <h6 className="fw-bold">PCI DSS Compliant</h6>
                      <p className="text-muted small">Payment Card Industry Standards</p>
                    </div>
                    <div className="col-6">
                    <div
                className="rounded-circle text-white d-flex align-items-center justify-content-center mb-2 p-4"
                style={{ width: "40px", height: "40px", backgroundColor: "#1A3D8F"}}>
                        <i className="fas fa-lock"></i>
                      </div>
                      <h6 className="fw-bold">SOC 2 Certified</h6>
                      <p className="text-muted small">Service Organization Controls</p>
                    </div>
                    <div className="col-6">
                    <div
                className="rounded-circle text-white d-flex align-items-center justify-content-center me-3 p-4"
                style={{ width: "40px", height: "40px", backgroundColor: "#1A3D8F"}}>
                        <i className="fas fa-file-contract"></i>
                      </div>
                      <h6 className="fw-bold">GLBA Compliant</h6>
                      <p className="text-muted small">Gramm-Leach-Bliley Act</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;