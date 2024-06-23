
import NavbarHeader from "./Shared/NavbarHeader";
import ActiveYearSelect from "./Shared/ActiveYearSelect";

const Header = () => {
  return (
    
      <div className="bg-white h-14 px-10 flex justify-between items-center ">
        
        <ActiveYearSelect/>
        
        <div className="">
         welcome back Mr your name

        </div >
        <NavbarHeader />
      </div>

    
  )
};

export default Header;