import React from "react";
// import { HiOutlineSearch } from 'react-icons/hi'
import { IoMailOutline } from "react-icons/io5";
import { FaFacebook } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa6";
import { PiPhoneLight } from "react-icons/pi";
import { BiSolidSchool } from "react-icons/bi";

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
          <p className="flex items-center justify-center gap-x-2 ">
            <IoMailOutline className="text-2xl" />{" "}
            <a href="mailto:firststepsnursery@outlook.com">
              firststepsnursery@outlook.com
            </a>
          </p>
          <p className="flex items-center justify-center gap-x-2 ">
            <PiPhoneLight className="text-2xl" />
            Phone: <a href="tel:+21627506303">+216 27 506 303</a>
          </p>
          <p className="flex items-center justify-center gap-x-2 ">
            <BiSolidSchool className="text-2xl" />
            Address: 77 Rue Hedi Chaker,
          </p>
          <p>Dar Chaabane EL Fehri,</p>
          <p>8011, Nabeul, Tunisia</p>
        </div>

        {/* Social Media Section */}
        <div className="footer-section">
          <h2>Follow Us</h2>
          <div className="social-media-links">
            <a
              href="https://www.facebook.com/people/Garderie-scolaire-First-Steps/100083722811488/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FaFacebook className="text-[#1877f2]" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              {/* < FaInstagram className="tex-[#c13584]" /> */}
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <i className="fab fa-twitter"></i>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <i className="fab fa-linkedin"></i>
            </a>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} First Steps Nursery. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
export default PublicFooter;
