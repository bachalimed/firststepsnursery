
import NavbarHeader from "./Shared/NavbarHeader";
import ActiveYearSelect from "./Shared/ActiveYearSelect";

const Header = () => {
  return (
    
      <header className="bg-white h-14 px-10 flex justify-between items-center ">
        
        <ActiveYearSelect/>
        
        <div className="">
         welcome back Mr your name

        </div >
        <NavbarHeader />
      </header>

    
  )
};

export default Header;