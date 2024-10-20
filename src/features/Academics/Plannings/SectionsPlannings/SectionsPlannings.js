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

import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
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

// The Pane to display resources with colored indicators for schools
const PropertyPane = ({ title, children }) => {
  return (
    <div className="property-pane">
      <h3 className="property-pane-title">{title}</h3>
      <div className="property-pane-content">{children}</div>
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
    data: sessions, //the data is renamed sessions
    isLoading: isSessionsLoading, //monitor several situations is loading...
    isSuccess: isSessionsSuccess,
    isError: isSessionsError,
    error: sessionsError,
  } = useGetSessionsByYearQuery(
    {
      selectedYear: selectedAcademicYear?.title,
      endpointName: "sessionsList",
    } || {},
    {
      //pollingInterval: 60000,//will refetch data every 60seconds
      refetchOnFocus: true, //when we focus on another window then come back to the window ti will refetch data
      refetchOnMountOrArgChange: true, //refetch when we remount the component
    }
  );

  let sessionsList = [];

  if (isSessionsSuccess) {
    //set to the state to be used for other component s and edit student component
    const { entities } = sessions;
    sessionsList = Object.values(entities); //we are using entity adapter in this query

    console.log(sessionsList, "sessionsList");
  }
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

  let resourceData = [];

  if (isSchoolsSuccess && !isSchoolsLoading) {
    const { entities } = schools;
    resourceData = Object.values(entities);
  }

  // Initialize selectedSchools once when resourceData is populated
  const [selectedSchools, setSelectedSchools] = useState([]);

  useEffect(() => {
    if (
      isSchoolsSuccess &&
      resourceData.length > 0 &&
      selectedSchools.length === 0
    ) {
      // Set all checkboxes as checked only once
      setSelectedSchools(resourceData.map((resource) => resource.id));
    }
  }, [resourceData, isSchoolsSuccess, selectedSchools.length]);

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
    students: { name: "students" },
    description: { name: "Description" },
    school: { name: "school" },
    site: { name: "site" },
    trip: { name: "trip" },
    classroom: { name: "classroom" },
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
    school: { name: "school", idField: "_id" }, // assuming the school field has _id
    schoolColor: { name: "schoolColor" },
  };

  let scheduleObj = useRef(null);

  const onChange = (args, resourceId) => {
    const isChecked = args.checked;
    setSelectedSchools((prevSelected) =>
      isChecked
        ? [...prevSelected, resourceId]
        : prevSelected.filter((id) => id !== resourceId)
    );
  };

  // Update the event template to ensure the background color covers the full area
  const eventTemplate = (props) => (
    <div
      style={{
        backgroundColor: props.school?.schoolColor || "#000", // Use correct school color
        width: "100%", // Ensure full background coverage
        height: "100%", // Ensure full height
        padding: "5px",
        color: "white",
        boxSizing: "border-box", // Ensure padding doesn't shrink the size
      }}
    >
      {props.subject}
    </div>
  );

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

  return isSessionsSuccess ? (
    <>
      <Plannings />
      <div className="schedule-container" style={{ display: "flex" }}>
        <div className="schedule-section" style={{ flex: 3 }}>
          <ScheduleComponent
            width="100%"
            height="650px"
            selectedDate={new Date(2024, 9, 14)}
            ref={scheduleObj}
            eventSettings={eventSettings}
            timeScale={{ enable: true, interval: 120, slotCount: 4 }}
            workDays={[1, 2, 3, 4, 5, 6]}
            startHour="07:00"
            endHour="18:00"
          >
            <ResourcesDirective>
              <ResourceDirective
                field="site._id"
                title="Schools"
                name="schools"
                allowMultiple={true}
                dataSource={resourceData}
                textField="schoolName"
                idField="id"
                colorField="schoolColor"
              />
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
        <div
          className="property-pane-section"
          style={{ flex: 1, paddingLeft: "20px" }}
        >
          <PropertyPane title="Resources">
            <table className="property-panel-table">
              <tbody>
                {resourceData.map((resource) => (
                  <tr key={resource.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span
                          style={{
                            display: "inline-block",
                            width: "20px",
                            height: "20px",
                            backgroundColor: resource.schoolColor,
                            marginRight: "10px",
                          }}
                        ></span>
                        <CheckBoxComponent
                          id={`resource-checkbox-${resource.id}`}
                          checked={selectedSchools.includes(resource.id)}
                          label={resource.schoolName}
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
    </>
  ) : null;
};

export default SectionsPlannings;
