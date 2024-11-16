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
import Academics from "../../Academics";
// The Pane to display resources with colored indicators for schools
const PropertyPane = ({ title, children }) => {
  return (
    <div className="property-pane">
      <h3 className="property-pane-title">{title}</h3>
      <div className="property-pane-content">{children}</div>
    </div>
  );
};

const SitesPlannings = () => {
  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId);
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  );
  const academicYears = useSelector(selectAllAcademicYears);

  // Fetch session and school data
  const {
    data: sessions,
    isLoading: isSessionsLoading,
    isSuccess: isSessionsSuccess,
  } = useGetSessionsByYearQuery(
    { selectedYear: selectedAcademicYear?.title },
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  const {
    data: schools,
    isSuccess: isSchoolsSuccess,
  } = useGetAttendedSchoolsQuery(
    { endpointName: "AttendedSchoolsList" },
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  // Prepare sessions list and resource data
  let sessionsList = isSessionsSuccess ? Object.values(sessions.entities) : [];
  let resourceData = [
    { schoolName: "Nursery", id: "1", schoolColor: "#ff5657" },
  ];

  if (isSchoolsSuccess) {
    const { entities } = schools;
    resourceData = [
      ...resourceData,
      ...Object.values(entities).map((school) => ({
        ...school,
        id: school._id, // Map `_id` to `id` for Scheduler's requirements
      })),
    ];
  }

  const fields = {
    id: { name: "id" },
    subject: { name: "subject" },
    startTime: { name: "startTime" },
    endTime: { name: "endTime" },
    location: { name: "location" },
    school: { name: "school", idField: "_id" },
    schoolColor: { name: "schoolColor" },
    animator: { name: "animator" },
    description: { name: "description" },
    sessionStatus: { name: "sessionStatus" },
    site: { name: "site" },
    recurrenceRule: { name: "recurrenceRule" },
  };

  let scheduleObj = useRef(null);

  // Store state of checkboxes for school selection
  const [selectedSchools, setSelectedSchools] = useState(
    resourceData.map((resource) => resource.id)
  );

  const onChange = (args, resourceId) => {
    const isChecked = args.checked;
    setSelectedSchools((prevSelected) =>
      isChecked
        ? [...prevSelected, resourceId]
        : prevSelected.filter((id) => id !== resourceId)
    );
  };

  // Event template with colored background
  const eventTemplate = (props) => (
    <div
      style={{
        backgroundColor: props.schoolColor,
        padding: "5px",
        color: "white",
      }}
    >
      {props.subject}
    </div>
  );

  const eventSettings = {
    dataSource: extend([], sessionsList, null, true).map((session) => ({
      ...session,
      id: session.id || session._id, // Ensure `id` is mapped correctly
    })),
    template: eventTemplate,
    fields,
  };

  // Update schedule based on selected schools
  useEffect(() => {
    if (scheduleObj.current) { // Ensure scheduleObj.current is available
      let predicate = null;
      selectedSchools.forEach((schoolId) => {
        const newPredicate = new Predicate("school._id", "equal", schoolId);
        predicate = predicate ? predicate.or(newPredicate) : newPredicate;
      });
      scheduleObj.current.eventSettings.query = predicate
        ? new Query().where(predicate)
        : new Query();
    }
  }, [selectedSchools]);
  return isSessionsSuccess ? (
    <>
    <Academics />
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
        <PropertyPane title="Sites">
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

export default SitesPlannings;
