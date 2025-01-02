import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
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
import { useGetAttendedSchoolsQuery } from "../../../AppSettings/AcademicsSet/attendedSchools/attendedSchoolsApiSlice";
import { useGetEmployeesByYearQuery } from "../../../HR/Employees/employeesApiSlice";
import {
  useGetSessionsByYearQuery,
  useUpdateSessionMutation,
  useAddNewSessionMutation,
  useDeleteSessionMutation,
} from "../../Plannings/Sessions/sessionsApiSlice";
import {
  useGetSectionsByYearQuery,
  useUpdateSectionMutation,
  useDeleteSectionMutation,
} from "../../Sections/sectionsApiSlice";
import { useGetStudentsByYearQuery } from "../../../Students/StudentsAndParents/Students/studentsApiSlice";
import { useGetClassroomsQuery } from "../../../AppSettings/AcademicsSet/Classrooms/classroomsApiSlice";
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
} from "../../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import {
  setAcademicYears,
  selectAllAcademicYears,
} from "../../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import { extend, createElement } from "@syncfusion/ej2-base";
import Academics from "../../Academics";
import styled from "styled-components";
import { CiInboxOut, CiInboxIn } from "react-icons/ci";
import { LuSchool } from "react-icons/lu";
import { HiOutlineHomeModern } from "react-icons/hi2";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { DropDownList } from "@syncfusion/ej2-dropdowns";
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

  const scheduleObj = useRef(null); // Create a ref for the ScheduleComponent
  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);

  const {
    data: sections, //the data is renamed sessions
    isLoading: isSectionsLoading, 
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
    data: attendedSchools, //the data is renamed attendedSchoolsData
    isLoading: isAttendedSchoolsLoading, 
    isSuccess: isAttendedSchoolsSuccess,
    isError: isAttendedSchoolsError,
    error: attendedSchoolsError,
  } = useGetAttendedSchoolsQuery("attendedSchoolsList") || {};
  const {
    data: classrooms, //the data is renamed attendedSchoolsData
    isLoading: isClassroomsLoading, 
    isSuccess: isClassroomsSuccess,
    isError: isClassroomsError,
    error: classroomsError,
  } = useGetClassroomsQuery("classroomsList") || {};
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
    isLoading: isSessionsLoading, 
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
      //pollingInterval: 60000,//will refetch data every 60seconds
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

      endpointName: "employeesList",
    } || {},
    {
      //pollingInterval: 60000,//will refetch data every 60seconds
      refetchOnFocus: true, //when we focus on another window then come back to the window ti will refetch data
      refetchOnMountOrArgChange: true, //refetch when we remount the component
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
  ] = useDeleteSessionMutation(); //it will not execute the mutation nownow but when called
  // Prepare sessions list and resource data
  let sessionsList = isSessionsSuccess ? Object.values(sessions.entities) : [];
  let attendedSchoolsList = isAttendedSchoolsSuccess
    ? Object.values(attendedSchools.entities)
    : [];
  let classroomsList = isClassroomsSuccess
    ? Object.values(classrooms.entities)
    : [];
  let employeesList = isEmployeesSuccess
    ? Object.values(employees.entities)
    : [];
  //let schoolsListData = isSchoolsSuccess ? Object.values(schools.entities) : [];
  let studentSections = isSectionsSuccess
    ? Object.values(sections.entities)
    : [];
  let studentsList = isStudentsSuccess ? Object.values(students.entities) : [];
  if (isAttendedSchoolsSuccess && !isAttendedSchoolsLoading) {
    const { entities } = attendedSchools;
    attendedSchoolsList = Object.values(entities);
  }
  if (isEmployeesSuccess && !isEmployeesLoading) {
    const { entities } = employees;
    employeesList = Object.values(entities);
  }
  if (isClassroomsSuccess && !isClassroomsLoading) {
    const { entities } = classrooms;
    classroomsList = Object.values(entities);
  }
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
  //console.log(studentSections, "studentSections");

  const fields = {
    id: { name: "id" }, // Mapping your custom `id` field to `Id`
    subject: { name: "subject" }, // Mapping your `title` field to `Subject`
    startTime: { name: "startTime" }, // Mapping your `startTime` field to `StartTime`
    endTime: { name: "endTime" }, // Mapping your `endTime` field to `EndTime`
    location: { name: "location" },
    title: { name: "title" },
    sessionYear: { name: "sessionYear" },
    animator: { name: "animator" },
    school: { name: "school", idField: "_id" },
    section: { name: "section", idField: "_id" },
    student: { name: "student", idField: "_id" },
    sessionSectionId: { name: "sessionSectionId" },
    sessionStudentId: { name: "sessionStudentId" },
    description: { name: "Description" },
    site: { name: "site" },
    followingID: { name: "followingID" },
    classroom: { name: "classroom", idField: "_id" },
    recurrenceRule: { name: "recurrenceRule" },
    sessionStatus: { name: "sessionStatus" },
    createdAt: { name: "createdAt" },
    creator: { name: "creator" },
    recurrenceException: { name: "recurrenceException" },
    recurrenceId: { name: "recurrenceId" },
    isAllDay: { name: "isAllDay" },
    IsBlock: { name: "isBlock" },
    isReadOnly: { name: "isReadOnly" },
    schoolColor: { name: "schoolColor" },
    // studentId: "student._id",
    // siteId: "site._id",
  };

  const data = extend([], sessionsList, null, true);
  const workDays = [0, 1, 2, 3, 4, 5];
  // Function to handle CRUD operations based on requestType
  const handleCrudOperation = async (args) => {
    const { requestType, data } = args;

    if (requestType === "eventCreate") {
      await addNewSession(data);
    } else if (requestType === "eventChange") {
      await updateSession(data);
    } else if (requestType === "eventRemove") {
      await deleteSession(data.id);
    }
  };
  const onPopupOpen = (args) => {
    if (args.type === "QuickInfo") {
      // Override to open in "Editor" mode for full editing experience
      args.cancel = true;
      scheduleObj.current?.openEditor(args.data, "Editor"); // Use scheduleObj.current
    } else if (args.type === "Editor") {
      let fields = args.element.querySelectorAll(".e-field");

      fields.forEach((field) => {
        let label;
        switch (field.name) {
          case "title":
            label = document.createElement("label");
            label.textContent = "Session Title";
            field.parentNode.insertBefore(label, field);
            createDropdown(field, ["School", "Nursery", "Collect", "Drop"]);
            break;

          case "animator":
            label = document.createElement("label");
            label.textContent = "Animator";
            field.parentNode.insertBefore(label, field);
            createDropdown(field, employeesList);
            break;

          case "school":
            label = document.createElement("label");
            label.textContent = "School";
            field.parentNode.insertBefore(label, field);
            createDropdown(field, attendedSchoolsList);
            break;

          case "classroom":
            label = document.createElement("label");
            label.textContent = "Classroom";
            field.parentNode.insertBefore(label, field);
            createDropdown(field, classroomsList);
            break;

          case "subject":
            label = document.createElement("label");
            label.textContent = "Subject";
            field.parentNode.insertBefore(label, field);
            createDropdown(field, [
              "Sport",
              "Sciences",
              "IT",
              "Arabe",
              "French",
              "English",
              "Religion",
              "History & Geography",
            ]);
            break;

          default:
            break;
        }
      });
    }
  };

  // Helper function to create dropdown elements
  function createDropdown(field, dataSource) {
    new DropDownList({
      dataSource: dataSource,
      fields: { text: "name", value: "id" },
      value: field.value,
    }).appendTo(field);
  }
  // Optional additional field handler
  function handleAdditionalFields(args) {
    const recurrenceField = args.element.querySelector(".e-recurrence-field");
    recurrenceField.value = args.data?.recurrenceRule || "";

    const locationField = args.element.querySelector(".e-location-field");
    locationField.value = args.data?.location || "";

    const colorField = args.element.querySelector(".e-color-field");
    colorField.value = args.data?.color || "#ff5657";
  }

  // onPopupClose to collect data and trigger handleCrudOperation
  const onPopupClose = async (args) => {
    if (args.type === "Editor") {
      // Collecting form data for session update
      const formData = {
        title: args.data.title,
        animator: args.data.animator,
        student: args.data.student,
        school: args.data.school,
        classroom: args.data.classroom,
        subject: args.data.subject,
        site: args.data.site,
        description: args.data.description,
        startTime: args.data.startTime,
        endTime: args.data.endTime,
        recurrenceRule: args.data.recurrenceRule,
        location: args.data.location,
        color: args.data.color,
        // Additional fields can be added here
      };

      // Use handleCrudOperation for saving or updating session data
      await handleCrudOperation({
        requestType: args.requestType, // either "eventCreate" or "eventChange"
        data: formData,
      });
    }
  };

  return (
    <>
      <Academics />
      <TimelineResourceGrouping className="timeline-resource-grouping e-schedule">
        <div className="schedule-control-section">
          <div className="col-lg-12 control-section">
            <div className="control-wrapper">
              <ScheduleComponent
               ref={scheduleObj} // Attach the ref to the ScheduleComponent
                cssClass="timeline-resource-grouping"
                width="100%"
                //height="650px"
                selectedDate={new Date(2024, 9, 14)}
                currentView="TimelineDay"
                workDays={workDays}
                eventSettings={{ dataSource: data, fields: fields }}
                allowDragAndDrop={false}
                allowResizing={false}
                group={{ resources: ["Sections", "Students"] }}
                popupOpen={onPopupOpen}
                popupClose={onPopupClose}
                actionComplete={handleCrudOperation}
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
                  <ViewDirective option="TimelineDay" isSelected={true} />

                  <ViewDirective option="Agenda" />
                </ViewsDirective>
                <Inject services={[TimelineViews, TimelineMonth, Agenda]} />
              </ScheduleComponent>
            </div>
          </div>
        </div>
      </TimelineResourceGrouping>
    </>
  );
};
export default SectionsPlannings;
