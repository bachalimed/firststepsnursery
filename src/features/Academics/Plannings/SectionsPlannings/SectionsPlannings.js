import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import useAuth from "../../../../hooks/useAuth";
import {
  TimelineViews,
  TimelineMonth,
  Agenda,
  Week,
  ScheduleComponent,
  ViewsDirective,
  ViewDirective,
  ResourcesDirective,
  ResourceDirective,
  Inject,
  Resize,
  DragAndDrop,
} from "@syncfusion/ej2-react-schedule";
import { RecurrenceEditorComponent } from "@syncfusion/ej2-react-schedule";
import {
  DropDownListComponent,
  DateTimePickerComponent,
} from "@syncfusion/ej2-react-dropdowns";
import { DropDownList } from "@syncfusion/ej2-dropdowns";
import { createElement, extend } from "@syncfusion/ej2-base";
import {
  useGetSessionsByYearQuery,
  useUpdateSessionMutation,
  useAddNewSessionMutation,
  useDeleteSessionMutation,
  useDeleteSessionWithBodyMutation,
} from "../../Plannings/Sessions/sessionsApiSlice";
import { useGetEmployeesByYearQuery } from "../../../HR/Employees/employeesApiSlice";
import { useGetClassroomsQuery } from "../../../AppSettings/AcademicsSet/Classrooms/classroomsApiSlice";
import { useGetAttendedSchoolsQuery } from "../../../AppSettings/AcademicsSet/attendedSchools/attendedSchoolsApiSlice";
import {
  useGetSectionsByYearQuery,
  useUpdateSectionMutation,
  useDeleteSectionMutation,
} from "../../Sections/sectionsApiSlice";
import { useGetStudentsByYearQuery } from "../../../Students/StudentsAndParents/Students/studentsApiSlice";
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
} from "../../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import {
  setAcademicYears,
  selectAllAcademicYears,
} from "../../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";

import Academics from "../../Academics";
import styled from "styled-components";
import { CiInboxOut, CiInboxIn } from "react-icons/ci";
import { LuSchool } from "react-icons/lu";
import { HiOutlineHomeModern } from "react-icons/hi2";
import {
  TYPES,
  SCHOOL_SUBJECTS,
  NURSERY_SUBJECTS,
} from "../../../../config/SchedulerConsts";
import { classroomssList } from "./classroomssList";
import RuleGenerate from "./RuleGenerate";
import { animatorsAssignments } from "./employeessList";
const TimelineResourceGrouping = styled.div`
  &.e-schedule:not(.e-device)
    .e-agenda-view
    .e-content-wrap
    table
    td:first-child {
    width: 90px;
  }

  &.e-schedule .e-agenda-view .e-resource-column {
    width: 100px;
  }
`;

/**
 * schedule timeline resource grouping sample
 * we are using two types of filtering, the filter on the quried data itself to filter schools and subjects and sessiontypes and another filter oschedulonbj becasue it 
 * elaborates teh events and we can assign the animators according to their assignemtn
 */
const SectionsPlannings = () => {
  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);
  const { userId } = useAuth();
  const {
    data: sections, //the data is renamed sessions
    isLoading: isSectionsLoading, 
    isSuccess: isSectionsSuccess,
    isError: isSectionsError,
    error: sectionsError,
  } = useGetSectionsByYearQuery(
    {
      selectedYear: selectedAcademicYear?.title,
      endpointName: "SectionsPlannings",
    } || {},
    {
      //pollingInterval: 60000,//will refetch data every 60seconds
      refetchOnFocus: true, //when we focus on another window then come back to the window ti will refetch data
      refetchOnMountOrArgChange: true, //refetch when we remount the component
    }
  );

  const {
    data: students, //the data is renamed sessions
    isLoading: isStudentsLoading, 
    isSuccess: isStudentsSuccess,
    isError: isStudentsError,
    error: studentsError,
  } = useGetStudentsByYearQuery(
    {
      selectedYear: selectedAcademicYear?.title,
      criteria: "withSections",

      endpointName: "SectionsPlannings",
    } || {},
    {
      //pollingInterval: 60000,//will refetch data every 60seconds
      refetchOnFocus: true, //when we focus on another window then come back to the window ti will refetch data
      refetchOnMountOrArgChange: true, //refetch when we remount the component
    }
  );

  const {
    data: sessions, //the data is renamed sessions
    isLoading: isSessionsLoading, 
    isSuccess: isSessionsSuccess,
    isError: isSessionsError,
    error: sessionsError,
  } = useGetSessionsByYearQuery(
    {
      selectedYear: selectedAcademicYear?.title,
      criteria: "schools",
      endpointName: "SectionsPlannings",
    } || {},
    {
      //pollingInterval: 60000, //will refetch data every 60seconds
      refetchOnFocus: true, //when we focus on another window then come back to the window ti will refetch data
      refetchOnMountOrArgChange: true, //refetch when we remount the component
    }
  );

  const {
    data: employees, //the data is renamed sessions
    isLoading: isEmployeesLoading, 
    isSuccess: isEmployeesSuccess,
    isError: isEmployeesError,
    error: employeesError,
  } = useGetEmployeesByYearQuery(
    {
      selectedYear: selectedAcademicYear?.title,
      criteria: "Animator",

      endpointName: "SectionsPlannings",
    } || {},
    {
      //pollingInterval: 60000,//will refetch data every 60seconds
      //refetchOnFocus: true, //when we focus on another window then come back to the window ti will refetch data
      // refetchOnMountOrArgChange: true, //refetch when we remount the component
    }
  );

  const {
    data: classrooms, //the data is renamed sessions
    isLoading: isClassroomsLoading, 
    isSuccess: isClassroomsSuccess,
    isError: isClassroomsError,
    error: classroomsError,
  } = useGetClassroomsQuery(
    {
      endpointName: "SectionsPlannings",
    } || {},
    {
      //pollingInterval: 60000,//will refetch data every 60seconds
      //refetchOnFocus: true, //when we focus on another window then come back to the window ti will refetch data
      // refetchOnMountOrArgChange: true, //refetch when we remount the component
    }
  );
  const {
    data: schools, //the data is renamed sessions
    isLoading: isSchoolsLoading, 
    isSuccess: isSchoolsSuccess,
    isError: isSchoolsError,
    error: schoolsError,
  } = useGetAttendedSchoolsQuery(
    {
      endpointName: "SectionsPlannings",
    } || {},
    {
      //pollingInterval: 60000,//will refetch data every 60seconds
      //refetchOnFocus: true, //when we focus on another window then come back to the window ti will refetch data
      //refetchOnMountOrArgChange: true, //refetch when we remount the component
    }
  );

  const [
    addNewSession,
    {
      //an object that calls the status when we execute the newUserForm function
      isLoading: isAddSessionLoading,
      isSuccess: isAddSessionSuccess,
      isError: isAddSessionError,
      error: addSessionError,
    },
  ] = useAddNewSessionMutation(); //it will not execute the mutation nownow but when called
  const [
    updateSession,
    {
      //an object that calls the status when we execute the newUserForm function
      isLoading: isUpdateSessionLoading,
      isSuccess: isUpdateSessionSuccess,
      isError: isUpdateSessionError,
      error: updateSessionError,
    },
  ] = useUpdateSessionMutation(); //it will not execute the mutation nownow but when called
  // Prepare sessions list and resource data
  const [
    deleteSession,
    {
      //an object that calls the status when we execute the newUserForm function
      isLoading: isDeleteSessionLoading,
      isSuccess: isDeleteSessionSuccess,
      isError: isDeleteSessionError,
      error: deleteSessionError,
    },
  ] = useDeleteSessionWithBodyMutation(); //it will not execute the mutation nownow but when called
  // Prepare sessions list and resource data
  let sessionsList = isSessionsSuccess ? Object.values(sessions.entities) : [];
  //let schoolsListData = isSchoolsSuccess ? Object.values(schools.entities) : [];
  let employeesList = isEmployeesSuccess
    ? Object.values(employees.entities)
    : [];
  let classroomsList = isClassroomsSuccess
    ? Object.values(classrooms.entities)
    : [];
  let schoolsList = isSchoolsSuccess ? Object.values(schools.entities) : [];
  let studentSections = isSectionsSuccess
    ? Object.values(sections.entities)
    : [];
  let studentsList = isStudentsSuccess ? Object.values(students.entities) : [];

  // if (isStudentsSuccess && !isStudentsLoading) {
  //   const { entities } = students;
  //   studentsList = Object.values(entities);
  // }

  // if (isEmployeesSuccess && !isEmployeesLoading) {
  //   const { entities } = employees;
  //   employeesList = Object.values(entities);
  // }
  // if (isClassroomsSuccess && !isClassroomsLoading) {
  //   const { entities } = classrooms;
  //   classroomsList = Object.values(entities);
  // }
  // if (isSchoolsSuccess && !isSchoolsLoading) {
  //   const { entities } = schools;
  //   schoolsList = Object.values(entities);
  // }
  let filteredStudentsList = [];
  let filteredSessionsList = [];
  let filteredSectionsList = [];
  const [selectedSchoolId, setSelectedSchoolId] = useState("");//filter
  const [selectedSessionType, setSelectedSessionType] = useState("");//filter
  // Handle change event for school selection
  const handleSchoolChange = (e) => {
    // console.log(selectedSchoolId,'selectedSchoolId')
    setSelectedSchoolId(e.target.value);
  };
  // Handle change event for sessiontype selection
  const handleSessionTypeChange = (e) => {
    // console.log(selectedSessionType,'selectedSessionType')
    setSelectedSessionType(e.target.value);
  };

  if (isSessionsSuccess && isSectionsSuccess && isStudentsSuccess) {
    // Set initial lists to state to be used for other components and the edit student component
    // We are using entity adapter in this query
    filteredSessionsList = sessionsList;
    filteredSectionsList = studentSections;
    filteredStudentsList = studentsList;
  
    if (selectedSchoolId !== "" || selectedSessionType) {
      // Filter sessions by selectedSchoolId and selectedSessionType if provided
      filteredSessionsList = sessionsList.filter((session) => {
        const schoolMatch = selectedSchoolId ? session.school?._id === selectedSchoolId : true;
        const typeMatch = selectedSessionType
          ? ["Drop", "Collect", "Nursery", "School"].includes(session.sessionType) &&
            session.sessionType === selectedSessionType
          : true;
        return schoolMatch && typeMatch;
      });
  
      // Filter sections to only include students corresponding to the filtered sessions
      filteredSectionsList = studentSections.map((section) => {
        // Filter students within the current section
        const filteredStudents = section.students.filter((student) =>
          filteredSessionsList.some((session) => session.student?._id === student._id)
        );
  
        // Return a new section object with the filtered students
        return {
          ...section,
          students: filteredStudents,
        };
      });
  
      // Filter students to only keep those that appear in the filtered sections
      filteredStudentsList = studentsList.filter((student) =>
        filteredSectionsList.some((section) =>
          section.students.some((sectionStudent) => sectionStudent._id === student.id)
        )
      );
    }
  
    // Debugging logs
    console.log(filteredSessionsList, "filteredSessionsList");
    console.log(filteredSectionsList, "filteredSectionsList");
    console.log(filteredStudentsList, "filteredStudentsList");
  }
  
  // if (isSessionsSuccess && isSectionsSuccess && isStudentsSuccess) {
  //   //set to the state to be used for other component s and edit student component
  //   //we are using entity adapter in this query
  //   filteredSessionsList = sessionsList;
  //   filteredSectionsList = studentSections;
  //   filteredStudentsList = studentsList;

  //   if (selectedSchoolId !== "") {
  //     // Example filter function
  //     console.log(sessionsList, "sessionsList");
  //     console.log(selectedSchoolId, "selectedSchoolId");
  //     filteredSessionsList =
  //       selectedSchoolId !== ""
  //         ? sessionsList.filter(
  //             (session) => session.school?._id === selectedSchoolId
  //           )
  //         : sessionsList;
  //     // filter the sections to only keep those who have the studetns names that correspond to the filtered sessions
  //     filteredSectionsList = studentSections.map((section) => {
  //       // Filter students within the current section
  //       const filteredStudents = section.students.filter((student) => {
  //         // Check if this student's name matches any student's name in filteredSessionsList
  //         return filteredSessionsList.some((session) => {
  //           return session.student?._id === student._id;
  //         });
  //       });

  //       // Return a new section object with the filtered students
  //       return {
  //         ...section,
  //         students: filteredStudents,
  //       };
  //     });

  //     console.log(filteredSectionsList, "filteredSectionsList");

  //     // filter studtns to only keepp those who have theri  nbaems in the sections
  //     filteredStudentsList = studentsList.filter((student) => {
  //       return filteredSectionsList.some((section) =>
  //         section.students.some(
  //           (sectionStudent) => sectionStudent._id === student.id
  //         )
  //       );
  //     });

  //     console.log(filteredStudentsList, "filteredStudentsList");
  //   }
  // }

  // Initial filter setup for filteredSessionsList
  // Ref to store the previous sessions list for comparison

  //console.log(sessionsList, "sessionsList");
  //console.log(studentsList, "studentsList");
  //console.log(studentsList[0], "studentsList[0]");
  console.log(studentSections, "studentSections");
  //console.log(schoolsList, "schoolsList");
  console.log(filteredSessionsList, "filteredSessionsList");
  const fields = {
    //the current case is working with old db
    id: { name: "id" }, // Mapping your custom `id` field to `Id`
    //subject: { name: "Subject", validation: { required: true } }, // Mapping your `title` field to `Subject`
    //subject: { name: "Subject" }, // Mapping your `title` field to `Subject`
    //startTime: { name: "startTime" }, // Mapping your `startTime` field to `StartTime`
    //endTime: { name: "endTime" }, // Mapping your `endTime` field to `EndTime`
    //location: { name: "location" },
    //title: { name: "title" },
    //description: { name: "description" }, //regex:["^[A-z 0-9]{3,150}$", 'No special Character allowed in this field'] },
    //recurrenceRule: { name: "recurrenceRule" },
    //recurrenceException: { name: "recurrenceException" },
    //RecurrenceID: { name: "RecurrenceID" }, //capital works
    //FollowingID: { name: "FollowingID" }, //capital works
    //isAllDay: { name: "isAllDay" },
    //isReadOnly: { name: "isReadOnly" },
    //isBlock: { name: "isBlock" },////// if Is and not is all is not blocked
    sessionYear: { name: "sessionYear" },
    animator: { name: "animator" },
    school: {
      name: "school",
      idField: "_id",
      //validation: { required: true }
    },

    student: {
      name: "student",
      idField: "_id",
      //validation: { required: true },
    },
    sessionSectionId: { name: "sessionSectionId" },
    sessionStudentId: { name: "sessionStudentId" },
    site: { name: "site" },
    classroom: { name: "classroom", idField: "_id" },
    //createdAt: { name: "createdAt" },
    creator: { name: "creator" },
    schoolColor: { name: "schoolColor" },
  };
  // const fields = {
  //   //the current case is working with old db
  //   id: { name: "id" }, // Mapping your custom `id` field to `Id`
  //   //subject: { name: "subject" }, // Mapping your `title` field to `Subject`
  //   //startTime: { name: "startTime" }, // Mapping your `startTime` field to `StartTime`
  //   //endTime: { name: "endTime" }, // Mapping your `endTime` field to `EndTime`
  //   //location: { name: "location" },
  //   //title: { name: "title" },
  //   //description: { name: "description" },
  //   //recurrenceRule: { name: "recurrenceRule" },
  //   //recurrenceException: { name: "recurrenceException" },
  //   //RecurrenceID: { name: "RecurrenceID" }, //capital works
  //   //FollowingID: { name: "FollowingID" }, //capital works
  //   //isAllDay: { name: "isAllDay" },
  //   //isReadOnly: { name: "isReadOnly" },
  //   //isBlock: { name: "isBlock" },////// if Is and not is all is not blocked
  //   sessionYear: { name: "sessionYear" },
  //   animator: { name: "animator" },
  //   school: { name: "school", idField: "_id" },

  //   student: { name: "student", idField: "_id" },
  //   sessionSectionId: { name: "sessionSectionId" },
  //   sessionStudentId: { name: "sessionStudentId" },
  //   site: { name: "site" },
  //   classroom: { name: "classroom", idField: "_id" },
  //   //createdAt: { name: "createdAt" },
  //   creator: { name: "creator" },
  //   schoolColor: { name: "schoolColor" },
  // };

  // const data = extend([], sessionsList, null, true);
  // const eventSettings = { dataSource: data, fields: fields };

  // Update data and eventSettings whenever filteredSessionsList changes
  const data = extend([], filteredSessionsList, null, true); // Create extended data
  const eventSettings = { dataSource: data, fields: fields }; // Define eventSettings

  // console.log(data,'data')
  const workDays = [0, 1, 2, 3, 4, 5];
  const scheduleObj = useRef(null); // Create a ref for the ScheduleComponent,
  // scheduleObj.current will store the actual instance, allowing you to call Scheduler methods like openEditor

  // const openNewSessionEditor = () => {
  //   if (scheduleObj.current) {
  //     scheduleObj.current.openEditor({}, "Add"); // Opens the editor in "Add" mode
  //   }
  // };

  let eventStartTime;
  let parentId;
  let eventType; // to help identify part of serie or not
  //let occurenceAction; // to helpp identify action and if occurence or not (standalone or whole series)
  //to always render on the active date
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Function to update selected date
  const handleAction = (args) => {
    setSelectedDate(args.data?.startTime || new Date());
  };

  const onPopupOpen = (args) => {
    //prevent opening the quickinfo on a new cell, we need double click to open the full editor
    if (args.type === "QuickInfo" && !args.data.Subject) {
      args.cancel = true;
    }
    //to help identify recurrent eventr s later

    if (!args.data.RecurrenceID) {
      eventType = "notRecurrent";
    } else {
      eventType = "recurrent";
    }

    //setParentId(scheduleObj.activeEventData.event.id)// not working
    console.log(eventType, "  eventType popupopen");
    //console.log(scheduleObj, "scheduleobj  popup open");
    console.log(scheduleObj.current, "scheduleobj cureent popup open");
    console.log(args, "  argsgggsss popupopen");
    //capture the parent id to be used later   for updates, deletions...
    console.log("parentId captured:", parentId);
    //capture the start date of the event to be used in teh exception
    parentId = args.data?.id; // we selected an event an d not an empty
    eventStartTime = args.data.StartTime;

    if (args.type === "Editor") {
      const formElement = args.element.querySelector(".e-schedule-form");

      // Remove existing custom field rows to avoid duplication
      const existingCustomRow = formElement.querySelector(".custom-field-row");
      if (existingCustomRow) {
        existingCustomRow.remove();
      }

      // Remove the default title and location row
      const titleLocationRow = formElement.querySelector(
        ".e-title-location-row"
      );
      if (titleLocationRow) {
        titleLocationRow.remove();
      }

      // Create a new custom row for "Subject" and "Location"
      let customRow = formElement.querySelector(".custom-field-row");
      if (!customRow) {
        customRow = createElement("div", { className: "custom-field-row" });
        formElement.insertBefore(customRow, formElement.firstElementChild);
      }

      const createDropdownField = (
        name,
        placeholder,
        dataSource,
        textField,
        valueField
      ) => {
        const container = createElement("div", {
          className: "custom-field-container",
        });
        const inputEle = createElement("input", {
          className: "e-field",
          attrs: { name },
        });
        container.appendChild(inputEle);
        customRow.appendChild(container);

        const dropDownList = new DropDownList({
          dataSource,
          fields: { text: textField, value: valueField },
          value:
            name === "school" ? args.data.school?._id : args.data[name] || null,
          floatLabelType: "Always",
          placeholder,
          change: (event) => {
            if (name === "sessionType") {
              updateDropdownsBasedOnSessionType(event.value);
            }
          },
        });
        dropDownList.appendTo(inputEle);
        inputEle.setAttribute("name", name);
      };

      const clearDropdown = (name) => {
        const existingField = customRow.querySelector(`input[name="${name}"]`);
        if (existingField) {
          existingField.parentNode.remove();
        }
      };

      const updateDropdownsBasedOnSessionType = (sessionType) => {
        clearDropdown("school");
        clearDropdown("Subject");

        if (sessionType === "Nursery") {
          // For Nursery, show only "FirstSteps" as the school option
          createDropdownField(
            "school",
            "School Name",
            [{ schoolName: "First Steps", id: "6714e7abe2df335eecd87750" }],
            "schoolName",
            "id"
          );
          createDropdownField(
            "Subject",
            "Subject",
            NURSERY_SUBJECTS,
            "label",
            "value"
          );
        } else {
          // For other session types, fetch the attended school from student's data
          const student = studentsList.find(
            (stud) => stud.id === args.data.sessionStudentId
          );
          let schoolOptions = [];

          if (student && selectedAcademicYear.title) {
            const educationRecord = student.studentEducation.find(
              (edu) => edu.schoolYear === selectedAcademicYear.title
            );

            if (educationRecord) {
              const attendedSchoolId = educationRecord.attendedSchool;
              const attendedSchool = schoolsList.find(
                (school) => school.id === attendedSchoolId
              );

              if (attendedSchool) {
                schoolOptions = [
                  {
                    schoolName: attendedSchool.schoolName,
                    id: attendedSchool.id,
                  },
                ];
                args.data.school = attendedSchool.id;
              }
            }
          }

          createDropdownField(
            "school",
            "School Name",
            schoolOptions,
            "schoolName",
            "id"
          );
          // heere we set condition for DRop and Collect

          if (sessionType === "School") {
            createDropdownField(
              "Subject",
              "Subject",
              SCHOOL_SUBJECTS,
              "label",
              "value"
            );
          }
          if (sessionType === "Drop") {
            createDropdownField(
              "Subject",
              "Subject",
              ["Drop"],
              "label",
              "value"
            );
          }
          if (sessionType === "Collect") {
            createDropdownField(
              "Subject",
              "Subject",
              ["Collect"],
              "label",
              "value"
            );
          }
        }
      };

      // Create the Session Type dropdown
      createDropdownField(
        "sessionType",
        "Session Type",
        ["School", "Nursery", "Drop", "Collect"],
        "label",
        "value"
      );

      // Initialize other dropdowns based on the current session type
      if (args.data.sessionType) {
        updateDropdownsBasedOnSessionType(args.data.sessionType);
      }
    }
  };

  const handleCreateSession = async (sessObj) => {
    await addNewSession(sessObj);
    if (isAddSessionError) {
      alert("error saving session");
    }
  };

  //Convert a Date object to RecurrenceException format (yyyymmddThhmmssZ).
  function formatToRecurrenceException(date) {
    const pad = (num) => String(num).padStart(2, "0");

    // Extract date components in UTC
    const year = date.getUTCFullYear();
    const month = pad(date.getUTCMonth() + 1); // Months are 0-indexed
    const day = pad(date.getUTCDate());
    const hours = pad(date.getUTCHours());
    const minutes = pad(date.getUTCMinutes());
    const seconds = pad(date.getUTCSeconds());

    // Concatenate components to match the RecurrenceException format
    return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
  }

  const handleDeleteSession = async (id, extraException, operationType) => {
    await deleteSession(id, extraException, operationType);
    if (isDeleteSessionError) {
      alert("error deleting session");
    }
  };
  const handleUpdateSession = async (obj) => {
    await updateSession(obj);
    if (isDeleteSessionError) {
      alert("error updating session");
    }
  };

  const onPopupClose = (args) => {
    //we can check here the choice we made on the popup and decide of the action
    console.log(
      "Current Action is':",
      scheduleObj.current.currentAction,
      "'on close"
    );
    // console.log(scheduleObj.current, "scheduleobj cureent onPopupClose ");
    // console.log(args, "  argsgggsss onPopupClose ");

    //capture the cancel action/////////////////
    // if (args.type === 'Editor' && args.cancel) {
    //   console.log('Event Edit Canceled');
    // }

    if (args.type === "Editor") {
      console.log("args popupclose", args);
      // setSessionObject({
      //   sessionYear: selectedAcademicYear?.title,
      //   animator: args.data?.animator,//for school sessionType we have no animator
      //   classroom: args.data?.classroom,//for school sessionType we have no classroom
      //   Description: args.data?.Description,
      //   Subject: args.data?.Subject,
      //   EndTime: args.data?.EndTime,
      //   StartTime: args.data?.StartTime,
      //   IsAllDay: args.data?.IsAllDay,
      //   IsBlock: args.data?.IsBlock,
      //   RecurrenceRule: args.data?.RecurrenceRule,
      //   RecurrenceException: args.data?.RecurrenceException,
      //   student: args.data?.sessionStudentId[0],
      //   RecurrenceID: args.data?.RecurrenceID, //might be used for sessins update...
      //   FollowingID: args.data?.FollowingID,
      //   school: args.data?.school,
      //   IsReadOnly: args.data?.IsReadOnly,
      //   sessionType: args.data?.sessionType,
      //   operator: userId,
      // });
    }
  };

  const onActionBegin = (args) => {
    //console.log(scheduleObj, "scheduleobj  onActionBegin ");

    console.log(args, "  argsgggsss onActionBegin ");
    // occurenceAction = scheduleObj.current.currentAction; // for show a difference between single (occurence) or series (whole series or standealone seession)
    //capture save, update, delete//////////////////////
    switch (args.requestType) {
      case "eventCreate":
        console.log("Event Save");
        //if (args.addedRecords.length > 0 && args.addedRecords[0] !== "") {
        if (
          scheduleObj.current.currentAction === "Add" &&
          args.addedRecords[0] !== ""
        ) {
          console.log("creating teh object");
          const {
            //animator,
            Description,
            Subject,
            EndTime,
            StartTime,
            IsAllDay,
            IsBlock,
            RecurrenceRule,
            RecurrenceException,
            sessionStudentId,
            student,
            // RecurrenceID,
            FollowingID,
            school,
            classroom,
            IsReadOnly,
            sessionType,
          } = args.addedRecords[0];
          //////////////////////////////////////we should check required data here and validate the varivables
          // console.log(
          //   animator,
          //   "animator",
          //   Description,
          //   "Description",
          //   Subject,
          //   "Subject",
          //   EndTime,
          //   "EndTime",
          //   StartTime,
          //   "StartTime",
          //   IsAllDay,
          //   "IsAllDay",
          //   IsBlock,
          //   "IsBlock",
          //   RecurrenceRule,
          //   "RecurrenceRule",
          //   RecurrenceException,
          //   "RecurrenceException",
          //   sessionStudentId,
          //   "student",
          //   student,
          //   "student",
          //   RecurrenceID,
          //   "RecurrenceID",
          //   FollowingID,
          //   "FollowingID",
          //   school,
          //   "school",
          //   classroom,
          //   "classroom",
          //   IsReadOnly,
          //   "IsReadOnly",
          //   sessionType,
          //   "sessionType"
          // );

          // if (
          //   (school === "6714e7abe2df335eecd87750" && !animator) ||
          //   (school === "6714e7abe2df335eecd87750" && !classroom)
          // ) {
          //   alert(" required fields are missing");
          // }

          const jjj = handleCreateSession({
            // we create without animator and eithout classroom, those will be retreived form sections on query
            sessionType: sessionType || "",
            sessionYear: selectedAcademicYear?.title,
            school: school || "",
            Subject: Subject || "",
            //classroom: classroom,
            //animator: animator,
            Description: Description || "",
            EndTime: EndTime || "",
            StartTime: StartTime || "",
            RecurrenceRule: RecurrenceRule || "",
            student: sessionStudentId || "",
            // RecurrenceID: null, /////////for a recurrent event set recurrence id to teh id itself??
            RecurrenceException: "",
            FollowingID: "",
            IsAllDay: IsAllDay || false,
            IsBlock: IsBlock || false,
            IsReadOnly: IsReadOnly || false,
            operator: userId || "",
          });
        }
        break;

      case "eventRemove":
        console.warn("Event Delete");
        ///check  what type of deletion is performed: event , follwoing, entire
        // console.log(args.data, "args in action begin delete");
        //console.log(Object.keys(args.data[0]).length, "length of [0]");
        // if sigle event deletion: only add an exception to the parent
        // Capture and differentiate single or series deletion
        if (eventType === "notRecurrent") {
          console.log("Single instance not a series deletion detected"); //working fine, no need for mock
          args.cancel = true;
          handleDeleteSession({
            id: parentId,
            operationType: "deleteSession",
          });
          // Simulate `actionComplete` by manually triggering callback logic
          //mockActionComplete("eventRemove", args.data[0]);
          parentId = "";
          eventType = "";
        }
        if (
          Object.keys(args.data[0]).length === 2 &&
          eventType === "recurrent"
        ) {
          console.log("Single instance in a series deletion detected"); //working without error no mock

          // Prevent Syncfusion's default deletion
          //args.cancel = true;
          //this what we remarked when we delte one event only
          args.cancel = true;
          const extraException = formatToRecurrenceException(eventStartTime);

          console.log(extraException, "extraException");
          //setChildRecurrenceID(parentId) no need because we are not updating the child but deleting it
          // Access RecurrenceException data for parent record

          handleDeleteSession({
            id: parentId,
            extraException: extraException,
            operationType: "deleteOccurence",
          });
          // Simulate `actionComplete` by manually triggering callback logic
          //mockActionComplete("eventRemove", args.data[0]);
          parentId = "";
          eventType = "";
        }
        ///if entire serie deletion: simply delete the parent event and !!also all its exceptions we recognise by recurrencID!!
        if (Object.keys(args.data[0]).length > 2 && eventType === "recurrent") {
          console.log("whole series deletion detected"); //working no error no mock
          args.cancel = true;
          handleDeleteSession({
            id: parentId,
            operationType: "deleteSeries",
          });
          parentId = "";
          eventType = "";
        }
        ///if single event deletion:// add and exception with the start date to the parent

        break;
      case "eventChange":
        //args.data....
        console.log("in Event change");

        if (eventType === "notRecurrent") {
          //single standealone session edit
          console.log("Single instance not a series update detected"); ///ok no errors
          //console.log(
          //args.changedRecords[0],
          //"args.changedRecords[0] on begin action in the update"
          //);
          // we need to check here if we changed anything or else we do not update ////////////////

          args.cancel = true;
          //if we save but the data was not changed, abord teh save

          // //add this : check if no changes were performed and abord

          // Access the updated sessionObject if needed
          handleUpdateSession({
            ...args.changedRecords[0],
            operationType: "editSession",
          });
          // handleUpdateSession(sessionObject);

          // Manually trigger callback logic
          //mockActionComplete("eventUpdate", args.data[0]);

          // Reset states
          parentId = "";
          eventType = "";
          //setSessionObject("");

          return; //this prevented the error but still have update whole series starting after this one
        }

        if (Object.keys(args.data)?.length === 2 && eventType === "recurrent") {
          console.log("Single instance in a series update detected"); ///no errors ok

          // Prevent Syncfusion's default deletion
          args.cancel = true;

          const extraException = formatToRecurrenceException(eventStartTime);

          console.log(extraException, "extraException");
          //setChildRecurrenceID(parentId) no need because we are not updating the child but deleting it
          // Access RecurrenceException data for parent record
          //if we save but the data was not changed, abord teh save

          if (args.changedRecords[0] === args.data.occurence) {
            return;
          } //to be checked later

          handleUpdateSession({
            ...args.changedRecords[0],
            operationType: "editOccurence",

            extraException: extraException,
            operator: userId,
            RecurrenceID: parentId,
          });
          // Simulate `actionComplete` by manually triggering callback logic
          //mockActionComplete("eventUpdate", args.changedRecords[0]);
          parentId = "";
          eventType = "";
          return;
        }

        ///if entire serie deletion: simply delete the parent event and !!also all its exceptions we recognise by recurrencID!!but how to differentiate between single and whole serie deletion or update
        if (Object.keys(args.data)?.length !== 2 && eventType === "recurrent") {
          console.log("whole series update detected");
          args.cancel = true;
          handleUpdateSession({
            ...args.changedRecords[0],
            operationType: "editSeries", //this will not update the occurences that were already edited and have and exception rule
          });
          parentId = "";
          eventType = "";
          return;
        }

        break;
    }
  };

  // const actionComplete = (args) => {
  //   console.log(scheduleObj, "scheduleobj  onacion complete ");
  //   console.log(scheduleObj.current, "scheduleobj cureent onacion complete ");
  //   console.log(args, "  argsgggsss oonacion complete ");
  //   //capture save, update, delete//////////////////////
  //   if (args.requestType === "eventCreated") {
  //     console.log("Event Saved");
  //   } else if (args.requestType === "eventChanged") {
  //     console.log("Event Updated");
  //   } else if (args.requestType === "eventRemoved") {
  //     console.log("Event Deleted");
  //   }
  // };
  let processedEvents = []; // removed usestate because it causes rendering snowball
  //maybe we need to filter and set a state on events settings andon data///////////////////////////////////////////
  // State to manage processed events separately from scheduleObj
  //const [processedEvents, setProcessedEvents] = useState([]);
  //this module will replace the animator attribute with the animator fromt eh assignemtn for dropp and collect
  useEffect(() => {
    const updatedEvents = scheduleObj.current?.eventsProcessed.map((event) => {
      // Check if sessionType is "Drop" or "Collect"
      if (event.sessionType === "Drop" || event.sessionType === "Collect") {
        const attendedSchoolId = event.attendedSchool?._id;
  
        // Ensure attendedSchoolId exists and startTime is defined
        if (attendedSchoolId && event.startTime) {
          // Filter animatorsAssignments based on the assigned date range
          const relevantAssignments = animatorsAssignments.filter((assignmentObj) => {
            const assignedFrom = new Date(assignmentObj.assignedFrom);
            const assignedTo = new Date(assignmentObj.assignedTo);
            const eventStartTime = new Date(event.startTime);
  
            return eventStartTime >= assignedFrom && eventStartTime <= assignedTo;
          });
  
          // Now find the matching assignment for the attendedSchoolId within the filtered assignments
          const assignment = relevantAssignments
            .flatMap((assignObj) => assignObj.assignments)
            .find((assign) => assign.schools.includes(attendedSchoolId));
  
          // If an assignment is found, update the animator
          if (assignment) {
            return {
              ...event,
              animator: assignment.animator,
            };
          }
        }
      }
  
      // Return the original event if no updates are needed
      return event;
    });
  
    // Update processedEvents
    processedEvents = updatedEvents;
  }, [animatorsAssignments, scheduleObj.current?.eventsProcessed]);
  
 // Synchronize state with scheduleObj.current
useEffect(() => {
  if (processedEvents?.length > 0) {
    scheduleObj.current = {
      ...scheduleObj.current,
      eventsProcessed: processedEvents,
    };
  }
}, [processedEvents]);
  //before including the startingdate
  // useEffect(() => {
  //   const updatedEvents = scheduleObj.current?.eventsProcessed.map((event) => {
  //     // Check if sessionType is "Drop" or "Collect"
  //     if (event.sessionType === "Drop" || event.sessionType === "Collect") {
  //       const attendedSchoolId = event.attendedSchool?._id;

  //       // Ensure attendedSchoolId exists before proceeding
  //       if (attendedSchoolId) {
  //         // Find the matching assignment for the school
  //         const assignment = animatorsAssigments
  //           .flatMap((assignObj) => assignObj.assignments)
  //           .find((assign) => assign.schools.includes(attendedSchoolId));

  //         // If an assignment is found, update the animator
  //         if (assignment) {
  //           //console.log(assignment, "assignment");
  //           return {
  //             ...event,
  //             animator: assignment.animator,
  //           };
  //         }
  //       }
  //     }

  //     // Return the original event if no updates are needed
  //     return event;
  //   });
  //   //console.log(updatedEvents,'updatedEvents')
  //   // Update the state to trigger a re-render
  //   //setProcessedEvents(updatedEvents);
  //   processedEvents = updatedEvents;

  //   // Update `scheduleObj.current.eventsProcessed` after state update
  // }, [animatorsAssigments, scheduleObj.current?.eventsProcessed]);

  // // Use another effect to synchronize state with scheduleObj.current
  // useEffect(() => {
  //   if (processedEvents?.length > 0) {
  //     scheduleObj.current = {
  //       ...scheduleObj.current,
  //       eventsProcessed: processedEvents,
  //     };
  //   }
  // }, [processedEvents]);

  return (
    <>
      <Academics />
      <div className="flex space-x-2 items-center">
        Displayed Students: {filteredStudentsList?.length}
        <select
          value={selectedSchoolId}
          onChange={handleSchoolChange}
          className="text-sm h-8 border border-gray-300 rounded-md px-4"
        >
          <option value="">All Schools</option>
          {schoolsList?.map((school) => (
            // school.schoolName !== "First Steps" &&
            <option key={school.id} value={school.id}>
              {school.schoolName}
            </option>
          ))}
        </select>
        <select
          value={selectedSessionType}
          onChange={handleSessionTypeChange}
          className="text-sm h-8 border border-gray-300 rounded-md px-4"
        >
         <option value="">All Types</option>
        <option value="Drop">Drop</option>
        <option value="Collect">Collect</option>
        <option value="Nursery">Nursery</option>
        <option value="School">School</option>
        </select>
      </div>
      <TimelineResourceGrouping className="timeline-resource-grouping e-schedule">
        <div className="schedule-control-section">
          <div className="col-lg-12 control-section">
            <div className="control-wrapper">
              {/* <div>
                <button
                  onClick={openNewSessionEditor}
                  className="btn btn-primary"
                >
                  Add New Session
                </button>
              </div> */}
              <ScheduleComponent
                //ref={scheduleObj} //to access and update teh scheduler by applying the query filter based on selectedschools
                ref={(scheduler) => (scheduleObj.current = scheduler)}
                cssClass="timeline-resource-grouping"
                width="100%"
                //height="650px"
                // selectedDate={new Date(2024, 10, 1)}
                selectedDate={selectedDate}
                actionComplete={handleAction} // Capture modification events to be used in selected date to always render on the last date we used
                // selectedDate={new Date()}
                timeScale={{ enable: true, interval: 60, slotCount: 2 }}
                currentView="TimelineDay"
                workDays={workDays}
                startHour="07:00"
                endHour="18:00"
                // eventSettings={{
                //   dataSource: data,
                //   //editFollowingEvents: true,
                //   fields: fields,
                // }}
                eventSettings={eventSettings}
                rowAutoHeight={true}
                group={{ resources: ["Sections", "Students"] }}
                popupOpen={onPopupOpen}
                actionBegin={onActionBegin}
                // eventRendered={onEventRendered}
                popupClose={onPopupClose}
              >
                <ResourcesDirective>
                  <ResourceDirective
                    field="sessionSectionId" //the id of the section in the session data
                    title="Choose Section" //this is what will apppear in new or edit window
                    name="Sections" //name of the group
                    allowMultiple={false}
                    dataSource={filteredSectionsList}
                    //dataSource={studentSections}
                    textField="sectionLabel"
                    idField="id"
                    // colorField="color"
                  />
                  <ResourceDirective
                    field="sessionStudentId"
                    title=" Choose Student" // //this is what will apppear in new or edit window
                    name="Students"
                    allowMultiple={true}
                    dataSource={filteredStudentsList}
                    // dataSource={studentsList}
                    textField="studentName" // will be replaced by the StudentNameTemplate
                    idField="id"
                    groupIDField="studentSectionId"
                    colorField="studentColor"
                  />
                </ResourcesDirective>
                <ViewsDirective>
                  <ViewDirective option="TimelineDay" />

                  <ViewDirective option="Agenda" />
                </ViewsDirective>
                <Inject
                  services={[
                    TimelineViews,
                    TimelineMonth,
                    //Week,
                    Agenda,
                    Resize,
                    DragAndDrop,
                  ]}
                />
              </ScheduleComponent>
            </div>
          </div>
        </div>
      </TimelineResourceGrouping>
    </>
  );
};
export default SectionsPlannings;
