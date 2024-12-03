import React, { useState, useEffect } from "react";

const ResultBanner = ({ message, type }) => {
    const bannerStyles = {
      success: "bg-green-400 text-white ",
      error: "bg-red-500 text-white ",
    };
  
    return (
      <div className={`p-4 text-center ${bannerStyles[type] || ''}`}>
        <p>{message}</p>
      </div>
    );
  };
  
  export default ResultBanner;
