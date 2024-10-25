import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  ScheduleComponent,
  ViewsDirective,
  ViewDirective,
  ResourcesDirective,
  ResourceDirective,
  groupModel,
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
} from "@syncfusion/ej2-react-schedule";
import { Query, Predicate } from "@syncfusion/ej2-data"; //Predicate and Query: Used to filter data displayed in the scheduler by constructing queries.
import { CheckBoxComponent } from "@syncfusion/ej2-react-buttons"; //CheckBoxComponent: Syncfusion's CheckBox UI component to filter the scheduler resources
import { useGetAttendedSchoolsQuery } from "../../../AppSettings/AcademicsSet/attendedSchools/attendedSchoolsApiSlice";
import { SidebarComponent } from "@syncfusion/ej2-react-navigations";
import { extend } from "@syncfusion/ej2-base"; //extend: A utility from Syncfusion that helps in extending an array or object.
import { DateTimePickerComponent } from "@syncfusion/ej2-react-calendars";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
//import { PropertyPane } from '../common/property-pane';//PropertyPane: A wrapper component for UI controls.
import { DataArray } from "../../../../config/SampleSchedule";
import {useGetStudentsByYearQuery} from '../../../Students/StudentsAndParents/Students/studentsApiSlice'
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import {
  useGetSectionsByYearQuery,
  useUpdateSectionMutation,
  useDeleteSectionMutation,
} from "../../Sections/sectionsApiSlice"
import {
  useGetSessionsByYearQuery,
  useUpdateSessionMutation,
  useDeleteSessionMutation,
} from "../../NurseryPlannings/Sessions/sessionsApiSlice";
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
} from "../../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import {
  setAcademicYears,
  selectAllAcademicYears,
} from "../../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import Plannings from "../../Plannings";

// The Pane to display resources with colored indicators for sites
const PropertyPane = ({ title, children }) => {
  return (
    <div className="">
      <h3 className="">{title}</h3>
      <div className="">{children}</div>
    </div>
  );
};

const SectionsPlannings = () => {
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
      selectedYear: selectedAcademicYear?.title ,
      endpointName: "SectionsListInPlanning",
    } || {},
    {
      //pollingInterval: 60000,//will refetch data every 60seconds
      refetchOnFocus: true, //when we focus on another window then come back to the window ti will refetch data
      refetchOnMountOrArgChange: true, //refetch when we remount the component
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
      selectedYear: selectedAcademicYear?.title ,
      criteria: "schools",
      endpointName: "sessionsList",
    } || {},
    {
      //pollingInterval: 60000,//will refetch data every 60seconds
      refetchOnFocus: true, //when we focus on another window then come back to the window ti will refetch data
      refetchOnMountOrArgChange: true, //refetch when we remount the component
    })
  
  const {
    data: students, //the data is renamed sessions
    isLoading: isStudentsLoading, //monitor several situations is loading...
    isSuccess: isStudentsSuccess,
    isError: isStudentsError,
    error: studentsError,
  } = useGetStudentsByYearQuery(
    {
      selectedYear: selectedAcademicYear?.title ,
      criteria:"withSections",
      
      endpointName: "studentsList",
    } || {},
    {
      //pollingInterval: 60000,//will refetch data every 60seconds
      refetchOnFocus: true, //when we focus on another window then come back to the window ti will refetch data
      refetchOnMountOrArgChange: true, //refetch when we remount the component
    })
  
  // Prepare sessions list and resource data
  let sessionsList = isSessionsSuccess ? Object.values(sessions.entities) : [];
  let schoolsListData = isSchoolsSuccess ? Object.values(schools.entities) : [];
  let studentSections = isSectionsSuccess ? Object.values(sections.entities) : [];
  let studentsList = isStudentsSuccess ? Object.values(students.entities) : [];

  if (isSessionsSuccess) {
    //set to the state to be used for other component s and edit student component
    const { entities } = sessions;
    sessionsList = Object.values(entities); //we are using entity adapter in this query

    console.log(sessionsList, "sessionsList");
  }

  if (isSchoolsSuccess && !isSchoolsLoading) {
    const { entities } = schools;
    schoolsListData = Object.values(entities);
    console.log(schoolsListData, "schoolsListData");
  }
  if (isSectionsSuccess && !isSectionsLoading) {
    const { entities } = sections;
    studentSections = Object.values(entities);
  }
  if (isStudentsSuccess && !isStudentsLoading) {
    const { entities } = students;
    studentsList = Object.values(entities);
  }
console.log(studentsList,'studentsList')
console.log(studentSections,'studentSections')
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
    section:{ name: "section", idField: "_id" },
    student:{ name: "student", idField: "_id" },
    
    description: { name: "Description" },
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
    IsBlock: { name: "isBlock" },
    isReadOnly: { name: "isReadOnly" },

    schoolColor: { name: "schoolColor" },
    // studentId: "student._id",
    // siteId: "site._id",
  };

  let scheduleObj = useRef(null);

  // Initialize selectedSchools once when schoolsListData is populated
  const [selectedSchools, setSelectedSchools] = useState(
    schoolsListData.map((schoolItem) => schoolItem.id)
  );

  //filtering event sbased on the selected sites/schools
  useEffect(() => {
    if (
      isSchoolsSuccess &&
      schoolsListData.length > 0 &&
      selectedSchools.length === 0
    ) {
      // Set all checkboxes as checked only once
      setSelectedSchools(schoolsListData.map((schoolItem) => schoolItem.id));
    }
  }, [schoolsListData, isSchoolsSuccess, selectedSchools.length]);

  useEffect(() => {
    if (scheduleObj.current) {
      if (selectedSchools.length === 0) {
        scheduleObj.current.eventSettings.query = new Query();
      } else {
        let predicate = new Predicate("site._id", "equal", selectedSchools[0]);
        for (let i = 1; i < selectedSchools.length; i++) {
          predicate = predicate.or(new Predicate("site._id", "equal", selectedSchools[i]));
        }
        scheduleObj.current.eventSettings.query = new Query().where(predicate);
      }
    }
  }, [selectedSchools]);

  const onChange = (args, schoolId) => {
    const isChecked = args.checked;
    setSelectedSchools((prevSelected) =>
      isChecked ? [...prevSelected, schoolId] : prevSelected.filter((id) => id !== schoolId)
    );
  };
  console.log(selectedSchools,'selectedSchools')
  useEffect(() => {
    const styleSheet = document.styleSheets[0];
  
    schoolsListData.forEach((schoolItem) => {
      const className = `checkbox-${schoolItem.id}`;
  
      // Rule for checkbox background color when selected
      const selectedRule = `
        .e-checkbox-wrapper.${className} .e-frame.e-check {
          background-color: ${schoolItem.schoolColor} !important;
          border-color: ${schoolItem.schoolColor} !important;
        }
      `;
  
      // Rule for checkbox hover effect
      const hoverRule = `
        .e-checkbox-wrapper.${className}:hover .e-frame {
          background-color: ${schoolItem.schoolColor}33; /* 33 is for transparency */
          border-color: ${schoolItem.schoolColor};
        }
      `;
  
      // Add rules to the stylesheet
      styleSheet.insertRule(selectedRule, styleSheet.cssRules.length);
      styleSheet.insertRule(hoverRule, styleSheet.cssRules.length);
    });
  }, [schoolsListData]);
  





  const eventTemplate = (props) => {
    const schoolColor = props.site?.schoolColor || "#ff5657"; // Fallback if schoolColor is missing
    const startTime = new Date(props.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const endTime = new Date(props.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
    return (
      <div
        className="e-appointment custom-appointment"
        style={{
          '--appointment-color': schoolColor, // Use CSS variable for dynamic color
          backgroundColor: schoolColor,       // Ensure the background color applies directly as well
          color: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "5px",
          borderRadius: "4px",
          boxSizing: "border-box",
        }}
      >
        <div style={{ fontSize: "14px" }}>
          {props?.title} 
        </div>
        <div style={{ fontSize: "12px" }}>
          {startTime} - {endTime} {/* Display the start and end time */}
        </div>
         <div style={{  fontSize: "14px" }}>
          {props.subject} {/* Display the subject */}
        </div>
      </div>
    );
  };
  

  

  const eventSettings = {
    dataSource: extend([], sessionsList, null, true),
    template: eventTemplate,
    fields,
  };

  return isSessionsSuccess ? (
    <>
      <Plannings />
      <div className="schedule-container" style={{ display: "flex" }}>
        <div className="schedule-section " style={{ flex: 3 }}>
          <ScheduleComponent
           
            width="100%"
            //height="650px"
            selectedDate={new Date(2024, 9, 14)}
            ref={scheduleObj} //to access and update teh scheduler by applying the query filter based on selectedschools
            eventSettings={eventSettings}
            timeScale={{ enable: true, interval: 120, slotCount: 4 }}
            workDays={[1, 2, 3, 4, 5, 6]}
            startHour="07:00"
            endHour="18:00"
            group={{ resources: ["sections, students"] }} // Group by both students and schools
          >
            <ResourcesDirective>
           
              {/* Group by Sections */}
             
            <ResourceDirective
                field="section._id" // Group by student
                title="Sections"
                name="sections"
                allowMultiple={false}
                dataSource={studentSections}
                textField="sectionLabel"  // Student name field
                idField="id" 
                
              />
             {/* Group by Students within Sections */}
              <ResourceDirective
                field="student._id"
                title="Students"
                name="students"
                allowMultiple={true}
                dataSource={studentsList}
                textField="studentName.firstName"
                idField="id" // the identifier of the elements of studetnsList 
                colorField="color" //needs to be replaced
                groupIDField="studentSection._id"// the id in the studetnList that refers to the Id of the section
              />
              {/* <ResourceDirective
                field="site._id" // this is the identification criteria of the resource id present in the data
                title="Schools" // the title of the resource gorupping in hte scheduler, it will desiplay schools obove th resource panel (edit and new event selection)
                name="schools" //an internal identifier used to define this resource grouping, could be used in multiple places within your application to reference this group of resources.
                allowMultiple={true} //whether multiple resources can be assigned to a single event.
                dataSource={schoolsListData} //the data source that provides the list of resources (in this case, schools) to be displayed in the scheduler.
                textField="schoolName" //specifies which field in the resource data should be used to display the name of the resource.
                idField="id" //org idspecifies which property in the resource data serves as the unique identifier for each resource
                colorField="schoolColor" //specifies the property in the resource data that holds the color associated with the resource.
              /> */}
            </ResourcesDirective>
            <ViewsDirective>
              <ViewDirective option="TimelineDay" />
             
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
              ]}
            />
          </ScheduleComponent>
        </div>

        {/* Property Pane Section */}
        <div className="property-panel-content">
          <PropertyPane title="Sites">
            <table className="property-panel-table">
              <tbody>
                {schoolsListData.map((schoolItem) => (
                  <tr key={schoolItem.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <CheckBoxComponent
                          id={`schoolItem-checkbox-${schoolItem.id}`}
                          checked={selectedSchools.includes(schoolItem.id)}
                          label={schoolItem.schoolName}
                          cssClass={`checkbox-${schoolItem.id}`} // Apply dynamic class
                          change={(args) => onChange(args, schoolItem.id)}
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
    </>
  ) : null;
};

export default SectionsPlannings;
