import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-5">
      <div className="container">
        <div className="row">
          {/* Logo and Description */}
          <div className="col-md-3 mb-4">
            <div className="d-flex align-items-center mb-3">
              <i className="fas fa-landmark text-white fs-3 me-2"></i>
              <span className="fw-bold fs-5">Neon Trust Bank</span>
            </div>
            <p className="small">
              Providing secure and innovative banking solutions since 2005.
            </p>
            <div className="d-flex gap-3">
                <i className="fab fa-facebook-f"></i>
                <i className="fab fa-twitter"></i>
                <i className="fab fa-linkedin-in"></i>
                <i className="fab fa-instagram"></i>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-md-3 mb-4">
            <h5 className="h6 fw-bold mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="text-white text-decoration-none small">Home</a></li>
              <li><a href="/services" className="text-white text-decoration-none small">Services</a></li>
              <li><a href="/about" className="text-white text-decoration-none small">About Us</a></li>
              <li><a href="/contact" className="text-white text-decoration-none small">Contact</a></li>
            </ul>
          </div>

          {/* Services */}
          <div className="col-md-3 mb-4">
            <h5 className="h6 fw-bold mb-3">Services</h5>
              <p className="text-white small m-0">Personal Banking</p>
              <p className="text-white small m-0">Business Banking</p>
              <p className="text-white small m-0">Loans</p>
              <p className="text-white small m-0">Investments</p>
              <p className="text-white small m-0">Insurance</p>
          </div>

          {/* Contact Us */}
          <div className="col-md-3 mb-4">
            <h5 className="h6 fw-bold mb-3">Contact Us</h5>
            <ul className="list-unstyled">
              <li className="d-flex align-items-start mb-2 small">
                <i className="fas fa-map-marker-alt me-2"></i>
                <span>123 Financial Street, New York, NY 10001</span>
              </li>
              <li className="d-flex align-items-center mb-2 small">
                <i className="fas fa-phone-alt me-2"></i>
                <span>+1 (555) 123-NEON</span>
              </li>
              <li className="d-flex align-items-center mb-2 small">
                <i className="fas fa-envelope me-2"></i>
                <span>info@neontrust.us</span>
              </li>
              <li className="d-flex align-items-center small">
                <i className="fas fa-clock me-2"></i>
                <span>Mon-Fri: 9:00 AM - 5:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-top border-secondary pt-4 mt-4 d-flex flex-column flex-md-row justify-content-between align-items-center">
          <p className="small mb-3 mb-md-0">© 2025 Neon Trust Bank. All rights reserved.</p>
          <div className="d-flex gap-3">
            <p className="small text-white text-decoration-none">Terms of Service</p>
            <p className="small text-white text-decoration-none">Privacy Policy</p>
            <p className="small text-white text-decoration-none">Cookie Policy</p>
          </div>
          <div className="d-flex gap-3 mt-3 mt-md-0">
            <i className="fab fa-cc-visa fs-4"></i>
            <i className="fab fa-cc-mastercard fs-4"></i>
            <i className="fab fa-cc-amex fs-4"></i>
            <i className="fab fa-cc-paypal fs-4"></i>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;