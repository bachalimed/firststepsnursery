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
  { label: 'Expense Categories', path: '/settings/financesSet/expenseCategoriesList/' },
 // { label: 'bla', path: '/settings/financesSet/payments/bla/' },
 
  
  
 
];
 



 // Function to determine if a tab is active based on the current path
 const isActive = (path) => location.pathname === path;
// Render the component content
return (
  <div className="flex bg-gray-300 p-3 px-4 md:px-4  items-center justify-start space-x-4">
    <AcademicYearsSelection />
      {tabs.map((tab) => (
      <Link key={tab.path} to={tab.path}>
          <li
         className={`list-none cursor-pointer px-3 py-2 border border-gray-400  ${
           isActive(tab.path)
             ? "text-sky-700 border-sky-700 bg-gray-100"
             : "text-gray-800 hover:text-fuchsia-500 hover:border-fuchsia-500"
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
