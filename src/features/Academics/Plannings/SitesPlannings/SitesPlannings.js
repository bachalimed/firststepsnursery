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
  DragAndDrop,
  Agenda,
  
} from "@syncfusion/ej2-react-schedule";
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { createElement } from '@syncfusion/ej2-base';
import { Query, Predicate } from "@syncfusion/ej2-data"; //Predicate and Query: Used to filter data displayed in the scheduler by constructing queries.
import { CheckBoxComponent } from "@syncfusion/ej2-react-buttons"; //CheckBoxComponent: Syncfusion's CheckBox UI component to filter the scheduler resources
import { useGetAttendedSchoolsQuery } from "../../../AppSettings/AcademicsSet/attendedSchools/attendedSchoolsApiSlice";
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
import Academics from "../../Academics";
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


const SitesPlannings = () => {
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
      endpointName: "SitesPlannings",
    } || {},
    {
      //pollingInterval: 60000,//will refetch data every 60seconds
      refetchOnFocus: true, //when we focus on another window then come back to the window ti will refetch data
      refetchOnMountOrArgChange: true, //refetch when we remount the component
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
      endpointName: "SitesPlannings",
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
      endpointName: "SitesPlannings",
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

      endpointName: "SitesPlannings",
    } || {},
    {
      //pollingInterval: 60000,//will refetch data every 60seconds
      refetchOnFocus: true, //when we focus on another window then come back to the window ti will refetch data
      refetchOnMountOrArgChange: true, //refetch when we remount the component
    }
  );

  // Prepare sessions list and resource data
  let sessionsList = isSessionsSuccess ? Object.values(sessions.entities) : [];
  let schoolsList = isSchoolsSuccess ? Object.values(schools.entities) : [];
  let studentSections = isSectionsSuccess
    ? Object.values(sections.entities)
    : [];
  let studentsList = isStudentsSuccess ? Object.values(students.entities) : [];
  if (isSessionsSuccess) {
    //set to the state to be used for other component s and edit student component
    const { entities } = sessions;
    sessionsList = Object.values(entities); //we are using entity adapter in this query

    //console.log(sessionsList, "sessionsList");
  }

  if (isSchoolsSuccess && !isSchoolsLoading) {
    const { entities } = schools;
    schoolsList = Object.values(entities);
  }
  if (isSectionsSuccess && !isSectionsLoading) {
    const { entities } = sections;
    studentSections = Object.values(entities);
  }
  if (isStudentsSuccess && !isStudentsLoading) {
    const { entities } = students;
    studentsList = Object.values(entities);
  }
  // console.log(schoolsList, "schoolsList");
  // console.log(studentSections, "studentSections");
  //ensure to avoid the capital issue of the fileds to work with scheduler

  const fields = {
    id: { name: "id" }, // Mapping your custom `id` field to `Id`
    //subject: { name: "Subject" }, // Mapping your `title` field to `Subject`
    //startTime: { name: "startTime" }, // Mapping your `startTime` field to `StartTime`
   // endTime: { name: "endTime" }, // Mapping your `endTime` field to `EndTime`
 //   location: { name: "location" },
   // title: { name: "title" },
    sessionYear: { name: "sessionYear" },
    animator: { name: "animator" },
    school: { name: "school", idField: "_id" },
    section: { name: "section", idField: "_id" },
    student: { name: "student", idField: "_id" },
    sessionSectionId: { name: "sessionSectionId" },
    sessionStudentId: { name: "sessionStudentId" },
   // description: { name: "description" },
    site: { name: "site" },
    classroom: { name: "classroom", idField: "_id" },
    grades: { name: "grades" },
    //recurrenceRule: { name: "recurrenceRule" },
    sessionStatus: { name: "sessionStatus" },
    createdAt: { name: "createdAt" },
    creator: { name: "creator" },
   // recurrenceException: { name: "recurrenceException" },
   // recurrenceId: { name: "recurrenceId" },
   // isAllDay: { name: "isAllDay" },
   // isBlock: { name: "isBlock" },
   // isReadOnly: { name: "isReadOnly" },

    color: { name: "color" },//imported in backend from school
   
  };

  let scheduleObj = useRef(null);

  // Initialize selectedSchools once when schoolsList is populated
  const [selectedSchools, setSelectedSchools] = useState(
    schoolsList.map((resource) => resource.id)
  );

  //filtering event sbased on the selected sites/schools
  useEffect(() => {
    if (
      isSchoolsSuccess &&
      schoolsList.length > 0 &&
      selectedSchools.length === 0
    ) {
      // Set all checkboxes as checked only once
      setSelectedSchools(schoolsList.map((resource) => resource.id));
    }
  }, [schoolsList, isSchoolsSuccess, selectedSchools.length]);

  useEffect(() => {
    if(isSessionsSuccess && isSchoolsSuccess && isStudentsSuccess && isSectionsSuccess){
    const styleSheet = document.styleSheets[0];

    schoolsList.forEach((resource) => {
      const className = `checkbox-${resource.id}`;

      // Rule for checkbox background color when selected
      const selectedRule = `
        .e-checkbox-wrapper.${className} .e-frame.e-check {
          background-color: ${resource.schoolColor} !important;
          border-color: ${resource.schoolColor} !important;
        }
      `;

      // Rule for checkbox hover effect
      const hoverRule = `
        .e-checkbox-wrapper.${className}:hover .e-frame {
          background-color: ${resource.schoolColor}33; /* 33 is for transparency */
          border-color: ${resource.schoolColor};
        }
      `;

      // Add rules to the stylesheet
      styleSheet.insertRule(selectedRule, styleSheet.cssRules.length);
      styleSheet.insertRule(hoverRule, styleSheet.cssRules.length);
    })
  }
  }, [schoolsList]);

  const onChange = (args, resourceId) => {
    const isChecked = args.checked;
    setSelectedSchools((prevSelected) =>
      isChecked
        ? [...prevSelected, resourceId]
        : prevSelected.filter((id) => id !== resourceId)
    );
  };

  const eventTemplate = (props) => {
    if (isSessionsSuccess && isSchoolsSuccess && isStudentsSuccess && isSectionsSuccess){
    const schoolColor = props.site?.schoolColor || "#ff5657"; // Fallback if schoolColor is missing
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
          "--appointment-color": schoolColor, // Use CSS variable for dynamic color
          backgroundColor: schoolColor, // Ensure the background color applies directly as well
          color: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center", // Correct syntax for centering vertically
          alignItems: "center", // Correct syntax for centering horizontally
          padding: "1px",
          borderRadius: "4px",
          boxSizing: "border-box",
        }}
      >
        <div style={{ fontSize: "14px" }}>{props?.title} </div>
        <div style={{ fontSize: "10px" }}>
          {startTime} - {endTime} {/* Display the start and end time */}
        </div>
        <div style={{ fontSize: "14px" }}>
          {props.Subject} {/* Display the subject */}
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
      if (selectedSchools.length === 0) {
        scheduleObj.current.eventSettings.query = new Query();
      } else {
        let predicate = new Predicate("site._id", "equal", selectedSchools[0]);

        for (let i = 1; i < selectedSchools.length; i++) {
          predicate = predicate.or(
            new Predicate("site._id", "equal", selectedSchools[i])
          );
        }

        scheduleObj.current.eventSettings.query = new Query().where(predicate);
      }
    }
  }, [selectedSchools]);



 // Event handler for customizing the popup window
 const onPopupOpen = (args) => {
  //console.log('args printed here', args.type, args)
  if (args.type === "QuickInfo" && !args.data.Subject) {
    args.cancel = true;
  }
  if (args.type === "Editor") {
    let formElement = args.element.querySelector('.e-schedule-form');

    // Custom fields
    let subjectElement = formElement.querySelector('#Subject');
    if (!subjectElement) {
      // Add custom fields
      let subjectDiv = document.createElement('div');
      subjectDiv.className = 'e-float-input';
      subjectDiv.innerHTML = `<input id="Subject" name="Subject" type="text" class="e-field e-input" placeholder="Subject" /><span class="e-float-line"></span>`;
      formElement.appendChild(subjectDiv);
    }

    // Repeat for other fields in `fields`, such as startTime, endTime, location, etc.
    let locationElement = formElement.querySelector('#Location');
    if (!locationElement) {
      let locationDiv = document.createElement('div');
      locationDiv.className = 'e-float-input';
      locationDiv.innerHTML = `<input id="Location" name="Location" type="text" class="e-field e-input" placeholder="Location" /><span class="e-float-line"></span>`;
      formElement.appendChild(locationDiv);
    }

    // Assign other custom field inputs here, if needed.
  }
};

// Event handler for customizing the appearance of events
const onEventRendered = (args) => {
  const sessionStatus = args.data.sessionStatus;
  if (sessionStatus === "Completed") {
    args.element.style.backgroundColor = "#9AEBC5"; // For example, green for completed
  } else if (sessionStatus === "Pending") {
    args.element.style.backgroundColor = "#EBA9A3"; // Red for pending
  }
  // Customize further based on other fields or status, as needed
};
  return (isSessionsSuccess && isSchoolsSuccess && isStudentsSuccess && isSectionsSuccess)? (
    <>
      <Academics />
      <div className="e-schedule">
        <div className="schedule-container" style={{ display: "flex" }}>
          <div className="schedule-section " style={{ flex: 3 }}>
            <ScheduleComponent
              width="100%"
              //height="650px"
              selectedDate={new Date()}
              // selectedDate={new Date(2024, 10, 1)}
              ref={scheduleObj} //to access and update teh scheduler by applying the query filter based on selectedschools
              eventSettings={eventSettings}
              //allowDragAndDrop={false}
              //allowResizing={false}
              timeScale={{ enable: true, interval: 120, slotCount: 4 }}
              workDays={[1, 2, 3, 4, 5, 6]}
              startHour="07:00"
              endHour="18:00"
              popupOpen={onPopupOpen} eventRendered={onEventRendered}
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
                  field="site._id" // this is the identification criteria in teh data
                  title="Schools" // the title of the resource gorupping in hte scheduler, it will desiplay schools obove th resource panel (edit and new event selection)
                  name="schools" //an internal identifier used to define this resource grouping, could be used in multiple places within your application to reference this group of resources.
                  allowMultiple={true} //whether multiple resources can be assigned to a single event.
                  dataSource={schoolsList} //the data source that provides the list of resources (in this case, schools) to be displayed in the scheduler.
                  textField="schoolName" //specifies which field in the resource data should be used to display the name of the resource.
                  idField="id" //specifies which property in the resource data serves as the unique identifier for each resource
                  colorField="schoolColor" //specifies the property in the resource data that holds the color associated with the resource.
                />
              </ResourcesDirective>
              <ViewsDirective>
                <ViewDirective option="TimelineDay" isSelected={true}/>
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
            <PropertyPane title="Sites">
              <table className="property-panel-table">
                <tbody>
                  {schoolsList.map((resource) => (
                    <tr key={resource.id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <CheckBoxComponent
                            id={`resource-checkbox-${resource.id}`}
                            checked={selectedSchools.includes(resource.id)}
                            label={resource.schoolName}
                            cssClass={`checkbox-${resource.id}`} // Apply dynamic class
                            change={(args) => onChange(args, resource.id)}
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
  ) : <Academics />;
};

export default SitesPlannings;
