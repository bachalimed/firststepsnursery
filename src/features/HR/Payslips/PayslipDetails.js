import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { selectPayslipById } from "./payslipsApiSlice";
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
  selectAllAcademicYears,
} from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import { useGetPayslipByIdQuery } from "./payslipsApiSlice";

import React, { useState, useEffect } from "react";
import HR from "../HR";

import useAuth from "../../../hooks/useAuth";
import LoadingStateIcon from "../../../Components/LoadingStateIcon";

const PayslipDetails = () => {
  const { id } = useParams();

  const { canEdit } = useAuth();

  const navigate = useNavigate();

  const {
    data: payslipOrg, //the data is renamed payslips
    isLoading: isPayslipLoading,
    isSuccess: isPayslipSuccess,
    isError: isPayslipError,
    error: payslipError,
  } = useGetPayslipByIdQuery(
    {
      id: id,
      endpointName: "PayslipDetails",
    } || {},
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );
  let payslip = {};
  if (isPayslipSuccess) {
    payslip = payslipOrg[0];
  }

  // console.log(payslip, "payslip");
  let content;
  if (isPayslipLoading) {
    content = (
      <>
        <HR />
        <LoadingStateIcon />
      </>
    );
  }

  // const payslipToview = isPayslipSuccess ? payslip : [];

  if (isPayslipSuccess) {
    content = (
      <>
        <HR />
        <div className="p-4 bg-white shadow-md rounded-md">
          {/* Header */}
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <div>
              <h2 className="text-xl font-bold">
                {payslip?.payslipEmployeeName}
              </h2>
              <p className="text-sm text-gray-600">
                Employee ID {payslip?.payslipEmployee}
              </p>
              <p className="text-sm text-gray-600">
                Payslip for {payslip?.payslipMonth}, {payslip?.payslipYear}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm">
                <strong>Payment Date:</strong>{" "}
                {new Date(payslip?.payslipPaymentDate).toLocaleDateString()}
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
            <div className="grid grid-cols-3 gap-4">
              <p>
                <strong>Basic:</strong> $
                {payslip?.payslipSalaryComponents.basic}
              </p>
              <p>
                <strong>Paid Basic:</strong> $
                {payslip?.payslipSalaryComponents.payableBasic}
              </p>
              <p>
                <strong>Allowance:</strong> $
                {payslip?.payslipSalaryComponents.allowance}
              </p>
              <p>
                <strong>Total Amount:</strong> $
                {payslip?.payslipSalaryComponents.totalAmount}
              </p>
            </div>
          </div>
          {/* Totals Section */}
          <div className="mt-4 p-4 bg-gray-100 rounded-md">
            <p className="text-lg font-semibold">Summary</p>
            <div className="flex justify-between text-sm mt-2">
              <p className="font-medium">Total Open Days:</p>
              <p>
                {
                  payslip?.payslipWorkdays.filter((day) => !day.isWeekend)
                    .length
                }
              </p>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <p className="font-medium">Total Work Days:</p>
              <p>
                {
                  payslip?.payslipWorkdays.filter(
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
                  payslip?.payslipWorkdays.filter(
                    (day) => day?.isPaid && !day?.isWeekend
                  ).length
                }
              </p>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <p className="font-medium">Total Sick Leave:</p>
              <p>
                {
                  payslip?.payslipWorkdays.filter((day) => day.isSickLeave)
                    .length
                }
              </p>
            </div>
          </div>
          {/* Workdays Table */}
          <div>
            <h3 className="formSectionTitle">Daily information</h3>
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
                {payslip?.payslipWorkdays.map((dayObj, index) => (
                  <tr
                    key={index}
                    className={`text-sm ${
                      dayObj.isWeekend ? "bg-yellow-100" : ""
                    }`}
                  >
                    <td className="border border-gray-300 p-2">
                      {new Date(dayObj.day).toLocaleDateString()}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {dayObj.dayType}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {dayObj.isPaid ? "Paid" : "Unpaid"}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {dayObj.isPartDay
                        ? `${dayObj?.partdayDuration} Hours`
                        : ""}
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
