import NavbarHeader from "./NavbarHeader";
import { Link } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { useState, useEffect } from "react";
import logo from "./../../../Data/logo.jpg";
import AnimatedColorText from "../../lib/Utils/AnimatedColorText";
const DashboardHeader = () => {
  const { username } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const company = { label: "First Steps", type: " Nursery" };

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

  const content = (
    <header className="bg-sky-700 text-white py-1 px-3 md:px-1 flex flex-col md:flex-row md:justify-between items-center relative overflow-hidden">
      
      {/* Logo and Colored Text Section */}
      <div className=" p-2 flex flex-col items-center md:items-start text-white relative">
        <Link to="/">
          <img src={logo} className="h-12 w-12 rounded" alt="logo" />
        </Link>
  
        {/* Fallback for non-JavaScript environments */}
        <noscript>
          <a href="/">
            <img
              src="./../../../Data/logo.jpg"
              className="h-12 w-12 rounded"
              alt="logo"
            />
          </a>
        </noscript>
      
        
      </div>
          <AnimatedColorText company={company} />
  
      {/* Welcome Message and Date/Time */}
     
        <h1 className="text-lg font-semibold text-center md:text-left">
          Welcome back, {username}!
        </h1>
        <div className="text-sm text-center md:text-left">
          <p>{formattedDate}</p>
          <p>{formattedTime}</p>
        </div>
      
  
      {/* Navbar Header */}
      <div className="flex-shrink-0 mt-4 md:mt-0 md:ml-6 md:relative md:bottom-auto md:right-auto absolute bottom-4 right-4">
        <NavbarHeader />
      </div>
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
