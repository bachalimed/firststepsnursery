import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
const CookieConsentBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "true");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookieConsent", "false");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-700 text-white p-4 flex flex-col sm:flex-row justify-between items-center z-50">
      <p className="text-sm mb-2 sm:mb-0">
        This website uses cookies to enhance user experience. By continuing, you
        consent to our cookie policy.
        <Link to="/cookiePolicy" className="underline text-blue-300">
            Learn more
          </Link>
      </p>
      <div className="flex gap-2">
        <button
          onClick={handleAccept}
          className="add-button"
        >
          Accept essential
        </button>
        <button
          onClick={handleDecline}
          className="delete-button"
        >
          Reject all
        </button>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
