// import * as React from "react";
// import { useEffect, useRef, useState } from "react";
// import { useSelector } from "react-redux";
// import {
//   TimelineViews,
//   TimelineMonth,
//   Agenda,
//   ScheduleComponent,
//   ViewsDirective,
//   ViewDirective,
//   ResourcesDirective,
//   ResourceDirective,
//   Inject,
//   Resize,
//   DragAndDrop,
// } from "@syncfusion/ej2-react-schedule";
// import { RecurrenceEditorComponent } from "@syncfusion/ej2-react-schedule";
// import {
//   DropDownListComponent,
//   DateTimePickerComponent,
// } from "@syncfusion/ej2-react-dropdowns";
// import { DropDownList } from "@syncfusion/ej2-dropdowns";
// import { createElement, extend } from "@syncfusion/ej2-base";
// import {
//   useGetSessionsByYearQuery,
//   useUpdateSessionMutation,
//   useAddNewSessionMutation,
//   useDeleteSessionMutation,
// } from "../../Plannings/Sessions/sessionsApiSlice";
// import { useGetEmployeesByYearQuery } from "../../../HR/Employees/employeesApiSlice";
// import { useGetClassroomsQuery } from "../../../AppSettings/AcademicsSet/Classrooms/classroomsApiSlice";
// import { useGetAttendedSchoolsQuery } from "../../../AppSettings/AcademicsSet/attendedSchools/attendedSchoolsApiSlice";
// import {
//   useGetSectionsByYearQuery,
//   useUpdateSectionMutation,
//   useDeleteSectionMutation,
// } from "../../Sections/sectionsApiSlice";
// import { useGetStudentsByYearQuery } from "../../../Students/StudentsAndParents/Students/studentsApiSlice";
// import {
//   selectCurrentAcademicYearId,
//   selectAcademicYearById,
// } from "../../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
// import {
//   setAcademicYears,
//   selectAllAcademicYears,
// } from "../../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";

// import Academics from "../../Plannings";
// import styled from "styled-components";
// import { CiInboxOut, CiInboxIn } from "react-icons/ci";
// import { LuSchool } from "react-icons/lu";
// import { HiOutlineHomeModern } from "react-icons/hi2";
// import {
//   TYPES,
//   SCHOOL_SUBJECTS,
//   NURSERY_SUBJECTS,
// } from "../../../../config/SchedulerConsts";
// import { classroomssList } from "./classroomssList";
// import RuleGenerate from "./RuleGenerate";
// const TimelineResourceGrouping = styled.div`
//   &.e-schedule:not(.e-device)
//     .e-agenda-view
//     .e-content-wrap
//     table
//     td:first-child {
//     width: 90px;
//   }

//   &.e-schedule .e-agenda-view .e-resource-column {
//     width: 100px;
//   }
// `;

// /**
//  * schedule timeline resource grouping sample
//  */
// const SectionsPlannings = () => {
//   const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
//   const selectedAcademicYear = useSelector((state) =>
//     selectAcademicYearById(state, selectedAcademicYearId)
//   ); // Get the full academic year object
//   const academicYears = useSelector(selectAllAcademicYears);

//   const {
//     data: sections, //the data is renamed sessions
//     isLoading: isSectionsLoading, 
//     isSuccess: isSectionsSuccess,
//     isError: isSectionsError,
//     error: sectionsError,
//   } = useGetSectionsByYearQuery(
//     {
//       selectedYear: selectedAcademicYear?.title,
//       endpointName: "SectionsListInPlanning",
//     } || {},
//     {
//       //pollingInterval: 60000,//will refetch data every 60seconds
//       refetchOnFocus: true, //when we focus on another window then come back to the window ti will refetch data
//       refetchOnMountOrArgChange: true, //refetch when we remount the component
//     }
//   );

//   const {
//     data: students, //the data is renamed sessions
//     isLoading: isStudentsLoading, 
//     isSuccess: isStudentsSuccess,
//     isError: isStudentsError,
//     error: studentsError,
//   } = useGetStudentsByYearQuery(
//     {
//       selectedYear: selectedAcademicYear?.title,
//       criteria: "withSections",

//       endpointName: "studentsList",
//     } || {},
//     {
//       //pollingInterval: 60000,//will refetch data every 60seconds
//       refetchOnFocus: true, //when we focus on another window then come back to the window ti will refetch data
//       refetchOnMountOrArgChange: true, //refetch when we remount the component
//     }
//   );

//   const {
//     data: sessions, //the data is renamed sessions
//     isLoading: isSessionsLoading, 
//     isSuccess: isSessionsSuccess,
//     isError: isSessionsError,
//     error: sessionsError,
//   } = useGetSessionsByYearQuery(
//     {
//       selectedYear: selectedAcademicYear?.title,
//       criteria: "schools",
//       endpointName: "sessionsList",
//     } || {},
//     {
//       //pollingInterval: 60000,//will refetch data every 60seconds
//       refetchOnFocus: true, //when we focus on another window then come back to the window ti will refetch data
//       refetchOnMountOrArgChange: true, //refetch when we remount the component
//     }
//   );

//   const {
//     data: employees, //the data is renamed sessions
//     isLoading: isEmployeesLoading, 
//     isSuccess: isEmployeesSuccess,
//     isError: isEmployeesError,
//     error: employeesError,
//   } = useGetEmployeesByYearQuery(
//     {
//       selectedYear: selectedAcademicYear?.title,
//       criteria: "Animator",

//       endpointName: "employeesList",
//     } || {},
//     {
//       //pollingInterval: 60000,//will refetch data every 60seconds
//       refetchOnFocus: true, //when we focus on another window then come back to the window ti will refetch data
//       refetchOnMountOrArgChange: true, //refetch when we remount the component
//     }
//   );

//   const {
//     data: classrooms, //the data is renamed sessions
//     isLoading: isClassroomsLoading, 
//     isSuccess: isClassroomsSuccess,
//     isError: isClassroomsError,
//     error: classroomsError,
//   } = useGetClassroomsQuery(
//     {
//       endpointName: "ClassroomsList",
//     } || {},
//     {
//       //pollingInterval: 60000,//will refetch data every 60seconds
//       refetchOnFocus: true, //when we focus on another window then come back to the window ti will refetch data
//       refetchOnMountOrArgChange: true, //refetch when we remount the component
//     }
//   );
//   const {
//     data: schools, //the data is renamed sessions
//     isLoading: isSchoolsLoading,
//     isSuccess: isSchoolsSuccess,
//     isError: isSchoolsError,
//     error: schoolsError,
//   } = useGetAttendedSchoolsQuery(
//     {
//       endpointName: "AttendedSchoolsList",
//     } || {},
//     {
//       //pollingInterval: 60000,//will refetch data every 60seconds
//       refetchOnFocus: true, //when we focus on another window then come back to the window ti will refetch data
//       refetchOnMountOrArgChange: true, //refetch when we remount the component
//     }
//   );

//   const [
//     addNewSession,
//     {
//       //an object that calls the status when we execute the newUserForm function
//       isLoading: isAddSessionLoading,
//       isSuccess: isAddSessionSuccess,
//       isError: isAddSessionError,
//       error: addSessionError,
//     },
//   ] = useAddNewSessionMutation(); //it will not execute the mutation nownow but when called
//   const [
//     updateSession,
//     {
//       //an object that calls the status when we execute the newUserForm function
//       isLoading: isUpdateSessionLoading,
//       isSuccess: isUpdateSessionSuccess,
//       isError: isUpdateSessionError,
//       error: updateSessionError,
//     },
//   ] = useUpdateSessionMutation(); //it will not execute the mutation nownow but when called
//   // Prepare sessions list and resource data
//   const [
//     deleteSession,
//     {
//       //an object that calls the status when we execute the newUserForm function
//       isLoading: isDeleteSessionLoading,
//       isSuccess: isDeleteSessionSuccess,
//       isError: isDeleteSessionError,
//       error: deleteSessionError,
//     },
//   ] = useDeleteSessionMutation(); //it will not execute the mutation nownow but when called
//   // Prepare sessions list and resource data
//   let sessionsList = isSessionsSuccess ? Object.values(sessions.entities) : [];
//   //let schoolsListData = isSchoolsSuccess ? Object.values(schools.entities) : [];
//   let employeesList = isEmployeesSuccess
//     ? Object.values(employees.entities)
//     : [];
//   let classroomsList = isClassroomsSuccess
//     ? Object.values(classrooms.entities)
//     : [];
//   let schoolsList = isSchoolsSuccess ? Object.values(schools.entities) : [];
//   let studentSections = isSectionsSuccess
//     ? Object.values(sections.entities)
//     : [];
//   let studentsList = isStudentsSuccess ? Object.values(students.entities) : [];
//   if (isSectionsSuccess && !isSectionsLoading) {
//     const { entities } = sections;
//     studentSections = Object.values(entities);
//   }
//   if (isStudentsSuccess && !isStudentsLoading) {
//     const { entities } = students;
//     studentsList = Object.values(entities);
//   }

//   if (isSessionsSuccess) {
//     //set to the state to be used for other component s and edit student component
//     const { entities } = sessions;
//     sessionsList = Object.values(entities); //we are using entity adapter in this query

//     console.log(sessionsList, "sessionsList");
//   }
//   //console.log(studentsList, "studentsList");
//   // console.log(studentSections, "studentSections");
//   if (isEmployeesSuccess && !isEmployeesLoading) {
//     const { entities } = employees;
//     employeesList = Object.values(entities);
//   }
//   if (isClassroomsSuccess && !isClassroomsLoading) {
//     const { entities } = classrooms;
//     classroomsList = Object.values(entities);
//   }
//   if (isSchoolsSuccess && !isSchoolsLoading) {
//     const { entities } = schools;
//     schoolsList = Object.values(entities);
//   }
//   //console.log(schoolsList, "schoolsList");
//   const fields = {
//     id: { name: "id" }, // Mapping your custom `id` field to `Id`
//     subject: { name: "subject" }, // Mapping your `title` field to `Subject`
//     startTime: { name: "startTime" }, // Mapping your `startTime` field to `StartTime`
//     endTime: { name: "endTime" }, // Mapping your `endTime` field to `EndTime`
//     location: { name: "location" },
//     //title: { name: "title" },
//     description: { name: "description" },
//     recurrenceRule: { name: "recurrenceRule" },
//     recurrenceException: { name: "recurrenceException" },
//     RecurrenceID: { name: "recurrenceID" },//capital works
//     FollowingID: { name: "followingID" },//capital works
//     isAllDay: { name: "isAllDay" },
//     isReadOnly: { name: "isReadOnly" },
//     //isBlock: { name: "isBlock" },////// if Is and not is all is not blocked
//     sessionYear: { name: "sessionYear" },
//     animator: { name: "animator" },
//     school: { name: "school", idField: "_id" },
//     section: { name: "section", idField: "_id" },
//     student: { name: "student", idField: "_id" },
//     sessionSectionId: { name: "sessionSectionId" },
//      sessionStudentId: { name: "sessionStudentId" },
//     site: { name: "site" },
//     classroom: { name: "classroom", idField: "_id" },
//     //createdAt: { name: "createdAt" },
//     creator: { name: "creator" },
//     schoolColor: { name: "schoolColor" },
//   };

//   const data = extend([], sessionsList, null, true);
//   const workDays = [0, 1, 2, 3, 4, 5];
//   const scheduleObj = useRef(null); // Create a ref for the ScheduleComponent,
//   // scheduleObj.current will store the actual instance, allowing you to call Scheduler methods like openEditor

//   //  const onPopupOpen = (args) => {
//   //   //to capture the id when updateing event
//   //   const existingSessionId= args.data.id
//   //   if (existingSessionId){ setCrudAction('Update')
//   //   }
//   //   console.log(args.data, 'args dataaaaaaaaa')
//   //   if (args.type === 'Editor') {
//   //     // Locate the default editor form element
//   //     const formElement = args.element.querySelector('.e-schedule-form');

//   //     // Create a row container for custom fields to be placed above default fields
//   //     const customRow = createElement('div', { className: 'custom-field-row' });
//   //     formElement.insertBefore(customRow, formElement.lastElementChild); // Insert custom row before the last child (default fields)

//   //     // Function to create and append dropdown fields with custom field mappings
//   //     const createDropdownField = (name, placeholder, dataSource, textField, valueField) => {
//   //       const container = createElement('div', { className: 'custom-field-container' });
//   //       const inputEle = createElement('input', { className: 'e-field', attrs: { name } });
//   //       container.appendChild(inputEle);
//   //       customRow.appendChild(container);

//   //       // Initialize the dropdown list
//   //       const dropDownList = new DropDownList({
//   //         dataSource,
//   //         fields: { text: textField, value: valueField },
//   //         value: args.data[name], // Set default value if it exists
//   //         floatLabelType: 'Always',
//   //         placeholder,
//   //         change: (event) => {
//   //           if (name === 'sessionType') {
//   //             updateDropdownsBasedOnSessionType(event.value);
//   //           }
//   //         }
//   //       });
//   //       dropDownList.appendTo(inputEle);
//   //       inputEle.setAttribute('name', name);
//   //     };

//   //     // Function to update dropdowns based on the selected session type
//   //     const updateDropdownsBasedOnSessionType = (sessionType) => {
//   //       // Clear previous dropdowns
//   //       clearDropdown('school');
//   //       clearDropdown('subject');
//   //       clearDropdown('classroom');
//   //       clearDropdown('animator'); // Clear animator dropdown if it exists

//   //       switch (sessionType) {
//   //         case 'School':
//   //           createDropdownField('school', 'School', schoolsList.filter(school => school.id !== 'FirstSteps'), 'schoolName', 'id');
//   //           createDropdownField('subject', 'Subject', SCHOOL_SUBJECTS, 'label', 'value');
//   //           break;
//   //         case 'Nursery':
//   //           createDropdownField('school', 'School', [{ label: 'First Steps', value: 'FirstSteps' }], 'label', 'value');
//   //           createDropdownField('subject', 'Subject', NURSERY_SUBJECTS, 'label', 'value');
//   //           createDropdownField('classroom', 'Classroom', classroomsList, 'classroomLabel', 'id');
//   //           createDropdownField('animator', 'Animator', employeesList, 'userFullName', 'employeeId'); // Show animator for Nursery
//   //           break;
//   //         case 'Drop':
//   //         case 'Collect':
//   //           createDropdownField('school', 'School', schoolsList.filter(school => school.id !== '6714e7abe2df335eecd87750'), 'schoolName', 'id');
//   //           createDropdownField('animator', 'Animator', employeesList, 'userFullName', 'employeeId'); // Show animator for Drop and Collect
//   //           break;
//   //       }
//   //     };

//   //     // Helper function to clear existing dropdowns
//   //     const clearDropdown = (name) => {
//   //       const existingField = customRow.querySelector(`input[name="${name}"]`);
//   //       if (existingField) {
//   //         existingField.parentNode.remove(); // Remove field's parent container
//   //       }
//   //     };

//   //     // Create the Session Type dropdown first
//   //     createDropdownField('sessionType', 'Session Type', ['School', 'Nursery', 'Drop', 'Collect'], 'label', 'value');

//   //     // Add default fields at the bottom (title and location fields)
//   //     const titleFieldLabel = formElement.querySelector('.e-title-container label');
//   //     if (titleFieldLabel) titleFieldLabel.innerHTML = 'Subject'; // Change the label to "Subject"

//   //     const locationFieldContainer = formElement.querySelector('.e-location-container');
//   //     if (locationFieldContainer) {
//   //       const locationField = locationFieldContainer.querySelector('input[name="Location"]');
//   //       if (locationField) locationField.disabled = true; // Disable Location field
//   //     }
//   //   }
//   // };
//   const [sessionObjectParentId, setSessionObjectParentId] = useState(""); //this will be used to update the parent for any recurrence change, maybe we can find directly the session parent and update
//   const [parentRecurrenceException, setParentRecurrenceException] = useState("");
//   const [followingId, setFollowingId] = useState("");
//   const [recurrenceId, setRecurrenceId] = useState("");
//   const [sessionObject, setSessionObject] = useState({
    
//     sessionYear: "",
//     animator: "",
//     description: "",
//     subject: "",
//     endTime: "",
//     startTime: "",
//     location: "",
//     isAllDay: false,
//     isBlock: false,
//     recurrenceRule: "",
//     recurrenceException: "",
//     color: "",
//     student: "",
//     recurrenceID:"",
//     followingID:"",
//     school: "",
//     isReadOnly: false,
//     sessionType: "",
//   }); //this will be the object to save,


//   const onPopupOpen = (args) => {
//     console.log(scheduleObj.current, 'scheduleobj cureent')
    
//     if(args.data.id) {
//     //console.log(args.data,' popupopen args dataaa')
//     console.log(args, " popupopen argsgggsss");
    
//     setSessionObjectParentId(args.data.id)// to be used for exception later
//       //RecurrenceID is automatically assigned ( or from DB as RecurrenceID as well as Exceptiona nd following)so we useRecurecne but  recurrenceRule is retreived from DB
//       args.data.RecurrenceID && args.data.recurrenceRule !== ""
//         ? setRecurrenceId(args.data.RecurrenceID)
//         : setRecurrenceId(""); // the recurrence ID already in the data for any recurrent event
//     }

//     if (args.type === "Editor") {
      
//       console.log(scheduleObj.current, 'scheduleobj current')

//     //console.log(scheduleObj.eventWindow.recurrenceEditor.frequencies, 'scheduleobj frequencies') recurrentce editor not working
//       const formElement = args.element.querySelector(".e-schedule-form");




//         // Remove the default title and location row
//         const titleLocationRow = formElement.querySelector(".e-title-location-row");
//         if (titleLocationRow) {
//             titleLocationRow.remove();
//         }

//         // Create a new custom row for "Subject" and "Location"
//         let customRow = formElement.querySelector(".custom-field-row");
//         if (!customRow) {
//             customRow = createElement("div", { className: "custom-field-row" });
//             formElement.insertBefore(customRow, formElement.firstElementChild);
//         }
// //  // Try accessing and updating the "Subject" field
// //  const subjectField = formElement.querySelector('.e-subject');
// //  if (subjectField) {
// //      console.log('Initial Subject Field Value:', subjectField.value, subjectField);
// //      subjectField.value = args.data.subject || 'Default Subject';
// //      console.log('Updated Subject Field Value:', subjectField.value);
// //  } else {
// //      console.warn("Subject field not found.");
// //  }



//       // // Create a row container for custom fields if it doesn't already exist
//       // let customRow = formElement.querySelector(".custom-field-row");
//       // if (!customRow) {
//       //   customRow = createElement("div", { className: "custom-field-row" });
//       //   formElement.insertBefore(customRow, formElement.lastElementChild); // Insert custom row above default fields
//       // }


// /////the following two fields will cause overlap over modified inputs, keep commnented
//        // Custom field for "Subject"
//       //  const subjectContainer = createElement("div", { className: "custom-field-container" });
//       //  const subjectLabel = createElement("label", { innerHTML: "Subject", className: "e-float-text e-label-top" });
//       //  const subjectInput = createElement("input", {
//       //      className: "e-field",
//       //      attrs: { name: "Subject", type: "text", value: args.data.Subject || "" },
//       //  });
//       //  subjectContainer.appendChild(subjectLabel);
//       //  subjectContainer.appendChild(subjectInput);
//       //  customRow.appendChild(subjectContainer);

//       //  // Custom field for "Location" (if needed)
//       //  const locationContainer = createElement("div", { className: "custom-field-container" });
//       //  const locationLabel = createElement("label", { innerHTML: "Location", className: "e-float-text e-label-top" });
//       //  const locationInput = createElement("input", {
//       //      className: "e-field",
//       //      attrs: { name: "Location", type: "text", disabled: true, value: args.data.Location || "" },
//       //  });
//       //  locationContainer.appendChild(locationLabel);
//       //  locationContainer.appendChild(locationInput);
//       //  customRow.appendChild(locationContainer);
//       // Function to create and append dropdown fields
//       const createDropdownField = (
//         name,
//         placeholder,
//         dataSource,
//         textField,
//         valueField
//       ) => {
//         const container = createElement("div", {
//           className: "custom-field-container",
//         });
//         const inputEle = createElement("input", {
//           className: "e-field",
//           attrs: { name },
//         });
//         container.appendChild(inputEle);
//         customRow.appendChild(container);

//         // Initialize dropdown
//         const dropDownList = new DropDownList({
//           dataSource,
//           fields: { text: textField, value: valueField },
//           value: args.data[name],
//           floatLabelType: "Always",
//           placeholder,
//           change: (event) => {
//             if (name === "sessionType") {
//               updateDropdownsBasedOnSessionType(event.value);
//             }
//           },
//         });
//         dropDownList.appendTo(inputEle);
//         inputEle.setAttribute("name", name);
//       };

//       // Update dropdowns based on session type
//       const updateDropdownsBasedOnSessionType = (sessionType) => {
//         clearDropdown("school");
//         clearDropdown("subject");
//         clearDropdown("classroom");
//         clearDropdown("animator");

//         switch (sessionType) {
//           case "School":
//             createDropdownField(
//               "school",
//               "School Name",
//               schoolsList.filter((school) => school.schoolName !== "FirstSteps"),
//               "schoolName",
//               "id"
//             );
//             createDropdownField(
//               "subject",
//               "Subject",
//               SCHOOL_SUBJECTS,
//               "label",
//               "value"
//             );
//             break;
//           case "Nursery":
//             createDropdownField(
//               "school",
//               "School Name",
//               [{ schoolName: "First Steps", id: "6714e7abe2df335eecd87750" }],
//               "schoolName",
//               "id"
//             );
//             createDropdownField(
//               "subject",
//               "Subject",
//               NURSERY_SUBJECTS,
//               "label",
//               "value"
//             );
//             createDropdownField(
//               "classroom",
//               "Classroom",
//               classroomsList,
//               "classroomLabel",
//               "id"
//             );
//             createDropdownField(
//               "animator",
//               "Animator",
//               employeesList,
//               "userFullName",
//               "employeeId"
//             );
//             break;
//           case "Drop":
//           case "Collect":
//             createDropdownField(
//               "school",
//               "School",
//               schoolsList.filter(
//                 (school) => school.id !== "6714e7abe2df335eecd87750"
//               ),
//               "schoolName",
//               "id"
//             );
//             createDropdownField(
//               "animator",
//               "Animator",
//               employeesList,
//               "userFullName",
//               "employeeId"
//             );
//             break;
//         }
//       };

//       // Clear previous dropdowns if they exist
//       const clearDropdown = (name) => {
//         const existingField = customRow.querySelector(`input[name="${name}"]`);
//         if (existingField) {
//           existingField.parentNode.remove();
//         }
//       };

//       // Create the Session Type dropdown
//       createDropdownField(
//         "sessionType",
//         "Session Type",
//         ["School", "Nursery", "Drop", "Collect"],
//         "label",
//         "value"
//       );

//       // // Add title field label and location field handling// we changed the name from title to subjet
//       // const subjectFieldLabel = formElement.querySelector(
//       //   ".e-subject-container label"
//       // );
//       // if (subjectFieldLabel) subjectFieldLabel.innerHTML = "Subject";

//       // const locationFieldContainer = formElement.querySelector(
//       //   ".e-location-container"
//       // );
//       // if (locationFieldContainer) {
//       //   const locationField = locationFieldContainer.querySelector(
//       //     'input[name="Location"]'
//       //   );
//       //   if (locationField) locationField.disabled = true;
//       // }




//       // **Handle Recurrence-Specific Fields**// check the args.data and apply conditions...
//       if (args.data.recurrenceRule && recurrenceId) {
//         const isException = Boolean(args.data.RecurrenceException);

//         if (isException) {
//           // Existing instance is part of a recurring event and an exception
//           const recurrenceField = createElement("div", {
//             innerHTML: "Editing an instance (exception) in the series",
//             className: "recurrence-notification",
//           });
//           formElement.insertBefore(recurrenceField, formElement.firstChild);
//         } else {
//           // Show fields related to handling entire series or exceptions
//           const recurrenceField = createElement("div", {
//             innerHTML: "Editing a recurring event or series",
//             className: "recurrence-notification",
//           });
//           formElement.insertBefore(recurrenceField, formElement.firstChild);
//         }
//       }
//     }
//   };

//   const onActionBegin = (args) => {
//     //console.log(args.data, 'action begin args dataaaa')
//     console.log(args, "action begin argssssssssssss");
//     //capture save, update, delete//////////////////////
//     if (args.requestType === "eventCreate") {
//       console.log("Event Save");
//     } else if (args.requestType === "eventChange") {
//       //args.data....
//       console.log("Event Update");
//     } else if (args.requestType === "eventRemove") {
//       console.log("Event Delete");
//     }
//   };

//   const onPopupClose = (args) => {
//     //capture the cancel action/////////////////
//     // if (args.type === 'Editor' && args.cancel) {
//     //   console.log('Event Edit Canceled');
//     // }

//     if (args.type === "Editor") {
//       console.log("args popupclose", args);
//     }
//   };
//   const actionComplete = (args) => {
//     //capture save, update, delete//////////////////////
//     if (args.requestType === "eventCreated") {
//       console.log("Event Saved");
//     } else if (args.requestType === "eventChanged") {
//       console.log("Event Updated");
//     } else if (args.requestType === "eventRemoved") {
//       console.log("Event Deleted");
//     }
//   };

//   return (
//     <>
//       <Academics />
//       <TimelineResourceGrouping className="timeline-resource-grouping e-schedule">
//         <div className="schedule-control-section">
//           <div className="col-lg-12 control-section">
//             <div className="control-wrapper">
//               <ScheduleComponent
//                 ref={scheduleObj} //to access and update teh scheduler by applying the query filter based on selectedschools
//                 cssClass="timeline-resource-grouping"
//                 width="100%"
//                 //height="650px"
//                 selectedDate={new Date(2024, 9, 14)}
//                 timeScale={{ enable: true, interval: 60, slotCount: 4 }}
//                 currentView="TimelineDay"
//                 workDays={workDays}
//                 startHour="07:00"
//                 endHour="18:00"
//                 eventSettings={{
//                   dataSource: data,
//                   editFollowingEvents: true,
//                   fields: fields,
//                 }}
//                 rowAutoHeight={true}
//                 group={{ resources: ["Sections", "Students"] }}
//                 popupOpen={onPopupOpen}
//                 actionBegin={onActionBegin}
//                 actionComplete={actionComplete}
//                 // eventRendered={onEventRendered}
//                 popupClose={onPopupClose}
//               >
//                 <ResourcesDirective>
//                   <ResourceDirective
//                     field="sessionSectionId" //the id of the section in the session data
//                     title="Choose Section" //this is what will apppear in new or edit window
//                     name="Sections" //name of the group
//                     allowMultiple={false}
//                     dataSource={studentSections}
//                     textField="sectionLabel"
//                     idField="id"
//                     // colorField="color"
//                   />
//                   <ResourceDirective
//                     field="sessionStudentId"
//                     title=" Choose Student" // //this is what will apppear in new or edit window
//                     name="Students"
//                     allowMultiple={true}
//                     dataSource={studentsList}
//                     textField="studentName" // will be replaced by the StudentNameTemplate
//                     idField="id"
//                     groupIDField="studentSectionId"
//                     colorField="studentColor"
//                   />
//                 </ResourcesDirective>
//                 <ViewsDirective>
//                   <ViewDirective option="TimelineDay" />

//                   <ViewDirective option="Agenda" />
//                 </ViewsDirective>
//                 <Inject
//                   services={[
//                     TimelineViews,
//                     TimelineMonth,
//                     Agenda,
//                     Resize,
//                     DragAndDrop,
//                   ]}
//                 />
//               </ScheduleComponent>
//             </div>
//           </div>
//         </div>
//       </TimelineResourceGrouping>
//     </>
//   );
// };
// export default SectionsPlannings;
