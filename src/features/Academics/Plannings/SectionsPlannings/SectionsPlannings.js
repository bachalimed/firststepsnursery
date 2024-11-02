import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import useAuth from "../../../../hooks/useAuth";
import {
  TimelineViews,
  TimelineMonth,
  Agenda,
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
  useDeleteSessionWithBodyMutation
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

import Plannings from "../../Plannings";
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
    isLoading: isSectionsLoading, //monitor several situations is loading...
    isSuccess: isSectionsSuccess,
    isError: isSectionsError,
    error: sectionsError,
  } = useGetSectionsByYearQuery(
    {
      selectedYear: selectedAcademicYear?.title,
      endpointName: "SectionsListInPlanning",
    } || {},
    {
      //pollingInterval: 60000,//will refetch data every 60seconds
      refetchOnFocus: true, //when we focus on another window then come back to the window ti will refetch data
      refetchOnMountOrArgChange: true, //refetch when we remount the component
    }
  );

  const {
    data: students, //the data is renamed sessions
    isLoading: isStudentsLoading, //monitor several situations is loading...
    isSuccess: isStudentsSuccess,
    isError: isStudentsError,
    error: studentsError,
  } = useGetStudentsByYearQuery(
    {
      selectedYear: selectedAcademicYear?.title,
      criteria: "withSections",

      endpointName: "studentsList",
    } || {},
    {
      //pollingInterval: 60000,//will refetch data every 60seconds
      refetchOnFocus: true, //when we focus on another window then come back to the window ti will refetch data
      refetchOnMountOrArgChange: true, //refetch when we remount the component
    }
  );

  const {
    data: sessions, //the data is renamed sessions
    isLoading: isSessionsLoading, //monitor several situations is loading...
    isSuccess: isSessionsSuccess,
    isError: isSessionsError,
    error: sessionsError,
  } = useGetSessionsByYearQuery(
    {
      selectedYear: selectedAcademicYear?.title,
      criteria: "schools",
      endpointName: "sessionsList",
    } || {},
    {
      //pollingInterval: 60000, //will refetch data every 60seconds
      refetchOnFocus: true, //when we focus on another window then come back to the window ti will refetch data
      refetchOnMountOrArgChange: true, //refetch when we remount the component
    }
  );

  const {
    data: employees, //the data is renamed sessions
    isLoading: isEmployeesLoading, //monitor several situations is loading...
    isSuccess: isEmployeesSuccess,
    isError: isEmployeesError,
    error: employeesError,
  } = useGetEmployeesByYearQuery(
    {
      selectedYear: selectedAcademicYear?.title,
      criteria: "Animator",

      endpointName: "employeesList",
    } || {},
    {
      //pollingInterval: 60000,//will refetch data every 60seconds
      //refetchOnFocus: true, //when we focus on another window then come back to the window ti will refetch data
      // refetchOnMountOrArgChange: true, //refetch when we remount the component
    }
  );

  const {
    data: classrooms, //the data is renamed sessions
    isLoading: isClassroomsLoading, //monitor several situations is loading...
    isSuccess: isClassroomsSuccess,
    isError: isClassroomsError,
    error: classroomsError,
  } = useGetClassroomsQuery(
    {
      endpointName: "ClassroomsList",
    } || {},
    {
      //pollingInterval: 60000,//will refetch data every 60seconds
      //refetchOnFocus: true, //when we focus on another window then come back to the window ti will refetch data
      // refetchOnMountOrArgChange: true, //refetch when we remount the component
    }
  );
  const {
    data: schools, //the data is renamed sessions
    isLoading: isSchoolsLoading, //monitor several situations is loading...
    isSuccess: isSchoolsSuccess,
    isError: isSchoolsError,
    error: schoolsError,
  } = useGetAttendedSchoolsQuery(
    {
      endpointName: "AttendedSchoolsList",
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
  if (isSectionsSuccess && !isSectionsLoading) {
    const { entities } = sections;
    studentSections = Object.values(entities);
  }
  if (isStudentsSuccess && !isStudentsLoading) {
    const { entities } = students;
    studentsList = Object.values(entities);
  }

  if (isSessionsSuccess) {
    //set to the state to be used for other component s and edit student component
    const { entities } = sessions;
    sessionsList = Object.values(entities); //we are using entity adapter in this query

    //console.log(sessionsList, "sessionsList");
  }
  //console.log(studentsList, "studentsList");
  // console.log(studentSections, "studentSections");
  if (isEmployeesSuccess && !isEmployeesLoading) {
    const { entities } = employees;
    employeesList = Object.values(entities);
  }
  if (isClassroomsSuccess && !isClassroomsLoading) {
    const { entities } = classrooms;
    classroomsList = Object.values(entities);
  }
  if (isSchoolsSuccess && !isSchoolsLoading) {
    const { entities } = schools;
    schoolsList = Object.values(entities);
  }
  //console.log(schoolsList, "schoolsList");
  const fields = {
    //the current case is working with old db
    id: { name: "id" }, // Mapping your custom `id` field to `Id`
    subject: { name: "Subject", validation: { required: true } }, // Mapping your `title` field to `Subject`
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
    school: { name: "school", idField: "_id", validation: { required: true } },

    student: {
      name: "student",
      idField: "_id",
      validation: { required: true },
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

  const data = extend([], sessionsList, null, true);
  const workDays = [0, 1, 2, 3, 4, 5];
  const scheduleObj = useRef(null); // Create a ref for the ScheduleComponent,
  // scheduleObj.current will store the actual instance, allowing you to call Scheduler methods like openEditor

  const [parentId, setParentId] = useState(null); //this will be used to update the parent for any recurrence change, maybe we can find directly the session parent and update
  const [parentRecurrenceException, setParentRecurrenceException] =
    useState(null);
  const [followingID, setFollowingID] = useState("");
  const [childRecurrenceID, setChildRecurrenceID] = useState("");
  const [sessionObject, setSessionObject] = useState({
    operationType: "",
    sessionYear: selectedAcademicYear?.title,
    animator: "",
    Description: "",
    Subject: "",
    EndTime: "",
    StartTime: "",
    IsAllDay: false,
    IsBlock: false,
    RecurrenceRule: "",
    RecurrenceException: "",
    student: "",
    RecurrenceID: "", //might be used for sessins update...
    FollowingID: "",
    school: "",
    IsReadOnly: false,
    sessionType: "",
    operator: userId,
  }); //this will be the object to save,

  const [eventType, setEventType] = useState("");
  let eventStartTime;

  const onPopupOpen = (args) => {
    //prevent opening the quickinfo on a new cell, we need double click to open the full editor
    if (args.type === "QuickInfo" && !args.data.Subject) {
      args.cancel = true;
    }
    if (!args.data.RecurrenceID) {
      setEventType("notRecurrent");
    } else {
      setEventType("recurrent");
    }
    args.data.id ? setParentId(args.data.id) : setParentId(""); // we selected an event an d not an empty
    //setParentId(scheduleObj.activeEventData.event.id)// not working
    console.log("parentId captured:", parentId);
    console.log(eventType, "  eventType popupopen");
    console.log(scheduleObj, "scheduleobj  popup open");
    console.log(scheduleObj.current, "scheduleobj cureent popup open");
    console.log(args, "  argsgggsss popupopen");
    //capture the parent id to be used later   for updates, deletions...
    //capture the start date of the event to be used in teh exception
    eventStartTime = args.data.StartTime;

    if (args.type === "Editor") {
      //console.log(scheduleObj.current, "scheduleobj current");
      //////args.data.sessionType = null;//will emppty session type to force user to fill again

      //console.log(scheduleObj.eventWindow.recurrenceEditor.frequencies, 'scheduleobj frequencies') recurrentce editor not working
      const formElement = args.element.querySelector(".e-schedule-form");

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

        // Initialize dropdown
        const dropDownList = new DropDownList({
          dataSource,
          fields: { text: textField, value: valueField },
          value: args.data[name],
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

      // Update dropdowns based on session type
      const updateDropdownsBasedOnSessionType = (sessionType) => {
        clearDropdown("school");
        clearDropdown("Subject");
        clearDropdown("classroom");
        clearDropdown("animator");

        switch (sessionType) {
          case "School":
            createDropdownField(
              "school",
              "School Name",
              schoolsList.filter(
                (school) => school.schoolName !== "FirstSteps"
              ),
              "schoolName",
              "id"
            );
            createDropdownField(
              "Subject", //"subject",
              "Subject",
              SCHOOL_SUBJECTS,
              "label",
              "value"
            );
            break;
          case "Nursery":
            createDropdownField(
              "school",
              "School Name",
              [{ schoolName: "First Steps", id: "6714e7abe2df335eecd87750" }],
              "schoolName",
              "id"
            );
            createDropdownField(
              "Subject", //"subject",
              "Subject",
              NURSERY_SUBJECTS,
              "label",
              "value"
            );
            createDropdownField(
              "classroom",
              "Classroom",
              classroomsList,
              "classroomLabel",
              "id"
            );
            createDropdownField(
              "animator",
              "Animator",
              employeesList,
              "userFullName",
              "employeeId"
            );
            break;
          case "Drop":
            createDropdownField(
              "school",
              "School",
              schoolsList.filter(
                (school) => school.id !== "6714e7abe2df335eecd87750"
              ),
              "schoolName",
              "id"
            );
            createDropdownField(
              "animator",
              "Animator",
              employeesList,
              "userFullName",
              "employeeId"
            );
            createDropdownField(
              "Subject", //"subject",
              "Subject",
              ["Drop"],
              "label",
              "value"
            );
            break;

          case "Collect":
            createDropdownField(
              "school",
              "School",
              schoolsList.filter(
                (school) => school.id !== "6714e7abe2df335eecd87750"
              ),
              "schoolName",
              "id"
            );
            createDropdownField(
              "animator",
              "Animator",
              employeesList,
              "userFullName",
              "employeeId"
            );
            createDropdownField(
              "Subject", //"subject",
              "Subject",
              ["Collect"],
              "label",
              "value"
            );
            break;
        }
      };

      // Clear previous dropdowns if they exist
      const clearDropdown = (name) => {
        const existingField = customRow.querySelector(`input[name="${name}"]`);
        if (existingField) {
          existingField.parentNode.remove();
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

      // // **Handle Recurrence-Specific Fields**// check the args.data and apply conditions...
      // if (args.data.RecurrenceRule && childRecurrenceID) {
      //   // chekc the recurence id of child is correct hehre
      //   const isException = Boolean(args.data.RecurrenceException);

      //   if (isException) {
      //     // Existing instance is part of a recurring event and an exception
      //     const recurrenceField = createElement("div", {
      //       innerHTML: "Editing an instance (exception) in the series",
      //       className: "recurrence-notification",
      //     });
      //     formElement.insertBefore(recurrenceField, formElement.firstChild);
      //   } else {
      //     // Show fields related to handling entire series or exceptions
      //     const recurrenceField = createElement("div", {
      //       innerHTML: "Editing a recurring event or series",
      //       className: "recurrence-notification",
      //     });
      //     formElement.insertBefore(recurrenceField, formElement.firstChild);
      //   }
      // }
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

  const handleDeleteSession = async (id,extraException,operationType ) => {
    await deleteSession(id,extraException,operationType);
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
    console.log(scheduleObj, "scheduleobj  onPopupClose ");
    // console.log(scheduleObj.current, "scheduleobj cureent onPopupClose ");
    console.log(args, "  argsgggsss onPopupClose ");

    //capture the cancel action/////////////////
    // if (args.type === 'Editor' && args.cancel) {
    //   console.log('Event Edit Canceled');
    // }

    if (args.type === "Editor") {
      console.log("args popupclose", args);
      setSessionObject({
        sessionYear: selectedAcademicYear?.title,
        animator: args.data.animator,
        Description: args.data.Description,
        Subject: args.data.Subject,
        EndTime: args.data.EndTime,
        StartTime: args.data.StartTime,
        IsAllDay: args.data.IsAllDay,
        IsBlock: args.data.IsBlock,
        RecurrenceRule: args.data.RecurrenceRule,
        RecurrenceException: args.data.RecurrenceException,
        student: args.data.sessionStudentId[0],
        RecurrenceID: args.data.RecurrenceID, //might be used for sessins update...
        FollowingID: args.data.FollowingID,
        school: args.data.school,
        IsReadOnly: args.data.IsReadOnly,
        sessionType: args.data.sessionType,
        operator: userId,
      });
    }
  };

  const onActionBegin = (args) => {
    console.log(scheduleObj, "scheduleobj  onActionBegin ");
    console.log(scheduleObj.current, "scheduleobj cureent onActionBegin ");
    console.log(args, "  argsgggsss onActionBegin ");

    //capture save, update, delete//////////////////////
    switch (args.requestType) {
      case "eventCreate":
        console.log("Event Save");
        if (args.addedRecords.length > 0 && args.addedRecords[0] !== "") {
          console.log("creating teh object");
          const {
            animator,
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
          if (
            (school === "6714e7abe2df335eecd87750" && !animator) ||
            (school === "6714e7abe2df335eecd87750" && !classroom)
          ) {
            alert(" required fields are missing");
          }

          const jjj = handleCreateSession({
            sessionType: sessionType || "",
            sessionYear: selectedAcademicYear?.title,
            school: school || "",
            Subject: Subject || "",
            classroom: classroom,
            animator: animator,
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
        console.log(args.data, "args in action begin delete");
        console.log(Object.keys(args.data[0]).length, "length of [0]");
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
          setParentId("");
          setEventType("");
        }
        if (Object.keys(args.data[0]).length ===2 && eventType === "recurrent") {
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
          setParentId("");
          setEventType("");
        }
        ///if entire serie deletion: simply delete the parent event and !!also all its exceptions we recognise by recurrencID!!
        if (Object.keys(args.data[0]).length >2 && eventType === "recurrent") {
          console.log("whole series deletion detected"); //working no error no mock
          args.cancel = true;
          handleDeleteSession({
            id: parentId,
            operationType: "deleteSeries",
          });
          setParentId("");
          setEventType("");
        }
        ///if single event deletion:// add and exception with the start date to the parent

        break;
      case "eventChange":
        //args.data....
        console.log("Event change");
        // if (
        //   args.changedRecords.length === 1 &&

        //   eventType === "notRecurrent"
        // ) {
        //   console.log("Single instance not a series update detected");
        //   console.log(args.changedRecords[0],"args.changedRecords[0] on begin action in th eupdate");
        //   setSessionObject(args.changedRecords[0])//does not update on time to get data from
        //   args.cancel = true;
        //   //console.log(sessionObject,'sessionobject in update single not inseries')
        //   handleUpdateSession(args.changedRecords[0]);
        //   // Simulate `actionComplete` by manually triggering callback logic
        //   mockActionComplete("eventUpdate", args.data[0]);
        //   setParentId("");
        //   setEventType("");
        //   setSessionObject("")
        // }
        if (eventType === "notRecurrent") {
          console.log("Single instance not a series update detected");
          console.log(
            args.changedRecords[0],
            "args.changedRecords[0] on begin action in the update"
          );

          // Set sessionObject with a timeout delay to ensure it updates before proceeding
          setSessionObject(args.changedRecords[0]);

          args.cancel = true;

          // Delay the next actions to allow state to update
          //setTimeout(() => {
          // Access the updated sessionObject if needed
          handleUpdateSession({
            ...args.changedRecords[0],
            operationType: "editSession",
          });
          // handleUpdateSession(sessionObject);

          // Manually trigger callback logic
          //mockActionComplete("eventUpdate", args.data[0]);

          // Reset states
          setParentId("");
          setEventType("");
          setSessionObject("");
          // }, 50); // 50ms delay, adjust as needed
          return; //this prevented the error but still have update whole series starting after this one
        }

        if (
          Object.keys(args.data[0]).length ===2 && eventType === "recurrent" ) {
          console.log("Single instance in a series update detected"); ///no errors ok

          // Prevent Syncfusion's default deletion
          args.cancel = true;
          //this what we remarked when we delte one event only

          const extraException = formatToRecurrenceException(eventStartTime);

          console.log(extraException, "extraException");
          //setChildRecurrenceID(parentId) no need because we are not updating the child but deleting it
          // Access RecurrenceException data for parent record

          handleUpdateSession({
            ...args.changedRecords[0],
            operationType: "editOccurence",

            extraException: extraException,
            operator: userId,
            RecurrenceID: parentId,
          });
          // Simulate `actionComplete` by manually triggering callback logic
          //mockActionComplete("eventUpdate", args.changedRecords[0]);
          setParentId("");
          setEventType("");
        }
        ///if entire serie deletion: simply delete the parent event and !!also all its exceptions we recognise by recurrencID!!but how to differentiate between single and whole serie deletion or update
        if (Object.keys(args.data[0]).length >2 && eventType === "recurrent") {
          console.log("whole series update detected");

          handleUpdateSession({
            id: parentId,
            operationType: "editSeries",
          });
          setParentId("");
        }

        break;
    }
  };

  // Mock actionComplete callback to simulate action completion
  const mockActionComplete = (requestType, data) => {
    console.log("Mock actionComplete triggered for:", requestType);

    if (requestType === "eventRemove") {
      console.log("Delete operation completed:", data);

      // Any additional logic to confirm deletion can go here
      alert("Event deleted successfully");
    }
    if (requestType === "eventChange") {
      console.log("Update operation completed:", data);

      // Any additional logic to confirm deletion can go here
      alert("Event updated successfully");
    }
  };

  const actionComplete = (args) => {
    console.log(scheduleObj, "scheduleobj  onacion complete ");
    console.log(scheduleObj.current, "scheduleobj cureent onacion complete ");
    console.log(args, "  argsgggsss oonacion complete ");
    //capture save, update, delete//////////////////////
    if (args.requestType === "eventCreated") {
      console.log("Event Saved");
    } else if (args.requestType === "eventChanged") {
      console.log("Event Updated");
    } else if (args.requestType === "eventRemoved") {
      console.log("Event Deleted");
    }
  };

  return (
    <>
      <Plannings />
      <TimelineResourceGrouping className="timeline-resource-grouping e-schedule">
        <div className="schedule-control-section">
          <div className="col-lg-12 control-section">
            <div className="control-wrapper">
              <ScheduleComponent
                ref={scheduleObj} //to access and update teh scheduler by applying the query filter based on selectedschools
                cssClass="timeline-resource-grouping"
                width="100%"
                //height="650px"
                selectedDate={new Date(2024, 10, 1)}
                timeScale={{ enable: true, interval: 60, slotCount: 4 }}
                currentView="TimelineDay"
                workDays={workDays}
                startHour="07:00"
                endHour="18:00"
                eventSettings={{
                  dataSource: data,
                  //editFollowingEvents: true,
                  fields: fields,
                }}
                rowAutoHeight={true}
                group={{ resources: ["Sections", "Students"] }}
                popupOpen={onPopupOpen}
                actionBegin={onActionBegin}
                actionComplete={actionComplete}
                // eventRendered={onEventRendered}
                popupClose={onPopupClose}
              >
                <ResourcesDirective>
                  <ResourceDirective
                    field="sessionSectionId" //the id of the section in the session data
                    title="Choose Section" //this is what will apppear in new or edit window
                    name="Sections" //name of the group
                    allowMultiple={false}
                    dataSource={studentSections}
                    textField="sectionLabel"
                    idField="id"
                    // colorField="color"
                  />
                  <ResourceDirective
                    field="sessionStudentId"
                    title=" Choose Student" // //this is what will apppear in new or edit window
                    name="Students"
                    allowMultiple={true}
                    dataSource={studentsList}
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
