import NavbarHeader from "./NavbarHeader";
import { Link } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { useState, useEffect } from "react";
import firststeps from "../../../Data/firststeps.png";

// import AnimatedColorText from "../../lib/Utils/AnimatedColorText";
const DashboardHeader = () => {
  const { username } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  // const company = { label: "First Steps", type: " Nursery" };

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
    <header className="bg-sky-700 text-white py-1 px-3 md:px-1 flex  justify-between items-center  overflow-visible z-80">
      {/* Logo and Colored Text Section */}
      <Link to="/">
        <img
          src={firststeps}
          className="h-12 w-40 rounded bg-white"
          alt="first steps nursery logo"
        />
      </Link>

      {/* Fallback for non-JavaScript environments */}
      <noscript>
        <a href="/">
          <img
            src="../../../Data/firststeps.png"
            className="h-12 w-12 rounded"
            alt="first steps nursery logo"
          />
        </a>
      </noscript>

      {/* <div className="flex items-center max-sm:hidden">
          <AnimatedColorText company={company} />
        </div> */}

      {/* Welcome Message and Date/Time */}

      <h1 className="text-lg font-semibold text-center md:text-left">
        Welcome back, {username} !
      </h1>
      <div className="text-sm text-center md:text-left max-sm:hidden">
        <p>{formattedDate}</p>
        <p>{formattedTime}</p>
      </div>

      {/* Navbar Header */}
      <div className="items-center justify-center mr-4 mt-1 overflow-visible z-60">
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
