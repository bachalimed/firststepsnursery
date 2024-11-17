import NavbarHeader from "./NavbarHeader";
import useAuth from "../../../hooks/useAuth";
import AcademicYearsSelection from "../../AcademicYearsSelection";
// import { useNavigate, useLocation } from "react-router"


const DashboardHeader = () => {
  const { userId, username, userRoles, canEdit, canDelete, canAdd, canCreate } =
    useAuth();
//console.log(userRoles)
  const content = (
    <header>
      <div className="bg-white h-18 px-10 flex justify-between items-center ">
        {/* <AcademicYearsSelection/> */}
        <p className="">
          welcome back Mr {username} id: {userId}
          <br />
          current Status: {userRoles}
          <br />
          current actions: {canEdit ? "canEdit" : ""} ,
          {canDelete ? "canDelete" : ""},{canAdd ? "canAdd" : ""},
          {canCreate ? "canCreate" : ""}
        </p>{" "}
        current
        <NavbarHeader />
      </div>
    </header>
  );
  return content;
};

export default DashboardHeader;
