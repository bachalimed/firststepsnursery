import { Link } from "react-router-dom";

const NavbarHeader = () => {
  return (
    <>
     
     <h1 className="text-3xl font-bold underline">
      Hello Mr Smith!
    </h1>
      
        <ul>
          
        <li>
            <Link to="/">to Home</Link>
          </li>
          <li>
            2024/2025
          </li>
          <li>
            <Link to="/Login">Login</Link>
          </li>
          <li>
            <Link to="/Notifications">Notifications</Link>
          </li>
          
        </ul>
        
      
    </>
    
  )
};

export default NavbarHeader;