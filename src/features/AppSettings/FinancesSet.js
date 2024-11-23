import { Link,useLocation } from "react-router-dom";
import AcademicYearsSelection from "../../Components/AcademicYearsSelection";
import useAuth from "../../hooks/useAuth";
//we will  find the object corresponding to the page and extract the section tabs
const FinancesSet = () => {
  const location = useLocation();
  const financesSetTabs = {
    title: "Finances",
    path: "/settings/financesSet",
    allowedRoles: [
      "Employee",
      "Parent",
      "ContentManager",
      "Animator",
      "Academic",
      "Director",
      "Finance",
      "HR",
      "Desk",
      "Manager",
      "Admin",
    ],
  };
 // Define the tab data with paths and labels
 const tabs = [
  //{ label: 'New Assignment', path: '/academics/expenses/NewAnimatorsAssignmentForm' },
  { label: 'Payees', path: '/settings/financesSet/payeesList/' },
  { label: 'bla', path: '/settings/financesSet/payments/bla/' },
 
  
  
 
];
 



 // Function to determine if a tab is active based on the current path
 const isActive = (path) => location.pathname === path;
// Render the component content
return (
  <div className="flex bg-gray-300 p-1 items-center justify-start space-x-6">
    <AcademicYearsSelection />
      {tabs.map((tab) => (
      <Link key={tab.path} to={tab.path}>
          <li
         className={`list-none cursor-pointer px-4 py-2 border border-gray-400 rounded-md ${
           isActive(tab.path)
             ? "text-blue-500 border-blue-500 bg-blue-100"
             : "text-gray-800 hover:text-blue-500"
         }`}
          >
          {tab.label}
          </li>
      </Link>
      ))}
  </div>
  );
};
export default FinancesSet;
