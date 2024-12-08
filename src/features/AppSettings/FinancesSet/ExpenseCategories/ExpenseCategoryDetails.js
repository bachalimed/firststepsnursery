import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { selectExpenseCategoryById } from "./expenseCategoriesApiSlice";
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
  selectAllAcademicYears,
} from "../../AcademicsSet/AcademicYears/academicYearsSlice";
import { useGetExpenseCategoryByIdQuery } from "./expenseCategoriesApiSlice";


import {useState, useEffect} from "react"
import FinancesSet from "../../FinancesSet";

import useAuth from "../../../../hooks/useAuth";

const ExpenseCategoryDetails = () => {
  const { id } = useParams();


  const {canEdit}=useAuth()
  //const expenseCategory = useSelector((state) => state.expenseCategory?.entities[id]);
  const navigate = useNavigate();
  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);
  const {
    data: expenseCategory, //the data is renamed expenseCategories
    isLoading: isExpenseCategoryLoading, 
    isSuccess: isExpenseCategorySuccess,
    isError: isExpenseCategoryError,
    error: expenseCategoryError,
  } = useGetExpenseCategoryByIdQuery(
    {
      id: id,
      endpointName: "ExpenseCategoryDetails",
    } || {},
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );
  const [photoId, setPhotoId] = useState(null);
  console.log(expenseCategory, "expenseCategory");

 


  // const expenseCategoryToview = isExpenseCategorySuccess ? expenseCategory : [];
  let content;
  // console.log(expenseCategoryToview);
  content = 
   (  content = isExpenseCategorySuccess 
     ) ? (
    <>
      <FinancesSet />
      <div className="max-w-4xl mx-auto mt-8 bg-white p-8 shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          ExpenseCategory Details
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <p className="text-sm font-medium text-gray-700">Full Name</p>
            <p className="text-lg text-gray-900">
              {expenseCategory?.userFullName?.userFirstName}{" "}
              {expenseCategory?.userFullName?.userMiddleName}{" "}
              {expenseCategory?.userFullName?.userLastName || ""}
            </p>
          </div>
          

          {/* Date of Birth */}
          <div>
            <p className="text-sm font-medium text-gray-700">Date of Birth</p>
            <p className="text-lg text-gray-900">
              {expenseCategory?.userDob ? expenseCategory.userDob.split("T")[0] : "N/A"}
            </p>
          </div>

          {/* Sex */}
          <div>
            <p className="text-sm font-medium text-gray-700">Sex</p>
            <p className="text-lg text-gray-900">
              {expenseCategory?.userSex || "N/A"}
            </p>
          </div>

          {/* Address */}
          <div>
            <p className="text-sm font-medium text-gray-700">Address</p>
            <p className="text-lg text-gray-900">
              {expenseCategory?.userAddress?.house} {expenseCategory?.userAddress?.street}
            </p>
            <p className="text-lg text-gray-900">
              {expenseCategory?.userAddress?.area}
            </p>
            <p className="text-lg text-gray-900">
              {expenseCategory?.userAddress?.postCode}
            </p>
            <p className="text-lg text-gray-900">
              {expenseCategory?.userAddress?.city}
            </p>
          </div>

          {/* Contact */}
          <div>
            <p className="text-sm font-medium text-gray-700">Contact</p>
            <p className="text-lg text-gray-900">
              {expenseCategory?.userContact?.primaryPhone || "N/A"}
            </p>
            <p className="text-lg text-gray-900">
              {expenseCategory?.userContact?.secondaryPhone || "N/A"}
            </p>
            <p className="text-lg text-gray-900">
              {expenseCategory?.userContact?.email || "N/A"}
            </p>
          </div>

          {/* Roles */}
          <div>
            <p className="text-sm font-medium text-gray-700">Roles</p>
            <p className="text-lg text-gray-900">
              {expenseCategory?.userRoles?.length > 0
                ? expenseCategory.userRoles.join(", ")
                : "N/A"}
            </p>
          </div>

          {/* Active Status */}
          <div>
            <p className="text-sm font-medium text-gray-700">Active Status</p>
            <div>
            User:
            <span
              className={`text-lg font-semibold ${
                expenseCategory?.userIsActive ? "text-green-600" : "text-red-600"
              }`}
            >
              {" "}
              {expenseCategory?.userIsActive ? "Active" : "Inactive"}
            </span></div>
            <div>
            ExpenseCategory:
            <span
              className={`text-lg font-semibold ${
                expenseCategory?.expenseCategoryId?.expenseCategoryIsActive
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {" "}
              {expenseCategory?.expenseCategoryId?.expenseCategoryIsActive ? "Active" : "Inactive"}
            </span>
            </div>
          </div>

          {/* Academic Years */}
          <div>
            <p className="text-sm font-medium text-gray-700">Academic Years</p>
            <ul className="list-disc list-inside text-lg text-gray-900">
              {expenseCategory?.expenseCategoryId?.expenseCategoryYears?.length > 0 ? (
                expenseCategory.expenseCategoryId.expenseCategoryYears.map((year, idx) => (
                  <li key={idx}>{year.academicYear}</li>
                ))
              ) : (
                <li>N/A</li>
              )}
            </ul>
          </div>

          {/* Current Employment */}
          <div>
            <p className="text-sm font-medium text-gray-700">
              Current Employment
            </p>
            <p className="text-lg text-gray-900">
              {expenseCategory?.expenseCategoryId?.expenseCategoryCurrentEmployment?.position
                ? `${
                    expenseCategory?.expenseCategoryId?.expenseCategoryCurrentEmployment?.position
                  }, Joined on: ${
                    expenseCategory?.expenseCategoryId?.expenseCategoryCurrentEmployment?.joinDate.split(
                      "T"
                    )[0]
                  }`
                : "N/A"}
            </p>
          </div>

          {/* Work History */}
          <div>
            <p className="text-sm font-medium text-gray-700">Work History</p>
            <ul className="list-disc list-inside text-lg text-gray-900">
              {expenseCategory?.expenseCategoryId?.expenseCategoryWorkHistory?.length > 0 ? (
                expenseCategory.expenseCategoryId.expenseCategoryWorkHistory.map(
                  (history, idx) => (
                    <li key={idx}>
                      {history.position} at {history.company} (
                      {history.startDate} - {history.endDate || "Present"})
                    </li>
                  )
                )
              ) : (
                <li>N/A</li>
              )}
            </ul>
          </div>
        </div>

        <div className="flex justify-end items-center space-x-4 mt-6">
          <button
            onClick={() => navigate(`/hr/expenseCategories/expenseCategoriesList/`)}
            className="cancel-button"
          >
            Back to List
          </button>
          <button
            onClick={() => navigate(`/hr/expenseCategories/editExpenseCategory/${id}`)}
            className="edit-button"
               hidden={!canEdit}
          >
            Edit ExpenseCategory
          </button>
        </div>
      </div>
    </>
  ) : null;
  return content;
};

export default ExpenseCategoryDetails;
