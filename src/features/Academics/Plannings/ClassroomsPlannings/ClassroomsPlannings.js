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
  Week,
  WorkWeek,
  Month,
  TimelineDay,
  PopupOpenEventArgs,
  Inject,
  Resize,
  Agenda,
  DragAndDrop,
} from "@syncfusion/ej2-react-schedule";
import { Query, Predicate } from "@syncfusion/ej2-data"; //Predicate and Query: Used to filter data displayed in the scheduler by constructing queries.
import { CheckBoxComponent } from "@syncfusion/ej2-react-buttons"; //CheckBoxComponent: Syncfusion's CheckBox UI component to filter the scheduler resources
import { useGetClassroomsQuery} from '../../../AppSettings/AcademicsSet/Classrooms/classroomsApiSlice'
import { SidebarComponent } from "@syncfusion/ej2-react-navigations";
import { useGetStudentsByYearQuery } from "../../../Students/StudentsAndParents/Students/studentsApiSlice";
import { extend } from "@syncfusion/ej2-base"; //extend: A utility from Syncfusion that helps in extending an array or object.
import { DateTimePickerComponent } from "@syncfusion/ej2-react-calendars";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
//import { PropertyPane } from '../common/property-pane';//PropertyPane: A wrapper component for UI controls.
import { DataArray } from "../../../../config/SampleSchedule";

import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
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
import styled from "styled-components";
// The Pane to display resources with colored indicators for sites
const PropertyPane = ({ title, children }) => {
  return (
    <div className="">
      <h3 className="">{title}</h3>
      <div className="">{children}</div>
    </div>
  );
};


const ClassroomsPlannings = () => {
  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);

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
    data: classrooms, //the data is renamed sessions
    isLoading: isClassroomsLoading, //monitor several situations is loading...
    isSuccess: isClassroomsSuccess,
    isError: isClassroomsError,
    error: classroomsError,
  } = useGetClassroomsQuery(
    {
      endpointName: "ClassroomssList",
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
      criteria: "schools",//to exract the needed formatted data
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
  let classroomsList = isClassroomsSuccess ? Object.values(classrooms.entities) : [];
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
  console.log(classroomsList, "classroomsList");
  console.log(studentSections, "studentSections");
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

    classroomColor: { name: "classroomColor" },
    // studentId: "student._id",
    // siteId: "site._id",
  };

  let scheduleObj = useRef(null);

  // Initialize selectedClassrooms once when classroomsList is populated
  const [selectedClassrooms, setSelectedClassrooms] = useState(
    classroomsList.map((resource) => resource.id)
  );

  //filtering event sbased on the selected sites/classrooms
  useEffect(() => {
    if (
      isClassroomsSuccess &&
      classroomsList.length > 0 &&
      selectedClassrooms.length === 0
    ) {
      // Set all checkboxes as checked only once
      setSelectedClassrooms(classroomsList.map((resource) => resource.id));
    }
  }, [classroomsList, isClassroomsSuccess, selectedClassrooms.length]);

  useEffect(() => {
    if(isSessionsSuccess && isClassroomsSuccess && isStudentsSuccess && isSectionsSuccess){
    const styleSheet = document.styleSheets[0];

    classroomsList.forEach((resource) => {
      const className = `checkbox-${resource.id}`;

      // Rule for checkbox background color when selected
      const selectedRule = `
        .e-checkbox-wrapper.${className} .e-frame.e-check {
          background-color: ${resource.classroomColor} !important;
          border-color: ${resource.classroomColor} !important;
        }
      `;

      // Rule for checkbox hover effect
      const hoverRule = `
        .e-checkbox-wrapper.${className}:hover .e-frame {
          background-color: ${resource.classroomColor}33; /* 33 is for transparency */
          border-color: ${resource.classroomColor};
        }
      `;

      // Add rules to the stylesheet
      styleSheet.insertRule(selectedRule, styleSheet.cssRules.length);
      styleSheet.insertRule(hoverRule, styleSheet.cssRules.length);
    })
  }
  }, [classroomsList]);

  const onChange = (args, resourceId) => {
    const isChecked = args.checked;
    setSelectedClassrooms((prevSelected) =>
      isChecked
        ? [...prevSelected, resourceId]
        : prevSelected.filter((id) => id !== resourceId)
    );
  };

  const eventTemplate = (props) => {
    if (isSessionsSuccess && isClassroomsSuccess && isStudentsSuccess && isSectionsSuccess){
    
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
          "--appointment-color": props?.classroomColor, // Use CSS variable for dynamic color
          backgroundColor: props?.classroomColor, // Ensure the background color applies directly as well
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
        <div style={{ fontSize: "14px" }}>{props?.title} : {props?.subject}</div>
        <div style={{ fontSize: "12px" }}>
          {startTime} - {endTime} {/* Display the start and end time */}
        </div>
        <div style={{ fontSize: "14px" }}>
          {props.subject} {/* Display the subject */}
        </div>
      </div>
    );
  }}

  const eventSettings = {
    dataSource: extend([], sessionsList, null, true),
    template: eventTemplate,
    fields,
  };

  useEffect(() => {
    if (scheduleObj.current) {
      if (selectedClassrooms.length === 0) {
        scheduleObj.current.eventSettings.query = new Query();
      } else {
        let predicate = new Predicate("classroom", "equal", selectedClassrooms[0]);

        for (let i = 1; i < selectedClassrooms.length; i++) {
          predicate = predicate.or(
            new Predicate("classroom", "equal", selectedClassrooms[i])
          );
        }

        scheduleObj.current.eventSettings.query = new Query().where(predicate);
      }
    }
  }, [selectedClassrooms]);

  return (isSessionsSuccess && isClassroomsSuccess && isStudentsSuccess && isSectionsSuccess)? (
    <>
      <Plannings />
      <div className="e-schedule">
        <div className="schedule-container" style={{ display: "flex" }}>
          <div className="schedule-section " style={{ flex: 3 }}>
            <ScheduleComponent
              width="100%"
              //height="650px"
              selectedDate={new Date(2024, 9, 14)}
              ref={scheduleObj} //to access and update teh scheduler by applying the query filter based on selectedClassrooms
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
                <ResourceDirective
                  field="classroom" // this is the identification criteria in teh data
                  title="Classroom" // the title of the resource gorupping in hte scheduler, it will desiplay classrooms obove th resource panel (edit and new event selection)
                  name="Classrooms" //an internal identifier used to define this resource grouping, could be used in multiple places within your application to reference this group of resources.
                  allowMultiple={true} //whether multiple resources can be assigned to a single event.
                  dataSource={classroomsList} //the data source that provides the list of resources (in this case, classrooms) to be displayed in the scheduler.
                  textField="classroomLabel" //specifies which field in the resource data should be used to display the name of the resource.
                  idField="id" //specifies which property in the resource data serves as the unique identifier for each resource
                  colorField="classroomColor" //specifies the property in the resource data that holds the color associated with the resource.
                />
              </ResourcesDirective>
              <ViewsDirective>
                <ViewDirective option="TimelineDay" />
                <ViewDirective option="Agenda" />
              </ViewsDirective>
              <Inject
                services={[
                  Day,
                  Week,
                  TimelineViews,
                  WorkWeek,
                  Month,
                  Resize,
                  DragAndDrop,
                  Agenda,
                ]}
              />
            </ScheduleComponent>
          </div>

          {/* Property Pane Section */}
          <div className="property-panel-content">
            <PropertyPane title="Classrooms">
              <table className="property-panel-table">
                <tbody>
                  {classroomsList.map((classroom) => (
                    <tr key={classroom.id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <CheckBoxComponent
                            id={`classroom-checkbox-${classroom.id}`}
                            checked={selectedClassrooms.includes(classroom.id)}
                            label={classroom.classroomLabel}
                            cssClass={`checkbox-${classroom.id}`} // Apply dynamic class
                            change={(args) => onChange(args, classroom.id)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </PropertyPane>
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

export default ClassroomsPlannings;
