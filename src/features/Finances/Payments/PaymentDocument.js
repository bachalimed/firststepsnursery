import React from "react";
import html2pdf from "html2pdf.js";
import smallfirststeps from "../../../Data/smallfirststeps.png"; // Replace with your actual logo path
import { CurrencySymbol } from "../../../config/Currency";

const PaymentDocument = ({ paymentData, familyInfo, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const element = document.getElementById("payment-document-content");
    const opt = {
      margin: [0, 0, 0, 0], // Remove all default margins
      filename: `payment_${paymentData.id}.pdf`,
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().from(element).set(opt).save();
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex flex-col items-center justify-start z-50 overflow-auto">
      <div
        id="payment-document-content"
        className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 mb-6"
        style={{ pageBreakInside: "avoid" }}
      >
        {/* Header Section */}
        <div className="text-center border-b pb-4">
          <div className="flex justify-between mb-4">
            <img src={smallfirststeps} alt="Company Logo" className="h-16" />
            <div className="text-right">
              <h2 className="text-lg font-bold">First Steps Nursery</h2>
              <p className="text-sm">77 – Rue Hedi Chaker</p>
              <p className="text-sm">8011 - Dar Chaabane El Fehri</p>
              <p className="text-sm">Tel: 27 506 303 / 72 320 097</p>
              <p className="text-sm">firststepsnursery@outlook.com</p>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Receipt</h2>
          <p className="text-sm text-gray-600">Document #: {paymentData?.id}</p>
          <p className="text-sm text-gray-600">
            Payment Date:{" "}
            {paymentData.paymentDate
              ? new Date(paymentData.paymentDate).toLocaleDateString()
              : ""}
          </p>
        </div>

        {/* Payment and Payer Information */}
        <div className="mt-4 border-b pb-4">
          <div className="flex justify-between">
            <div className="ml-6">
              <h3 className="text-md font-semibold text-gray-800 mb-3">
                Student
              </h3>
              <p>
                {paymentData?.paymentStudent?.studentName?.firstName}{" "}
                {paymentData?.paymentStudent?.studentName?.middleName}{" "}
                {paymentData?.paymentStudent?.studentName?.lastName} (
                {paymentData?.paymentStudent?._id})
              </p>
            </div>
            <div className="mr-8">
              <h3 className="text-md font-semibold text-gray-800 mb-3">
                Payer
              </h3>
              <p>({paymentData?.familyInfo?.id})</p>
              <p>
                {paymentData?.familyInfo?.father?.userFirstName}{" "}
                {paymentData?.familyInfo?.father?.userMiddleName}{" "}
                {paymentData?.familyInfo?.father?.userLastName},{" "}
                {paymentData?.familyInfo?.mother?.userFirstName}{" "}
                {paymentData?.familyInfo?.mother?.userMiddleName}{" "}
                {paymentData?.familyInfo?.mother?.userLastName}
              </p>
            </div>
          </div>
        </div>

        {/* Receipt Details */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Receipt Details
          </h3>
          <div className="border-t border-b py-2 flex justify-between">
            <p>
              <strong>By:</strong>{" "}
              {paymentData.paymentType || "Placeholder Type"}
            </p>
            <p>
              <strong>Total:</strong>
            </p>
            <p>
              <strong>
                ({CurrencySymbol}) {paymentData?.paymentAmount}
              </strong>
            </p>
          </div>
          <table className="min-w-full table-auto border-collapse border border-gray-300 mt-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Student
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Details
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Invoice
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Period
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Year
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {paymentData.paymentInvoices.map((invoice, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2">
                    {paymentData.paymentStudent?.studentName?.firstName}{" "}
                    {paymentData.paymentStudent?.studentName?.lastName}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {invoice?.invoiceEnrolment?.serviceType} -
                    {invoice?.invoiceEnrolment?.servicePeriod}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {invoice._id}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {invoice.invoiceMonth}
                    <p>
                      due:{" "}
                      {new Date(invoice?.invoiceDueDate).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {invoice?.invoiceYear}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {invoice?.invoiceAmount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Section */}
        <div className="mt-4 border-t pt-4 text-center">
          <p className="text-sm italic">
            This is an automatically generated document for payment. No action
            required.
          </p>
          <p className="text-lg font-bold text-red-600 mt-2">
            No Action Required
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-4xl flex justify-between bg-gray-100 p-4 sticky bottom-0 z-50">
        <button onClick={onClose} className="cancel-button">
          Close
        </button>
        <button onClick={handlePrint} className="add-button ">
          Print
        </button>
        <button onClick={handleDownload} className="save-button">
          Download as PDF
        </button>
      </div>
    </div>
  );
};

export default PaymentDocument;
