import { useState, useEffect } from "react";
import { useUpdatePayslipMutation } from "./payslipsApiSlice";
import { useNavigate, useOutletContext } from "react-router-dom";
import { MONTHS } from "../../../config/Months";
import { useGetEmployeesByYearQuery } from "../Employees/employeesApiSlice";
import { useGetLeavesByYearQuery } from "../Leaves/leavesApiSlice";
import useAuth from "../../../hooks/useAuth";
import { CurrencySymbol } from "../../../config/Currency";
import HR from "../HR";
import LoadingStateIcon from "../../../Components/LoadingStateIcon";

import {
  YEAR_REGEX,
  COMMENT_REGEX,
  OBJECTID_REGEX,
  FEE_REGEX,
  NAME_REGEX,
} from "../../../config/REGEX";
import {
  selectAllAcademicYears,
  selectCurrentAcademicYearId,
  selectAcademicYearById,
} from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import { useSelector } from "react-redux";
import ConfirmationModal from "../../../Components/Shared/Modals/ConfirmationModal";

const EditPayslipForm = ({ payslip }) => {
  const navigate = useNavigate();
  // console.log(payslip, "in teh form anoonowwww");
  const { isAdmin, isManager, userId } = useAuth();
  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);
  // console.log(payslip,'payslip')
  const {
    _id: payslipId,
    payslipEmployee,
    payslipEmployeeName,
    payslipIsApproved,
    payslipLeaveDays,
    payslipMonth,
    payslipNote,
    payslipPaymentDate,
    payslipSalaryComponents,
    payslipWorkdays,
    payslipYear,
  } = payslip;

  const { triggerBanner } = useOutletContext(); // Access banner trigger

  const [
    updatePayslip,
    {
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess,
      isError: isUpdateError,
      error: updateError,
    },
  ] = useUpdatePayslipMutation();

  //confirmation Modal states
  const [showConfirmation, setShowConfirmation] = useState(false);
  // Consolidated form state
  const [formData, setFormData] = useState({
    _id: payslipId,
    payslipEmployee: payslip?.payslipEmployee,
    payslipEmployeeName: payslip?.payslipEmployeeName,
    payslipIsApproved: payslip?.payslipIsApproved,
    payslipLeaveDays: payslip?.payslipLeaveDays,
    payslipMonth: payslip?.payslipMonth,
    payslipNote: payslip?.payslipNote,
    payslipPaymentDate: payslip?.payslipPaymentDate?.split("T")[0],
    payslipSalaryComponents: payslip?.payslipSalaryComponents,
    payslipWorkdays: payslip?.payslipWorkdays,
    payslipYear: payslip?.payslipYear,
    payslipOperator: userId,
  });

  const [validity, setValidity] = useState({
    validPayslipYear: false,
    validPayslipMonth: false,

    validPayslipNote: false,
    validPayslipEmployee: false,
    //validPayslipPaymentDate: false,
    validPayslipLeaveDays: false,
    validPayslipSalaryComponents: false,
  });

  // Validate inputs using regex patterns
  useEffect(() => {
    setValidity((prev) => ({
      ...prev,
      validPayslipYear: YEAR_REGEX.test(formData?.payslipYear),
      validPayslipMonth: NAME_REGEX.test(formData?.payslipMonth),
      validPayslipNote: COMMENT_REGEX.test(formData?.payslipNote),
      validPayslipEmployee: OBJECTID_REGEX.test(formData?.payslipEmployee),
      //validPayslipPaymentDate: DATE_REGEX.test(formData?.payslipPaymentDate),
      validPayslipLeaveDays: formData?.payslipLeaveDays?.length > 0,
      validPayslipSalaryComponents:
        formData?.payslipSalaryComponents?.totalAmount != 0 &&
        FEE_REGEX.test(formData?.payslipSalaryComponents?.totalAmount),
    }));
  }, [formData]);
  // console.log(validity);

  useEffect(() => {
    if (isUpdateSuccess) {
      setFormData({
        _id: "",
        payslipYear: "",
        payslipMonth: "",
        payslipNote: "",
        payslipEmployee: "",
        payslipEmployeeName: "",
        payslipIsApproved: "",
        payslipPaymentDate: "",
        payslipLeaveDays: [],
        payslipSalaryComponents: {},
        payslipOprator: "",
      });
      navigate("/hr/payslips/payslipsList");
    }
  }, [isUpdateSuccess, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const canSave =
    Object.values(validity).every(Boolean) &&
    // ((formData.payslipYears[0].academicYear)!=='') &&

    !isUpdateLoading;

  const onSavePayslipClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      setShowConfirmation(true);
    }
  };
  // This function handles the confirmed save action
  const handleConfirmSave = async () => {
    // Close the confirmation modal
    setShowConfirmation(false);

    try {
      const response = await updatePayslip(formData);
      if (response?.message) {
        // Success response
        triggerBanner(response?.message, "success");
      } else if (response?.data?.message) {
        // Success response
        triggerBanner(response?.data?.message, "success");
      } else if (response?.error?.data?.message) {
        // Error response
        triggerBanner(response?.error?.data?.message, "error");
      } else if (isUpdateError) {
        // In case of unexpected response format
        triggerBanner(updateError?.data?.message, "error");
      } else {
        // In case of unexpected response format
        triggerBanner("Unexpected response from server.", "error");
      }
    } catch (error) {
      triggerBanner(error?.data?.message, "error");
    }
  };

  // Close the modal without saving
  const handleCloseModal = () => {
    setShowConfirmation(false);
  };
  // console.log(validity, "validity");
  // console.log(formData, "formData");
  const content = (
    <>
      <HR />

      <form onSubmit={onSavePayslipClicked} className="form-container">
        <h2 className="formTitle ">
          Edit Payslip {formData?.payslipMonth} {selectedAcademicYear?.title}
        </h2>
        <div className="formSectionContainer">
          <h3 className="formSectionTitle">Payslip details</h3>
          <div className="formSection">
            <div className="formLineDiv">
              <label htmlFor="payslipMonth" className="formInputLabel">
                Month{" "}
                {!validity.validPayslipMonth && (
                  <span className="text-red-600">*</span>
                )}
                <select
                  id="payslipMonth"
                  name="payslipMonth"
                  value={formData.payslipMonth}
                  // onChange={(e) =>
                  //   setFormData({ ...formData, payslipMonth: e.target.value })
                  // }
                  className="formInputText"
                  required
                  disabled
                >
                  <option
                    key={formData?.payslipMonth}
                    value={formData?.payslipMonth}
                  >
                    {formData?.payslipMonth}
                  </option>
                </select>{" "}
              </label>

              <label htmlFor="payslipEmployee" className="formInputLabel">
                Employee{" "}
                {!validity.validPayslipEmployee && (
                  <span className="text-red-600">*</span>
                )}
                <select
                  id="payslipEmployee"
                  name="payslipEmployee"
                  value={formData.payslipEmployee}
                  className="formInputText"
                  required
                  disabled
                >
                  <option value={formData?.payslipEmployee}>
                    {formData?.payslipEmployeeName}
                  </option>
                </select>{" "}
              </label>

              {/* payslip Is Approved  */}

              <label htmlFor="payslipIsApproved" className="formInputLabel">
                <input
                  type="checkbox"
                  id="payslipIsApproved"
                  name="payslipIsApproved"
                  checked={formData.payslipIsApproved}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />{" "}
                payslip is Approved
              </label>

              {/* Payslip Payment Date */}
              {/* done after approval of payslip */}
              <label htmlFor="payslipPaymentDate" className="formInputLabel">
                Payment Date{" "}
                {/* {!validity.validPayslipPaymentDate && (
                    <span className="text-red-600">*</span>
                  )} */}
                <input
                  type="date"
                  id="payslipPaymentDate"
                  name="payslipPaymentDate"
                  value={formData.payslipPaymentDate}
                  onChange={handleInputChange}
                  className="formInputText"
                />{" "}
              </label>
            </div>
          </div>
          {/* Payslip Leave Days */}

          <h3 className="formSectionTitle">Summary of days</h3>
          <div className="formSection">
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2 text-left">Day</th>
                    <th className="px-4 py-2 text-left">Paid</th>
                    <th className="px-4 py-2 text-left">Type</th>
                    <th className="px-4 py-2 text-left">Leave Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {formData?.payslipWorkdays.map((dayObj, index) => (
                    <tr
                      key={index}
                      className={`border-t ${
                        dayObj.isWeekend ? "bg-yellow-200" : "bg-white"
                      }`}
                    >
                      <td className="px-4  text-sm">{dayObj.day}</td>
                      <td className="px-4 ">
                        {!dayObj?.isWeekend && (
                          <div className="text-xs text-gray-600">
                            {dayObj.isPaid ? "Paid" : "Unpaid"}
                          </div>
                        )}
                      </td>
                      <td className="px-4  text-xs text-gray-600">
                        {dayObj.dayType}
                      </td>
                      <td className="px-4 py-1">
                        {dayObj?.isPartDay && (
                          <span className="text-xs text-red-600">
                            {dayObj?.partdayDuration} Hours leave
                          </span>
                        )}
                        {dayObj?.dayType === "off-day" && (
                          <span className="text-xs text-red-600">
                            1 day leave
                          </span>
                        )}
                        {dayObj?.dayType === "Given day" && (
                          <span className="text-xs text-red-600">
                            1 day leave
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals Section */}
              <div className="mt-4 p-4 bg-gray-100 rounded-md">
                <p className="text-lg font-semibold">Summary</p>
                <div className="flex justify-between text-sm mt-2">
                  <p className="font-medium">Total Open Days:</p>
                  <p>
                    {
                      formData?.payslipWorkdays.filter((day) => !day.isWeekend)
                        .length
                    }
                  </p>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <p className="font-medium">Total Work Days:</p>
                  <p>
                    {
                      formData?.payslipWorkdays.filter(
                        (day) =>
                          day?.dayType === "Work day" ||
                          day?.dayType === "Given day"
                      ).length
                    }
                  </p>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <p className="font-medium">Total Paid Days:</p>
                  <p>
                    {
                      formData?.payslipWorkdays.filter(
                        (day) => day?.isPaid && !day?.isWeekend
                      ).length
                    }
                  </p>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <p className="font-medium">Total Sick Leave:</p>
                  <p>
                    {
                      formData?.payslipWorkdays.filter((day) => day.isSickLeave)
                        .length
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
          <h3 className="formSectionTitle">Salary details</h3>
<div className="formSection">
  {/* Payable Basic Salary */}
  <div className="flex justify-between items-center mb-3">
    <span className="formInputLabel">Basic Salary:</span>
    <span className="text-gray-800">
      {formData?.payslipSalaryComponents?.basic || 0} {CurrencySymbol}
    </span>
  </div>

  {/* Payable Basic Salary */}
  <div className="flex justify-between items-center mb-3">
    <span className="formInputLabel">Payable Basic Salary:</span>
    <span className="text-gray-800">
      {formData?.payslipSalaryComponents?.payableBasic || 0} {CurrencySymbol}
    </span>
  </div>

  {/* Allowance Input */}
  <div className="flex justify-between items-center mb-3">
    <label htmlFor="allowance" className="formInputLabel">
      Allowance:
    </label>
    <input
      id="allowance"
      type="number"
      value={formData?.payslipSalaryComponents?.allowance || ""}
      onChange={(e) => {
        const allowanceValue = Number(e.target.value) || 0;
        // Update formData with allowance and total salary
        setFormData((prev) => ({
          ...prev,
          payslipSalaryComponents: {
            ...prev.payslipSalaryComponents,
            allowance: allowanceValue,
            totalAmount:
              Number(prev.payslipSalaryComponents?.payableBasic || 0) +
              allowanceValue,
          },
        }));
      }}
      className="border rounded-md px-2 py-1 w-28 text-right"
    />
  </div>

  {/* Total Salary */}
  <div className="flex justify-between items-center">
    <span className="formInputLabel">Total Salary:</span>
    <span className="font-bold text-gray-900">
      {formData?.payslipSalaryComponents?.totalAmount || 0} {CurrencySymbol}
    </span>
  </div>
</div>


          <label htmlFor={`payslipNote`} className="formInputLabel">
            Note
            {!validity?.validPayslipNote && (
              <span className="text-red-600"> check your input</span>
            )}
            <textarea
              aria-invalid={!validity?.validPayslipNote}
              type="text"
              id={`payslipNote`}
              name="comment"
              placeholder="[1-150 characters]"
              value={formData.payslipNote}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  payslipNote: e.target.value,
                })
              }
              className={`formInputText text-wrap`}
              maxLength="150"
            ></textarea>
          </label>
        </div>
        {/* Payslip Salary Components */}

        {/* Submit Button */}
        <div className="cancelSavebuttonsDiv">
          <button
            type="button"
            onClick={() => navigate("/hr/payslips/payslipsList/")}
            className="cancel-button"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!canSave | isUpdateLoading}
            className="save-button"
          >
            Save
          </button>
        </div>
      </form>

      {/* Confirmation Modal */}
      <ConfirmationModal
        show={showConfirmation}
        onClose={handleCloseModal}
        onConfirm={handleConfirmSave}
        title="Confirm Save"
        message="Are you sure you want to save?"
      />
    </>
  );

  return content;
};

export default EditPayslipForm;
