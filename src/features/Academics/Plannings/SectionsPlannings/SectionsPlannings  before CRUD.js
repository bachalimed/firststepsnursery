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
// import {
//   useGetSessionsByYearQuery,
//   useUpdateSessionMutation,
//   useAddNewSessionMutation,
//   useDeleteSessionMutation,
// } from "../../Plannings/Sessions/sessionsApiSlice";
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
// import { extend } from "@syncfusion/ej2-base";
// import Academics from "../../Academics";
// import styled from "styled-components";
// import { CiInboxOut, CiInboxIn } from "react-icons/ci";
// import { LuSchool } from "react-icons/lu";
// import { HiOutlineHomeModern } from "react-icons/hi2";
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
//   console.log(studentsList, "studentsList");
//   console.log(studentSections, "studentSections");

//   const fields = {
//     id: { name: "id" }, // Mapping your custom `id` field to `Id`
//     subject: { name: "subject" }, // Mapping your `title` field to `Subject`
//     startTime: { name: "startTime" }, // Mapping your `startTime` field to `StartTime`
//     endTime: { name: "endTime" }, // Mapping your `endTime` field to `EndTime`
//     location: { name: "location" },
//     title: { name: "title" },
//     sessionYear: { name: "sessionYear" },
//     animator: { name: "animator" },
//     school: { name: "school", idField: "_id" },
//     section: { name: "section", idField: "_id" },
//     student: { name: "student", idField: "_id" },
//     sessionSectionId: { name: "sessionSectionId" },
//     sessionStudentId: { name: "sessionStudentId" },
//     description: { name: "Description" },
//     site: { name: "site" },
//     trip: { name: "trip" },
//     classroom: { name: "classroom", idField: "_id" },
//     grades: { name: "grades" },
//     recurrenceRule: { name: "recurrenceRule" },
//     sessionStatus: { name: "sessionStatus" },
//     createdAt: { name: "createdAt" },
//     creator: { name: "creator" },
//     recurrenceException: { name: "recurrenceException" },
//     recurrenceId: { name: "recurrenceId" },
//     isAllDay: { name: "isAllDay" },
//     IsBlock: { name: "isBlock" },
//     isReadOnly: { name: "isReadOnly" },

//     schoolColor: { name: "schoolColor" },
//     // studentId: "student._id",
//     // siteId: "site._id",
//   };
//   // const resourceData = [
//   //   {
//   //     id: 1,
//   //     subject: "Quality Analysis",
//   //     startTime: "2023-01-04T01:30:00.000Z",
//   //     endTime: "2023-01-04T04:00:00.000Z",
//   //     IsAllDay: false,
//   //     sessionSectionId: "670f373a06010b02b404ffed",
//   //     sessionStudentId: "669391e2497696586d5317df",
//   //   },
//   //   {
//   //     id: 2,
//   //     subject: "Project Review",
//   //     startTime: "2023-01-04T05:45:00.000Z",
//   //     endTime: "2023-01-04T06:55:00.000Z",
//   //     isAllDay: false,
//   //     sessionSectionId: "670f373a06010b02b404ffed",
//   //     sessionStudentId: "669391e2497696586d5317df",
//   //   },
//   //   {
//   //     id: 3,
//   //     subject: "Requirement planning",
//   //     startTime: "2023-01-04T07:00:00.000Z",
//   //     endTime: "2023-01-04T09:15:00.000Z",
//   //     osAllDay: false,
//   //     sessionSectionId: "670f373a06010b02b404ffed",
//   //     sessionStudentId: "669391e2497696586d5317df",
//   //   },

//   //   {
//   //     id: 4,
//   //     subject: "Project Preview",
//   //     startTime: "2023-01-04T10:00:00.000Z",
//   //     endTime: "2023-01-04T11:15:00.000Z",
//   //     isAllDay: false,
//   //     sessionSectionId: "670f373a06010b02b404ffed",
//   //     sessionStudentId: "669391e2497696586d5317df",
//   //   },
//   //   {
//   //     id: 5,
//   //     subject: "Resource planning",
//   //     startTime: "2023-01-04T01:30:00.000Z",
//   //     endTime: "2023-01-04T02:50:00.000Z",
//   //     isAllDay: false,
//   //     sessionSectionId: "670f373a06010b02b404ffed",
//   //     sessionStudentId:"66d34816e0fdd42a2d4f7d17",
//   //   },
//   //   {
//   //     id: 6,
//   //     subject: "Workflow Analysis",
//   //     startTime: "2023-01-04T03:00:00.000Z",
//   //     endTime: "2023-01-04T04:30:00.000Z",
//   //     isAllDay: false,
//   //     sessionSectionId: "670f373a06010b02b404ffed",
//   //     sessionStudentId: "66d34816e0fdd42a2d4f7d17",
//   //   },
//   //   {
//   //     id: 7,
//   //     subject: "Timeline estimation",
//   //     startTime: "2023-01-04T04:30:00.000Z",
//   //     endTime: "2023-01-04T06:00:00.000Z",
//   //     isAllDay: false,
//   //     sessionSectionId: "670f373a06010b02b404ffed",
//   //     sessionStudentId: "66d34816e0fdd42a2d4f7d17",
//   //   },
//   //   {
//   //     id: 8,
//   //     subject: "Developers Meeting",
//   //     startTime: "2023-01-04T06:30:00.000Z",
//   //     endTime: "2023-01-04T07:50:00.000Z",
//   //     isAllDay: false,
//   //     sessionSectionId: "670f373a06010b02b404ffed",
//   //     sessionStudentId: "66d34816e0fdd42a2d4f7d17",
//   //   },

//   //   {
//   //     id: 9,
//   //     subject: "Manual testing",
//   //     startTime: "2023-01-04T08:45:00.000Z",
//   //     endTime: "2023-01-04T10:15:00.000Z",
//   //     isAllDay: false,
//   //     sessionSectionId: "670f373a06010b02b404ffed",
//   //     sessionStudentId: "66d34816e0fdd42a2d4f7d17",
//   //   },

//   //   {
//   //     id: 10,
//   //     subject: "Test report validation",
//   //     startTime: "2023-01-04T03:30:00.000Z",
//   //     endTime: "2023-01-04T05:30:00.000Z",
//   //     isAllDay: false,
//   //     sessionSectionId: "670f616606010b02b404ffef",
//   //     sessionStudentId: "66ef0ca1841eb64f7968a787",
//   //   },
//   //   {
//   //     id: 11,
//   //     subject: "Test case correction",
//   //     startTime: "2023-01-04T06:15:00.000Z",
//   //     endTime: "2023-01-04T08:00:00.000Z",
//   //     isAllDay: false,
//   //     sessionSectionId: "670f616606010b02b404ffef",
//   //     sessionStudentId: "66ef0ca1841eb64f7968a787",
//   //   },
//   //   {
//   //     id: 12,
//   //     subject: "Run test cases",
//   //     startTime: "2023-01-04T09:00:00.000Z",
//   //     endTime: "2023-01-04T10:30:00.000Z",
//   //     isAllDay: false,
//   //     sessionSectionId: "670f616606010b02b404ffef",
//   //     sessionStudentId: "66ef0ca1841eb64f7968a787",
//   //   },
//   // ];
//   // const sectionsss = [
//   //   { sectionLabel: "Grade 1", id: "670f373a06010b02b404ffed" },
//   //   { sectionLabel: "Grade 2", id: "670f616606010b02b404ffef" },
//   // ];

//   // //the colors of studetn s are taken into account in scheduler here
//   // const studentsss = [
//   //   {
//   //     studentName: "Nancy feirra",
//   //     id: "669391e2497696586d5317df",
//   //     studentSectionId: "670f373a06010b02b404ffed",
//   //     studentColor: "#df5236",
//   //   },
//   //   {
//   //     studentName: "Steven ben fierrona",
//   //     id: "66d34816e0fdd42a2d4f7d17",
//   //     studentSectionId: "670f373a06010b02b404ffed",
//   //     studentColor: "#7fa900",
//   //   },
//   //   {
//   //     studentName: "Robert bollio",
//   //     id: "66ef0ca1841eb64f7968a787",
//   //     studentSectionId: "670f616606010b02b404ffef",
//   //     studentColor: "#ea7a57",
//   //   },
//   //   {
//   //     studentName: "Smith sollero",
//   //     id: 4,
//   //     studentSectionId: "670f616606010b02b404ffef",
//   //     studentColor: "#5978ee",
//   //   },
//   // ];
//   const data = extend([], sessionsList, null, true);
//   const workDays = [0, 1, 2, 3, 4, 5];

 



//   return (
//     <>
//       <Academics />
//       <TimelineResourceGrouping className="timeline-resource-grouping e-schedule">
//         <div className="schedule-control-section">
//           <div className="col-lg-12 control-section">
//             <div className="control-wrapper">
//               <ScheduleComponent
//                 cssClass="timeline-resource-grouping"
//                 width="100%"
//                 //height="650px"
//                 selectedDate={new Date(2024, 9, 14)}
//                 currentView="TimelineDay"
//                 workDays={workDays}
//                 eventSettings={{ dataSource: data, fields: fields }}
//                 group={{ resources: ["Sections", "Students"] }}
                
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
