import NavbarHeader from "./NavbarHeader";
import { Link } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import AcademicYearsSelection from "../../AcademicYearsSelection";
// import { useNavigate, useLocation } from "react-router"
import { useState, useEffect } from "react";
import logo from "./../../../Data/logo.jpg";
import { IoMenuOutline } from "react-icons/io5";
import AnimatedColorText from './AnimatedColorText'
const DashboardHeader = () => {
  const { username } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const company = { label: "First Steps", type: "Nursery" };

  // Update the time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Cleanup the timer when the component unmounts
    return () => clearInterval(timer);
  }, []);

  // Format date and time
  const formattedDate = currentTime.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = currentTime.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  
const generateCircles = (count) => {
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

  return circles;
};

  const circles = generateCircles(8); // Generate 10 random circles
  const content = (
     <header className="bg-sky-700 text-white py-1 px-3 md:px-1 flex md:flex-row md:justify-between items-center shadow-md relative overflow-hidden">
      {/* Background circles */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {circles}
      </div>
      <div
        className={` "w-56" p-2 flex  text-white  relative`}
      >
        <Link to="/"><img src={logo} className="h-12 w-12 rounded " alt="logo image" /></Link>
       
  <div className="flex items-center">
      <AnimatedColorText company={company} />
     
    </div>
      </div>
      <div className="flex flex-col md:flex-row items-center md:space-x-6 mb-2 md:mb-0">
        <p className="text-lg font-semibold text-center md:text-left">
          Welcome back, {username}!
        </p>
        <div className="text-sm text-center md:text-left">
          <p>{formattedDate}</p>
          <p>{formattedTime}</p>
        </div>
      </div>
      <NavbarHeader />
    </header>
  );

  return content;
};

export default DashboardHeader;
// const DashboardHeader = () => {
//   const { userId, username, userRoles, canEdit, canDelete, canAdd, canCreate } =
//     useAuth();
//      //const { allAcademicYears, currentAcademicYear } = useAcademicYears()
// //console.log(userRoles)
//   const content = (
//     <header>
//       <div className="bg-white h-18 px-10 flex justify-between items-center ">
//         {/* <AcademicYearsSelection/> */}
//         <p className="">
//           welcome back Mr {username} id: {userId}
//           <br />
//           current Status: {userRoles}
//           <br />
//           current actions: {canEdit ? "canEdit" : ""} ,
//           {canDelete ? "canDelete" : ""},{canAdd ? "canAdd" : ""},
//           {canCreate ? "canCreate" : ""}
//         </p>{" "}
//         current
//         <NavbarHeader />
//       </div>
//     </header>
//   );
//   return content;
// };

// export default DashboardHeader;
