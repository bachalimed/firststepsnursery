
import { Link, useLocation } from 'react-router-dom';
import AcademicYearsSelection from '../../Components/AcademicYearsSelection';

const UsersManagement = () => {
  const location = useLocation();



  
const usersManagementTabs= 
{title:"Users Management",
  path:"/admin/usersManagement/",
  allowedRoles:[ "Admin"],
  spaced:false,
  sectionTabs:[
    {title:"All Users",
    path:"/admin/usersManagement/users/"},
    
    {title:"New User",
    path:"/admin/usersManagement/newUser/"}
  ]
}

  // Define the tabs for Users Management
  const tabs = [
    { label: 'All Users', path: '/admin/usersManagement/users/' },
    { label: 'New User', path: '/admin/usersManagement/newUser/' },
    { label: 'Option 3', path: '/admin/usersManagement/blabla' }, // Option 3 placeholder
  ];

  // Function to determine if a tab is active based on the current path
  const isActive = (path) => location.pathname === path;

  // Render the component content
  return (
    <div className="flex bg-gray-300 p-1 items-center justify-start space-x-6">
    {tabs.map((tab) => (
    <Link key={tab.path} to={tab.path}>
        <li
        className={`list-none cursor-pointer ${
            isActive(tab.path) ? 'text-blue-500' : 'text-gray-800 hover:text-blue-500'
        }`}
        >
        {tab.label}
        </li>
    </Link>
    ))}
    <AcademicYearsSelection />
</div>
  );
};

export default UsersManagement;
