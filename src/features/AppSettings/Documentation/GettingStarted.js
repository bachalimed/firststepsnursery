import React, { useEffect } from "react";
import Documentation from "../Documentation";
import FormsInterface from "./../../../Data/FormsInterface.png";
import ListsInterface from "./../../../Data/ListsInterface.png";
import pageLayout from "./../../../Data/pageLayout.png";
const GettingStarted = () => {
  useEffect(() => {
    document.title = "Getting Started";
  });

  return (
    <>
      <Documentation />
      <div className="bg-gray-50 min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Getting Started
          </h2>
          <p className="text-lg mb-4">
            Welcome to your dashboard! Please take the time to know your
            interface to get started:
          </p>

          {/* General layout */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-2">General layout</h3>
            <p className="text-gray-700 mb-4">
              To begin, click one of{" "}
              <span className="font-bold">"Menu Tabs"</span> to select the
              module of your choice (Students, Academics, Finances...).
            </p>
            <div className="flex flex-col lg:flex-row items-center gap-6">
              <div className="lg:w-1/2">
                <img
                  src={pageLayout}
                  alt="main page layout Screenshot"
                  className="rounded-lg shadow-md"
                />
              </div>
              <div className="lg:w-1/2">
                <p className="text-gray-600">
                  This screenshot highlights where to find the{" "}
                  <span className="font-bold">Menu tabs</span>. Once a tab is
                  selected their sub Tabs (Payees, Expense Categories ) will be
                  available to choose from. On the top right corner, the profile
                  menu will let you perform profile related operations (reset
                  pasword, edit profile, logout...). Clicking on the Home
                  button, will direct you to the public page of the website. The
                  Academic Year selection, will control which year, the data
                  recorded or displayed is related to.
                </p>
              </div>
            </div>
          </div>

          {/* List Interface  */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-2">List Interface </h3>
            <p className="text-gray-700 mb-4">
              List interface will displayed as a table. A{" "}
              <span className="font-bold">search box </span>and
              <span className="font-bold"> filters</span>
              will be available under the sub tabs to facilitate retrieving
              records. Under the table,{" "}
              <span className="font-bold">pagination controls panel</span> are
              available and below it{" "}
              <span className="font-bold text-green-700">New button</span> will
              allow adding new records.
            </p>
            <div className="flex flex-col lg:flex-row items-center gap-6">
              <div className="lg:w-2/3">
                <img
                  src={ListsInterface}
                  alt="List interface Screenshot"
                  className="rounded-lg shadow-md"
                />
              </div>
              <div className="lg:w-1/2">
                <p className="text-gray-600">
                  According to the list displayed, it can be possible to select
                  one of the following buttons on the right of each row:
                  <p>
                    -
                    <span className="font-bold text-sky-600"> Blue icon: </span>
                    view detailed information about the record.
                  </p>
                  <p>
                    -
                    <span className="font-bold text-amber-300">
                      {" "}
                      Amber icon:{" "}
                    </span>
                    edit the record.
                  </p>
                  <p>
                    -<span className="font-bold text-red-600"> Red icon: </span>
                    delete the record.
                  </p>
                  <p>
                    -
                    <span className="font-bold text-fuchsia-600">
                      {" "}
                      Purple icon:{" "}
                    </span>
                    view documents.
                  </p>
                </p>
              </div>
            </div>
          </div>

          {/* Forms Interface */}
          <div>
            <h3 className="text-2xl font-semibold mb-2">Forms Interface</h3>
            <p className="text-gray-700 mb-4">
              Forms are used for creating or editing records. Some fileds are
              mandatory and are marked with red asterix.
            </p>
            <div className="flex flex-col lg:flex-row items-center gap-6">
              <div className="lg:w-1/2">
                <img
                  src={FormsInterface}
                  alt="form interface Screenshot"
                  className="rounded-lg shadow-md"
                />
              </div>
              <div className="lg:w-1/2">
                <p className="text-gray-600">
                  Saving will not be possbile if a mandatory fileds is empty or
                  not filled porperly. The red astrix highlights inputs that are
                  not properly filled (number of characters, wrong type of
                  input...).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GettingStarted;
