const GenerateCircles = (count) => {
    const colors = ['bg-red-600', 'bg-green-500', 'bg-sky-600', 'bg-amber-300', 'bg-fuchsia-500'];
    const circles = Array.from({ length: count }).map((_, index) => {
      const size = Math.random() * 30 + 5; // Random size between 20px and 80px
      const color = colors[Math.floor(Math.random() * colors.length)];
      const top = Math.random() * 100; // Random position
      const left = Math.random() * 100;
      const animationDelay = `${Math.random() * 10}s`; // Random delay
      const animationDuration = `${30 + Math.random() * 40}s`; // Duration between 10s and 30s
  
      return (
        <div
          key={index}
          className={`absolute ${color} rounded-full animate-gentle-motion`}
          style={{
            width: `${size}px`,
            height: `${size}px`,
            top: `${top}%`,
            left: `${left}%`,
            opacity: 0.8, // Reduced transparency
            animationDelay,
            animationDuration,
          }}
        />
      );
    });
  //console.log(circles,'circles')
    return circles;
  };
  export default GenerateCircles
  