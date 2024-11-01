import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  ScheduleComponent,
  ViewsDirective,
  ViewDirective,
  ResourcesDirective,
  ResourceDirective,
  TimelineViews,
  Day,
  WorkWeek,
  Month,
  TimelineDay,
  PopupOpenEventArgs,
  Inject,
  Resize,
  DragAndDrop,
  Agenda,
} from "@syncfusion/ej2-react-schedule";
import { Query, Predicate } from "@syncfusion/ej2-data"; //Predicate and Query: Used to filter data displayed in the scheduler by constructing queries.
import { CheckBoxComponent } from "@syncfusion/ej2-react-buttons"; //CheckBoxComponent: Syncfusion's CheckBox UI component to filter the scheduler resources
import { useGetAttendedSchoolsQuery } from "../../../AppSettings/AcademicsSet/attendedSchools/attendedSchoolsApiSlice";
import { SidebarComponent } from "@syncfusion/ej2-react-navigations";
import { useGetStudentsByYearQuery } from "../../../Students/StudentsAndParents/Students/studentsApiSlice";
import { useGetEmployeesByYearQuery } from "../../../HR/Employees/employeesApiSlice";
import { extend } from "@syncfusion/ej2-base"; //extend: A utility from Syncfusion that helps in extending an array or object.
import { DateTimePickerComponent } from "@syncfusion/ej2-react-calendars";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
//import { PropertyPane } from '../common/property-pane';//PropertyPane: A wrapper component for UI controls.
import { DataArray } from "../../../../config/SampleSchedule";

import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { useGetUserByIdQuery } from "../../../Admin/UsersManagement/usersApiSlice";
import {
  useGetSectionsByYearQuery,
  useUpdateSectionMutation,
  useDeleteSectionMutation,
} from "../../Sections/sectionsApiSlice";
import {
  useGetSessionsByYearQuery,
  useUpdateSessionMutation,
  useDeleteSessionMutation,
} from "../../Plannings/Sessions/sessionsApiSlice";
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
} from "../../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import {
  setAcademicYears,
  selectAllAcademicYears,
} from "../../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import Plannings from "../../Plannings";
import useAuth from "../../../../hooks/useAuth";
import styled from "styled-components";
// The Pane to display resources with colored indicators for animators
const PropertyPane = ({ title, children }) => {
  return (
    <div className="">
      <h3 className="">{title}</h3>
      <div className="">{children}</div>
    </div>
  );
};

const MyPlanning = () => {
  const { userId } = useAuth();
  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);
  const {
    data: user, //the data is renamed sessions
    isLoading: isUserLoading, //monitor several situations is loading...
    isSuccess: isUserSuccess,
    isError: isUserError,
    error: userError,
  } = useGetUserByIdQuery(
    {
      selectedYear: selectedAcademicYear?.title,
      id: userId,

      endpointName: "user",
    } || {},
    {
      //pollingInterval: 60000,//will refetch data every 60seconds
      refetchOnFocus: true, //when we focus on another window then come back to the window ti will refetch data
      refetchOnMountOrArgChange: true, //refetch when we remount the component
    }
  );

  // Initialize selectedanimators once when employeesList is populated
  const [selectedAnimators, setSelectedAnimators] = useState([]);
  useEffect(() => {
    if (isUserSuccess) setSelectedAnimators(user.employeeId);
  }, [isUserSuccess]);

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
    data: sessions, //the data is renamed sessions
    isLoading: isSessionsLoading, //monitor several situations is loading...
    isSuccess: isSessionsSuccess,
    isError: isSessionsError,
    error: sessionsError,
  } = useGetSessionsByYearQuery(
    {
      selectedYear: selectedAcademicYear?.title,
      criteria: "schools",
      id: user?.employeeId,
      endpointName: "sessionsList",
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

  // Prepare sessions list and resource data
  let sessionsList = isSessionsSuccess ? Object.values(sessions.entities) : [];

  let studentSections = isSectionsSuccess
    ? Object.values(sections.entities)
    : [];
  let studentsList = isStudentsSuccess ? Object.values(students.entities) : [];

  if (isSessionsSuccess) {
    //set to the state to be used for other component s and edit student component
    const { entities } = sessions;
    sessionsList = Object.values(entities); //we are using entity adapter in this query

    console.log(sessionsList, "sessionsList");
  }

  if (isSectionsSuccess && !isSectionsLoading) {
    const { entities } = sections;
    studentSections = Object.values(entities);
  }
  if (isStudentsSuccess && !isStudentsLoading) {
    const { entities } = students;
    studentsList = Object.values(entities);
  }

  console.log(studentSections, "studentSections");
  console.log(studentsList, "studentsList");
  //ensure to avoid the capital issue of the fileds to work with scheduler

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
    description: { name: "description" },
    site: { name: "site" },
    trip: { name: "trip" },
    classroom: { name: "classroom", idField: "_id" },
    grades: { name: "grades" },
    recurrenceRule: { name: "recurrenceRule" },
    sessionStatus: { name: "sessionStatus" },
    createdAt: { name: "createdAt" },
    creator: { name: "creator" },
    recurrenceException: { name: "recurrenceException" },
    recurrenceId: { name: "recurrenceId" },
    isAllDay: { name: "isAllDay" },
    isBlock: { name: "isBlock" },
    isReadOnly: { name: "isReadOnly" },

    schoolColor: { name: "schoolColor" },
    // studentId: "student._id",
    // siteId: "site._id",
  };

  let scheduleObj = useRef(null);

  // useEffect(() => {
  //   if(isSessionsSuccess && isUserSuccess && isStudentsSuccess && isSectionsSuccess){
  //   const styleSheet = document.styleSheets[0];

  //   employeesList.forEach((employee) => {
  //     const className = `checkbox-${employee.employeeId}`;

  //     // Rule for checkbox background color when selected
  //     const selectedRule = `
  //       .e-checkbox-wrapper.${className} .e-frame.e-check {
  //         background-color: ${employee.employeeColor} !important;
  //         border-color: ${employee.employeeColor} !important;
  //       }
  //     `;

  //     // Rule for checkbox hover effect
  //     const hoverRule = `
  //       .e-checkbox-wrapper.${className}:hover .e-frame {
  //         background-color: ${employee.employeeColor}33; /* 33 is for transparency */
  //         border-color: ${employee.employeeColor};
  //       }
  //     `;

  //     // Add rules to the stylesheet
  //     styleSheet.insertRule(selectedRule, styleSheet.cssRules.length);
  //     styleSheet.insertRule(hoverRule, styleSheet.cssRules.length);
  //   });
  // }
  // }, [employeesList]);

  const eventTemplate = (props) => {
    if (
      isSessionsSuccess &&
      isUserSuccess &&
      isStudentsSuccess &&
      isSectionsSuccess
    ) {
      const startTime = new Date(props.startTime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      const endTime = new Date(props.endTime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      return (
        <div
          className="e-appointment custom-appointment"
          style={{
            "--appointment-color": props?.employeeColor, // Use CSS variable for dynamic color
            backgroundColor: props?.employeeColor, // Ensure the background color applies directly as well
            color: "white",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center", // Correct syntax for centering vertically
            alignItems: "center", // Correct syntax for centering horizontally
            padding: "5px",
            borderRadius: "4px",
            boxSizing: "border-box",
          }}
        >
          <div style={{ fontSize: "14px" }}>
            {props?.title} : {props?.subject}
          </div>
          <div style={{ fontSize: "12px" }}>
            {startTime} - {endTime} {/* Display the start and end time */}
          </div>
          <div style={{ fontSize: "14px" }}>
            {props.subject} {/* Display the subject */}
          </div>
        </div>
      );
    }
  };

  const eventSettings = {
    dataSource: extend([], sessionsList, null, true),
    template: eventTemplate,
    fields,
  };

  useEffect(() => {
    if (scheduleObj.current) {
      if (selectedAnimators.length === 0) {
        scheduleObj.current.eventSettings.query = new Query();
      } else {
        let predicate = new Predicate(
          "animator",
          "equal",
          selectedAnimators[0]
        );

        for (let i = 1; i < selectedAnimators.length; i++) {
          predicate = predicate.or(
            new Predicate("animator", "equal", selectedAnimators[i])
          );
        }

        scheduleObj.current.eventSettings.query = new Query().where(predicate);
      }
    }
  }, [selectedAnimators]);
  console.log(selectedAnimators, "selectedAnimators");
  return isSessionsSuccess &&
    isUserSuccess &&
    isStudentsSuccess &&
    isSectionsSuccess ? (
    <>
      <Plannings />
      <div className="e-schedule">
        <div className="schedule-container" style={{ display: "flex" }}>
          <div className="schedule-section " style={{ flex: 3 }}>
            <ScheduleComponent
              width="100%"
              //height="650px"
              selectedDate={new Date(2024, 9, 14)}
              ref={scheduleObj} //to access and update teh scheduler by applying the query filter based on selectedAnimators
              eventSettings={eventSettings}
              allowDragAndDrop={false}
              allowResizing={false}
              timeScale={{ enable: true, interval: 120, slotCount: 4 }}
              workDays={[1, 2, 3, 4, 5, 6]}
              startHour="07:00"
              endHour="18:00"
              group={{ resources: ["Sections", "Students"] }}
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
                  //colorField="color"
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
                <ResourceDirective
                  field="animator" // this is the identification criteria in teh data
                  title="Animators" // the title of the resource gorupping in hte scheduler, it will desiplay Animators obove th resource panel (edit and new event selection)
                  name="Animators" //an internal identifier used to define this resource grouping, could be used in multiple places within your application to reference this group of resources.
                  allowMultiple={true} //whether multiple resources can be assigned to a single event.
                  dataSource={user} //the data source that provides the list of resources (in this case, animators) to be displayed in the scheduler.
                  textField="userFullName" //specifies which field in the resource data should be used to display the name of the resource.
                  idField="employeeId" //specifies which property in the resource data serves as the unique identifier for each resource
                  colorField="employeeColor" //specifies the property in the resource data that holds the color associated with the resource.
                />
              </ResourcesDirective>
              <ViewsDirective>
                <ViewDirective option="TimelineDay" isSelected={true} />
                <ViewDirective option="Agenda" />
              </ViewsDirective>
              <Inject
                services={[
                  Day,
                  Agenda,
                  TimelineViews,
                  WorkWeek,

                  Resize,
                  DragAndDrop,
                ]}
              />
            </ScheduleComponent>
          </div>
        </div>
        <style>
          {`
          .e-schedule .e-appointment {
            background-color: var(--appointment-color) !important;
            border-color: var(--appointment-color) !important;
          }
          .e-schedule .e-appointment .e-lib {
            background-color: var(--appointment-color) !important;
            border-color: var(--appointment-color) !important;
          }
          .e-schedule .e-appointment .e-draggable {
            background-color: var(--appointment-color) !important;
            border-color: var(--appointment-color) !important;
          }
        `}
        </style>
      </div>
    </>
  ) : <Plannings />;
};

export default MyPlanning;
