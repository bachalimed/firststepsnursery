
import NavbarHeader from "./Shared/NavbarHeader";
import ActiveYearSelect from "./Shared/ActiveYearSelect";
// import { useNavigate, useLocation } from "react-router";

const DashboardHeader = () => {
  const content =(
    
    <header className="bg-white h-14 px-10 flex justify-between items-center ">
        
        <ActiveYearSelect/>
        
        <p className="">
         welcome back Mr your name

        </p >
        <NavbarHeader />
      </header>


)
return content;
}

export default DashboardHeader;