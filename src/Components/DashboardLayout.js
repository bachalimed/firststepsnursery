import React, {useState} from "react";
import { Outlet } from "react-router-dom";
import DashboardSidebar from "./Shared/Sidebar/DashboardSidebar";
import DashboardHeader from "./Shared/Header/DashboardHeader";
import DashboardFooter from "./Shared/Footer/DashboardFooter";
import ResultBanner from "./ResultBanner";
// the layout contains all persistant elements that exist in all pagesm the outlet element is the vaiable content

const DashboardLayout = () => {
    const [banner, setBanner] = useState({ message: "", type: "" });

  // Function to trigger the banner
  const triggerBanner = (message, type) => {
    setBanner({ message, type });
    setTimeout(() => {
      setBanner({ message: "", type: "" }); // Clear banner after 3 seconds
    }, 3000);
  };
  return (
    <div className="flex bg-neutral-100 min-h-screen w-screen ">
      <div className="overflow-visible h-screen">{<DashboardSidebar />}</div>
      <div className="flex-1">
        <div className="flex-1 ">{<DashboardHeader />}</div>
        <div className="flex-1 ">
          {/* Result Banner that appears below the header */}
      {banner.message && (
        <ResultBanner message={banner.message} type={banner.type} />
      )}
        </div>
        <main className=" flex-1 p-1 min-h-screen ">
          {<Outlet context={{ triggerBanner }} className="" />}
        </main>
        {/* <div className=' flex-1 p-1 h-screen'>{<Outlet/>}</div> */}
        <div className=" flex-1 bg-teal-200 w-full ">{<DashboardFooter />}</div>
      </div>
    </div>
  );
};
export default DashboardLayout;
