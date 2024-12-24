import React from "react";
// import { HiOutlineSearch } from 'react-icons/hi'

const PublicFooter = () => {
  
  return (
    <footer className="footer ">
      <div className="footer-container">
        {/* Help Links Section */}
        <div className="footer-section">
          {/* <h2>Help & Support</h2>
          <ul className="footer-links">
            <li><a href="/faq">FAQs</a></li>
            <li><a href="/support">Support</a></li>
            <li><a href="/terms">Terms & Conditions</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
          </ul> */}
        </div>

        {/* Contact Section */}
        <div className="footer-section">
          <h2>Contact Us</h2>
          <p>Email: <a href="mailto:firststepsnursery@outlook.com">firststepsnursery@outlook.com</a></p>
          <p>Phone: <a href="tel:+216 27506303">+216 27506303 </a></p>
          <p>Address: 77 Rue Hedi Chaker, Dar Chaabane EL fehri, 8011, Nabeul</p>
        </div>

        {/* Query Text Field */}
        <div className="footer-section">
          {/* <h2>Have a Query?</h2>
          <form className="query-form">
            <input
              type="text"
              className="query-input"
              placeholder="Enter your query..."
              aria-label="Query"
            />
            <button type="submit" className="query-button">Submit</button>
          </form> */}
        </div>

        {/* Copyright Section */}
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} First STeps Nursey. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
export default PublicFooter;
