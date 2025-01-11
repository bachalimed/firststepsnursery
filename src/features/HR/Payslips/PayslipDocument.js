import React from "react";
import html2pdf from "html2pdf.js";
import smallfirststeps from "../../../Data/smallfirststeps.png"; // Replace with your actual logo path
import { CurrencySymbol } from "../../../config/Currency";

const PayslipDocument = ({ payslipData, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const element = document.getElementById("payslip-document-content");
    const opt = {
      margin: [0, 0, 0, 0], // Remove all default margins
      filename: `payslip_${payslipData.id}.pdf`,
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().from(element).set(opt).save();
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex flex-col items-center justify-start z-50 overflow-auto">
      <div
        id="payslip-document-content"
        className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-4 mb-4"
        style={{ pageBreakInside: "avoid", fontSize: "12px" }}
      >
        {/* Header Section */}
        <div className="text-center border-b pb-2">
          <div className="flex justify-between mb-2">
            <img src={smallfirststeps} alt="Company Logo" className="h-12" />
            <div className="text-right">
              <h2 className="text-sm font-bold">First Steps Nursery</h2>
              <p className="text-xs">77 – Rue Hedi Chaker</p>
              <p className="text-xs">8011 - Dar Chaabane El Fehri</p>
              <p className="text-xs">Tel: 27 506 303 / 72 320 097</p>
              <p className="text-xs">firststepsnursery@outlook.com</p>
            </div>
          </div>
          <h2 className="text-base font-bold text-gray-800">
            Payslip {payslipData?.payslipMonth}, {payslipData?.payslipYear}
          </h2>
          <p className="text-xs text-gray-600">Document #: {payslipData?.id}</p>
        </div>

        {/* Employee, Summary, and Salary Components */}
        <div className="mt-2 border-b pb-2">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <h3 className="text-xs font-semibold text-gray-800">
                Employee: <strong>{payslipData?.payslipEmployeeName}</strong>
              </h3>
              <span className="text-xs">{`(${payslipData?.payslipEmployee?._id})`}</span>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-gray-800">Summary</h3>
              <p>
                <strong>Total Open Days:</strong>{" "}
                {
                  payslipData?.payslipWorkdays.filter((day) => !day.isWeekend)
                    .length
                }
              </p>
              <p>
                <strong>Total Paid Days:</strong>{" "}
                {
                  payslipData?.payslipWorkdays.filter(
                    (day) => day?.isPaid && !day?.isWeekend
                  ).length
                }
              </p>
              <p>
                <strong>Total Sick Leave:</strong>{" "}
                {
                  payslipData?.payslipWorkdays.filter((day) => day.isSickLeave)
                    .length
                }
              </p>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-gray-800">
                Salary Components ({CurrencySymbol})
              </h3>
              <p>
                <strong>Basic:</strong>{" "}
                {payslipData?.payslipSalaryComponents?.basic}
              </p>
              <p>
                <strong>Payable basic:</strong>{" "}
                {payslipData?.payslipSalaryComponents?.payableBasic}
              </p>
              <p>
                <strong>Allowance:</strong>{" "}
                {payslipData?.payslipSalaryComponents?.allowance}
              </p>
            
            </div>
          </div>
        </div>

        {/* Workdays Table */}
        <div className="mt-2">
          <h3 className="text-xs font-semibold text-gray-800 mb-2">
            Daily Information
          </h3>
          <table className="w-full border-collapse border border-gray-300 text-xs">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="border border-gray-300 px-0.5 py-0.5">Date</th>
                <th className="border border-gray-300 px-0.5 py-0.5">
                  Day Type
                </th>
                <th className="border border-gray-300 px-0.5 py-0.5">
                  Is Paid
                </th>
                <th className="border border-gray-300 px-0.5 py-0.5">
                  Duration
                </th>
              </tr>
            </thead>
            <tbody>
              {payslipData?.payslipWorkdays?.map((dayObj, index) => (
                <tr
                  key={index}
                  className={`${
                    dayObj.isWeekend ? "bg-yellow-100" : ""
                  } text-xs`}
                >
                  <td className="border border-gray-300 px-0.5 py-0.5">
                    {new Date(dayObj.day).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-300 px-0.5 py-0.5">
                    {dayObj.dayType}
                  </td>
                  <td className="border border-gray-300 px-0.5 py-0.5">
                    {dayObj.isPaid ? "Paid" : "Unpaid"}
                  </td>
                  <td className="border border-gray-300 px-0.5 py-0.5">
                    {dayObj.isPartDay
                      ? `${dayObj?.partdayDuration} Hours`
                      : dayObj.dayType === "off-day" ||
                        dayObj.dayType === "Given day"
                      ? "1 day leave"
                      : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total Section */}
        <div className="mt-2 text-xs grid grid-cols-3 gap-2">
          <p>
            <strong>Total Work Days:</strong>{" "}
            {
              payslipData?.payslipWorkdays.filter(
                (day) =>
                  day?.dayType === "Work day" || day?.dayType === "Given day"
              ).length
            }
          </p>{" "}
          <p>
            <strong>Total Salary:</strong> {CurrencySymbol}{" "}
            {payslipData?.payslipSalaryComponents?.totalAmount}
          </p>
        </div>

        {/* Footer Section */}
        <div className="mt-2 border-t pt-2 text-center">
          <p className="text-xs italic">
            This is an automatically generated payslip. No action required.
          </p>
          <p className="text-sm font-bold text-red-600 mt-1">
            No Action Required
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-4xl flex justify-between bg-gray-100 p-4 sticky bottom-0 z-50">
        <button onClick={onClose} className="cancel-button">
          Close
        </button>
        <button onClick={handlePrint} className="add-button">
          Print
        </button>
        <button onClick={handleDownload} className="save-button">
          Download as PDF
        </button>
      </div>
    </div>
  );
};

export default PayslipDocument;
