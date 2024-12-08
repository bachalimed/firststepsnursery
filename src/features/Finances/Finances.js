import { Link, useLocation } from "react-router-dom";
import { MdOutlineBusinessCenter } from "react-icons/md";
import useAuth from "../../hooks/useAuth";
import AcademicYearsSelection from "../../Components/AcademicYearsSelection";
const Finances = () => {
  const location = useLocation();
  const FinancesTabs = {
    title: "finances",
    icon: <MdOutlineBusinessCenter />,
    path: "/finances/expenses",
    allowedRoles: [
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
    { label: 'Invoices', path: '/finances/invoices/invoicesList/' },
    { label: 'Payments', path: '/finances/payments/paymentsList/' },
    { label: 'Expenses', path: '/finances/expenses/expensesList/' },
    
    
   
  ];
 // Function to determine if a tab is active based on the current path
 const isActive = (path) => location.pathname === path;

 // Render the component content
 return (
   <div className="flex bg-gray-300 p-1 px-4 md:px-8 items-center justify-start space-x-4">
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
 

export default Finances;
