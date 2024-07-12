
import NavbarHeader from "./NavbarHeader";
import ActiveYearSelect from "./ActiveYearSelect";
// import { useNavigate, useLocation } from "react-router";

const DashboardHeader = () => {
  const content =(
    
    <header >
        <div className="bg-white h-14 px-10 flex justify-between items-center ">
        <ActiveYearSelect/>
        
        <p className="">
         welcome back Mr your name

        </p >
        <NavbarHeader />
        </div>
       

      </header>


)
return content;
}

export default DashboardHeader;