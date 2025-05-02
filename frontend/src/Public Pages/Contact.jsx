import React from "react";

const Contact = () => {
  return (
    <div className="min-vh-100">
      {/* Contact Header */}
      <section className="text-white py-5"  style={{ backgroundColor: "#1A3D8F" }}>
        <div className="container text-center py-4">
          <h1 className="display-4 fw-bold mb-2">Contact Us</h1>
          <p className="lead">
            We're here to help. Reach out to us with any questions or concerns.
          </p>
        </div>
      </section>

      {/* Contact Information & Form */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row g-5">
            {/* Contact Information */}
            <div className="col-lg-6">
              <h2 className="h4 fw-bold mb-4">Get in Touch</h2>
              <div className="mb-4">
                <div className="d-flex align-items-start mb-3">
                  <div className="icon text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: "40px", height: "40px",backgroundColor: "#1A3D8F" }}>
                    <i className="fas fa-map-marker-alt"></i> 
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1">Main Headquarters</h5>
                    <p className="text-muted">123 Financial Street, New York, NY 10001</p>
                  </div>
                </div>
                <div className="d-flex align-items-start mb-3">
                  <div className="icon text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: "40px", height: "40px",backgroundColor: "#1A3D8F" }}>
                    <i className="fas fa-phone-alt"></i>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1">Phone Support</h5>
                    <p className="text-muted">Customer Service: +1 (555) 123-NEON</p>
                  </div>
                </div>
                <div className="d-flex align-items-start mb-3">
                  <div className="icon text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: "40px", height: "40px",backgroundColor: "#1A3D8F"}}>
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1">Email</h5>
                    <p className="text-muted">General Inquiries: info@neontrust.us</p>
                    <p className="text-muted">Customer Support: support@neontrust.us</p>
                  </div>
                </div>
                <div className="d-flex align-items-start">
                  <div className="icon text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: "40px", height: "40px",backgroundColor: "#1A3D8F" }}>
                    <i className="fas fa-clock"></i>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1">Hours of Operation</h5>
                    <p className="text-muted">Monday - Friday: 9:00 AM - 5:00 PM</p>
                    <p className="text-muted">Saturday: 10:00 AM - 2:00 PM</p>
                    <p className="text-muted">Sunday: Closed</p>
                  </div>
                </div>
              </div>
              <h5 className="fw-bold mb-3">Connect With Us</h5>
              <div className="d-flex gap-3">
                <div className="icon rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: "40px", height: "40px", color: "#1A3D8F" }}>
                    <i className="fab fa-facebook-f" ></i>
                </div>
                <div className="icon rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: "40px", height: "40px", color: "#1A3D8F" }}>
                  <i className="fab fa-twitter"></i>
                </div>
                <div className="icon rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: "40px", height: "40px", color: "#1A3D8F" }}>
                  <i className="fab fa-linkedin-in"></i>
                </div>
                <div className="icon rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: "40px", height: "40px", color: "#1A3D8F" }}>
                  <i className="fab fa-instagram"></i>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="col-lg-6">
              <h2 className="h4 fw-bold mb-4">Send Us a Message</h2>
              <form>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="firstName" className="form-label">First Name</label>
                    <input type="text" className="form-control" id="firstName" placeholder="Enter your first name" />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="lastName" className="form-label">Last Name</label>
                    <input type="text" className="form-control" id="lastName" placeholder="Enter your last name" />
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input type="email" className="form-control" id="email" placeholder="Enter your email address" />
                </div>
                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">Phone Number</label>
                  <input type="tel" className="form-control" id="phone" placeholder="Enter your phone number" />
                </div>
                <div className="mb-3">
                  <label htmlFor="subject" className="form-label">Subject</label>
                  <select className="form-select" id="subject">
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Customer Support</option>
                    <option value="accounts">Account Services</option>
                    <option value="loans">Loans & Mortgages</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="message" className="form-label">Message</label>
                  <textarea className="form-control" id="message" rows="4" placeholder="How can we help you?"></textarea>
                </div>
                <div className="form-check mb-3">
                  <input className="form-check-input custom-check" type="checkbox" id="privacy" />
                  <label className="form-check-label" htmlFor="privacy">
                    I agree to the <a href="#"  style={{ color: '#1A3D8F' }}>Privacy Policy</a> and consent to the processing of my personal data.
                  </label>
                </div>
                <button type="submit" className="btn w-100" style={{ backgroundColor: '#1A3D8F', color: '#FFFFFF' }}>Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </section>
            {/* Branch Locations */}
            <section className="py-5 bg-light">
              <div className="container">
                <div className="text-center mb-4">
                  <h2 className="fw-bold">Find a Branch Near You</h2>
                  <p className="text-muted">
                    Visit one of our 100+ branch locations for in-person assistance.
                  </p>
                </div>
                <div className="card shadow-sm">
                  <div
                    className="card-img-top"
                    style={{
                      height: "400px",
                      backgroundImage: `url('/map.png')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-center h-100">
                      <div className="bg-white p-4 rounded shadow">
                        <h3 className="h5 fw-bold mb-3">Branch Locator</h3>
                        <p className="text-muted mb-3">
                          Find the nearest Neon Trust Bank branch or ATM.
                        </p>
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter ZIP code or city"
                          />
                          <button
                            className="btn"
                            style={{ backgroundColor: "#1A3D8F", color: "#FFFFFF" }}
                          >
                            Search
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-body">
                    <h3 className="h5 fw-bold mb-4">Featured Locations</h3>
                    <div className="row g-4">
                      <div className="col-md-4">
                        <div className="card border-0 shadow-sm">
                          <div className="card-body">
                            <h5 className="card-title fw-bold">New York - Main Branch</h5>
                            <p className="text-muted mb-1">123 Financial Street</p>
                            <p className="text-muted mb-1">New York, NY 10001</p>
                            <p className="text-muted mb-3">Phone: (555) 123-4567</p>
                            <div className="d-flex justify-content-between">
                              <span style={{ color: "#1A3D8F" }}>Mon-Fri: 9AM-5PM</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="card border-0 shadow-sm">
                          <div className="card-body">
                            <h5 className="card-title fw-bold">Boston - Downtown</h5>
                            <p className="text-muted mb-1">456 Banking Avenue</p>
                            <p className="text-muted mb-1">Boston, MA 02110</p>
                            <p className="text-muted mb-3">Phone: (555) 234-5678</p>
                            <div className="d-flex justify-content-between">
                              <span style={{ color: "#1A3D8F" }}>Mon-Fri: 9AM-5PM</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="card border-0 shadow-sm">
                          <div className="card-body">
                            <h5 className="card-title fw-bold">
                              San Francisco - Financial District
                            </h5>
                            <p className="text-muted mb-1">789 Market Street</p>
                            <p className="text-muted mb-1">San Francisco, CA 94103</p>
                            <p className="text-muted mb-3">Phone: (555) 345-6789</p>
                            <div className="d-flex justify-content-between">
                              <span style={{ color: "#1A3D8F" }}>Mon-Fri: 9AM-5PM</span>
                            </div>
                          </div>
                        </div>
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
              Find quick answers to common questions about contacting us.
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
                  What are the customer service hours?
                </button>
              </h2>
              <div
                id="collapse1"
                className="accordion-collapse collapse show"
                aria-labelledby="faq1"
                data-bs-parent="#faqAccordion"
              >
                <div className="accordion-body">
                  Our customer service phone lines are available Monday through
                  Friday from 8:00 AM to 8:00 PM, and Saturday from 9:00 AM to
                  3:00 PM. Our online chat support is available 24/7.
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
                  How quickly will I receive a response to my inquiry?
                </button>
              </h2>
              <div
                id="collapse2"
                className="accordion-collapse collapse"
                aria-labelledby="faq2"
                data-bs-parent="#faqAccordion"
              >
                <div className="accordion-body">
                  We strive to respond to all inquiries within 24 hours during
                  business days. For urgent matters, we recommend calling our
                  customer service line for immediate assistance.
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
                  How do I report a lost or stolen card?
                </button>
              </h2>
              <div
                id="collapse3"
                className="accordion-collapse collapse"
                aria-labelledby="faq3"
                data-bs-parent="#faqAccordion"
              >
                <div className="accordion-body">
                  If your card is lost or stolen, please call our 24/7 emergency
                  line immediately at (555) 999-9999. You can also freeze your
                  card temporarily through our mobile app or online banking.
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
                  How can I provide feedback about my banking experience?
                </button>
              </h2>
              <div
                id="collapse4"
                className="accordion-collapse collapse"
                aria-labelledby="faq4"
                data-bs-parent="#faqAccordion"
              >
                <div className="accordion-body">
                  We value your feedback! You can share your thoughts through
                  our contact form, by speaking with a branch manager, or by
                  participating in our customer satisfaction surveys sent via
                  email.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;