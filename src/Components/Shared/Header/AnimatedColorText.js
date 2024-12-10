import { useState, useEffect } from 'react';

const colors = ['text-fuchsia-500', 'text-amber-300','text-green-500', 'text-sky-600',   'text-red-600'];

const getColorClass = (type) => {
  const index = Math.abs(type.charCodeAt(0)) % colors.length;
  return `text-${colors[index]}-500`;
};

const AnimatedColorText = ({ company }) => {
  const [colorIndex, setColorIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % colors.length);
    }, 60 * 1000); // Change color every minute

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []);

  const getColorClass = (char, index) => {
    const colorIndex = index % colors.length;
    return colors[colorIndex];
  };

  return (
    <span className="origin-left font-medium px-2 text-2xl"> {/* Use text-2xl or any other size class */}
    {company.label.split('').map((char, index) => (
      <span key={index} className={`${getColorClass(char, index)} font-bold  text-3xl`}>
        {char}
      </span>
    ))}{" "}
    {company.type.split('').map((char, index) => (
      <span key={index} className={`${getColorClass(char, index)} font-bold  text-3xl`}>
        {char}
      </span>
    ))}
  </span>
  );
};

export default AnimatedColorText;
