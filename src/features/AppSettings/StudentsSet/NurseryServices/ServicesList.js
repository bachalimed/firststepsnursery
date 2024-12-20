import {
  useGetServicesByYearQuery,
  useDeleteServiceMutation,
} from "./servicesApiSlice";
import { HiOutlineSearch } from "react-icons/hi";
import DataTable from "react-data-table-component";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import DeletionConfirmModal from "../../../../Components/Shared/Modals/DeletionConfirmModal";
import LoadingStateIcon from "../../../../Components/LoadingStateIcon";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
} from "../../AcademicsSet/AcademicYears/academicYearsSlice";
import useAuth from "../../../../hooks/useAuth";
import StudentsSet from "../../StudentsSet";
const ServicesList = () => {
  //this is for the academic year selection
  const navigate = useNavigate();
   const { canEdit, isAdmin, canDelete, canCreate, status2 } = useAuth();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for modal
  const [idServiceToDelete, setIdServiceToDelete] = useState(null); // State to track which document to delete
  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  //const academicYears = useSelector(selectAllAcademicYears);

  const {
    data: services, //the data is renamed services
    isLoading: isServicesLoading, 
    isSuccess: isServicesSuccess,
    isError: isServicesError,
    error: servicesError,
  } = useGetServicesByYearQuery(
    {
      selectedYear: selectedAcademicYear?.title,
      endpointName: "servicesList",
    } || {},
    { 
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  //initialising the delete Mutation
  const [
    deleteService,
    {
      isLoading: isDelLoading,
      isSuccess: isDelSuccess,
      isError: isDelError,
      error: delerror,
    },
  ] = useDeleteServiceMutation();

  // Function to handle the delete button click
  const onDeleteServiceClicked = (id) => {
    setIdServiceToDelete(id); // Set the document to delete
    setIsDeleteModalOpen(true); // Open the modal
  };

  // Function to confirm deletion in the modal
  const handleConfirmDelete = async () => {
    await deleteService({ id: idServiceToDelete });
    setIsDeleteModalOpen(false); // Close the modal
  };

  // Function to close the modal without deleting
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setIdServiceToDelete(null);
  };

  //state to hold the search query
  const [searchQuery, setSearchQuery] = useState("");
 
  //we need to declare the variable outside of if statement to be able to use it outside later
  let servicesList = [];
  let filteredServices = [];
  if (isServicesSuccess) {
    //set to the state to be used for other component s and edit service component

    const { entities } = services;

    //we need to change into array to be read??
    servicesList = Object.values(entities); //we are using entity adapter in this query
    //console.log(servicesList,'servicesList')
 
    //the serach result data
    filteredServices = servicesList?.filter((item) => {
    
      return (
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(searchQuery.toLowerCase())
        ) 
      );
    });
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const columns = [
    {
      name: "#",
      cell: (_, index) => index + 1,
      width: "50px",
    },
    isAdmin && {
      name: "ID",
      selector: (row) => (
        <Link to={`/settings/studentsSet/services/serviceDetails/${row.id}`}>
          {row.id}
        </Link>
      ),
      width: "210px",
    },
    {
      name: "Service",
      cell: (row) => (
        
          <div> {row.serviceType}</div>
       
      ),
      width: "120px",
    },
    {
      name: "Anchor",
      selector: (row) => (
        <>
          {row.serviceAnchor?.monthly && <div> Monthly {row.serviceAnchor.monthly}</div>}
          {row.serviceAnchor?.weekly && <div> Weekly {row.serviceAnchor.weekly}</div>}
          {row.serviceAnchor?.oneTimeOff && <div> OneTimeOff {row.serviceAnchor.oneTimeOff}</div>}
        </>
      ),
      width: "130px",
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="space-x-1">
         
          {canEdit && (
            <button 
            aria-label="edit service"
            onClick={() => navigate(`/settings/studentsSet/editService/${row.id}`)}>
              <FiEdit className="text-2xl text-amber-300" />
            </button>
          )}
          {canDelete && (
            <button 
             aria-label="delete service"
            onClick={() => onDeleteServiceClicked(row.id)}>
              <RiDeleteBin6Line className="text-2xl text-red-600" />
            </button>
          )}
        </div>
      ),
      ignoreRowClick: true,
    },
  ].filter(Boolean);

   // Custom header to include the row count
   const tableHeader = (
    
    <h2>
      services List:
      <span> {filteredServices.length} services</span>
    </h2>
  
);




  let content;
  if (isServicesLoading) content = <><StudentsSet /><LoadingStateIcon/></>;
  
  
    content = (
      <>
        <StudentsSet />
        <div className="relative h-10 mr-2 ">
            <HiOutlineSearch
              fontSize={20}
              className="text-gray-400 absolute top-1/2 -translate-y-1/2 left-3"
              aria-label="search students"
            />
            <input
            aria-label="search students"
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              className="text-sm focus:outline-none active:outline-none mt-1 h-8 w-[24rem] border border-gray-300  px-4 pl-11 pr-4"
            />
          </div>
        <div className="flex-1 bg-white px-4 pt-3 pb-4 border-gray-200">
          <DataTable
           title={tableHeader}
            columns={columns}
            data={filteredServices}
            pagination
            //selectableRows
            //onSelectedRowsChange={handleRowSelected}
            selectableRowsHighlight
          />
          <div className="cancelSavebuttonsDiv">
            {canCreate && (
              <button
                className="add-button"
                onClick={() => navigate("/settings/studentsSet/newService")}
                // disabled={selectedRows.length !== 1}
              >
                New Service
              </button>
            )}
          </div>
        </div>
        <DeletionConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
        />
      </>
    );
  

  return <>{content}</>;
};

export default ServicesList;