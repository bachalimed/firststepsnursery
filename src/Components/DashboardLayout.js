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
    <div className="flex bg-neutral-100 min-h-screen w-full">
      <div className="overflow-hidden lg:overflow-visible h-screen">
        <DashboardSidebar />
      </div>
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        {/* Result Banner */}
        {banner.message && (
          <ResultBanner message={banner.message} type={banner.type} />
        )}
        <main className="flex-1 p-4 overflow-auto">
          <Outlet context={{ triggerBanner }} />
        </main>
        <DashboardFooter />
      </div>
    </div>
  );
};

export default DashboardLayout;
