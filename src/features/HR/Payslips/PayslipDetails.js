import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { useGetPayslipByIdQuery } from "./payslipsApiSlice";
import React, { useState, useEffect } from "react";
import HR from "../HR";
import useAuth from "../../../hooks/useAuth";
import LoadingStateIcon from "../../../Components/LoadingStateIcon";

const PayslipDetails = () => {
  useEffect(() => {
    document.title = "Payslip Details";
  });

  const { id } = useParams();
  const { canEdit } = useAuth();
  const navigate = useNavigate();

  const {
    data: payslipOrg,
    isLoading: isPayslipLoading,
    isSuccess: isPayslipSuccess,
  } = useGetPayslipByIdQuery(
    {
      id: id,
      endpointName: "PayslipDetails",
    },
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  let payslip = {};
  if (isPayslipSuccess) {
    payslip = payslipOrg[0];
  }

  let content;
  if (isPayslipLoading) {
    content = (
      <>
        <HR />
        <LoadingStateIcon />
      </>
    );
  }

  if (isPayslipSuccess) {
    content = (
      <>
        <HR />
        <div className="p-4 bg-white shadow-md rounded-md">
          {/* Header */}
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <div>
              <h2 className="text-xl font-bold">{payslip?.payslipEmployeeName}</h2>
              <p className="text-sm text-gray-600">Employee ID {payslip?.payslipEmployee}</p>
              <p className="text-sm text-gray-600">
                Payslip for {payslip?.payslipMonth}, {payslip?.payslipYear}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm">
                <strong>Payment Date:</strong>{" "}
                {payslip?.payslipPaymentDate ? new Date(payslip?.payslipPaymentDate).toLocaleDateString() : "N/A"}
              </p>
              <p className="text-sm">
                <strong>Status:</strong>{" "}
                {payslip?.payslipIsApproved ? "Approved" : "Not Approved"}
              </p>
            </div>
          </div>

          {/* Salary Components */}
          <div className="mb-4">
            <h3 className="formSectionTitle">Salary Components</h3>
            <div className="grid grid-cols-2 gap-4">
              <p>
                <strong>Basic Salary:</strong> {payslip?.payslipSalaryComponents?.basic || 0}
              </p>
              <p>
                <strong>Payable Basic:</strong> {payslip?.payslipSalaryComponents?.payableBasic || 0}
              </p>
              
             
              <p>
                <strong>Net Salary:</strong> {payslip?.payslipTotalAmount || 0}
              </p>
            </div>

            {/* Allowances */}
            {payslip?.payslipSalaryComponents?.allowances?.length > 0 && (
              <div className="mt-4">
                <h4 className="formSectionTitle">Allowance Details</h4>
                <ul className="list-disc pl-5">
                  {payslip.payslipSalaryComponents.allowances.map((allowance, index) => (
                    <li key={index} className="text-sm">
                      {allowance?.allowanceLabel || "N/A"}: {allowance?.allowanceUnitValue || 0} x {allowance?.allowanceNumber || 0} = {allowance?.allowanceTotalValue || 0}
                    </li>
                  ))}
                </ul>
              </div>
            )}
<p>
                <strong>Total Allowances:</strong>{" "}
                {payslip?.payslipSalaryComponents?.allowances?.reduce((sum, allowance) => sum + Number(allowance?.allowanceTotalValue || 0), 0) || 0}
              </p>
            {/* Deductions */}
            {payslip?.payslipSalaryComponents?.deduction && (
              <div className="mt-4">
                <h4 className="formSectionTitle">Deductions</h4>
                <p>
                  {payslip?.payslipSalaryComponents?.deduction?.deductionLabel || "N/A"}: {payslip?.payslipSalaryComponents?.deduction?.deductionAmount || 0}
                </p>
              </div>
            )}
          </div>

          {/* Workdays Table */}
          <div>
            <h3 className="formSectionTitle">Daily Information</h3>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="border border-gray-300 p-2">Date</th>
                  <th className="border border-gray-300 p-2">Day Type</th>
                  <th className="border border-gray-300 p-2">Is Paid</th>
                  <th className="border border-gray-300 p-2">Duration</th>
                </tr>
              </thead>
              <tbody>
                {payslip?.payslipWorkdays?.map((dayObj, index) => (
                  <tr
                    key={index}
                    className={`text-sm ${dayObj.isWeekend ? "bg-yellow-100" : ""}`}
                  >
                    <td className="border border-gray-300 p-2">
                      {new Date(dayObj.day).toLocaleDateString()}
                    </td>
                    <td className="border border-gray-300 p-2">{dayObj.dayType}</td>
                    <td className="border border-gray-300 p-2">{dayObj.isPaid ? "Paid" : "Unpaid"}</td>
                    <td className="border border-gray-300 p-2">
                      {dayObj.isPartDay ? `${dayObj.partdayDuration} Hours` : ""}
                      {dayObj.dayType === "off-day" ? "1 day leave" : ""}
                      {dayObj.dayType === "Given day" ? "1 day leave" : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="cancelSavebuttonsDiv">
          <button
            onClick={() => navigate(`/hr/payslips/payslipsList/`)}
            className="cancel-button"
          >
            Back to List
          </button>
          <button
            onClick={() => navigate(`/hr/payslips/editPayslip/${id}`)}
            className="edit-button"
            hidden={!canEdit}
          >
            Edit Payslip
          </button>
        </div>
      </>
    );
  }

  return content;
};

export default PayslipDetails;