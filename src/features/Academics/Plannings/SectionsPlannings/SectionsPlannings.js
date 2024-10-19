import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  ScheduleComponent,
  ViewsDirective,
  ViewDirective,
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
import { SidebarComponent } from "@syncfusion/ej2-react-navigations";
import { extend } from "@syncfusion/ej2-base";
import { DateTimePickerComponent } from "@syncfusion/ej2-react-calendars";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";

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

const SectionsPlannings = () => {
  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);
  // Function to convert Syncfusion array format [year, month, day, hour, minute] to Date object
  const convertToDate = (dateString) => {
    if (dateString !== "") {
      return new Date(dateString); // Month is 0-based
    }
    return null;
  };
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

    //dispatch(setStudents(studentsList)); //timing issue to update the state and use it the same time
    console.log(sessionsList, "sessionsList");
  }

  // //to get the location depending on site
  //   const getLocation = (session)=>{
  //     if(session?.site==="School"){ return session.school.schoolName }

  // return session

  //   }
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
  };

  // let datadata = [
  //   {
  //     id: 1,
  //     subject: "Explosion of Betelgeuse Star",
  //     startTime: new Date(2024, 9, 13, 10, 0),
  //     endTime: new Date(2024, 9, 13, 11, 0),
  //     isReadOnly:false,
  //     isBlock:false,
  //   },
  //   {
  //       id: 2,
  //       subject: "Thule Air Crash Report",
  //       startTime: new Date(2024, 9, 13, 12, 0),
  //       endTime: new Date(2024, 9, 13, 14, 0),
  //       isReadOnly:false,
  //       isBlock:false,
  //   },
  //   {
  //     id: 3,
  //     subject: "Blue Moon Eclipse",
  //     startTime: new Date(2024, 9, 13, 9, 30),
  //     endTime: new Date(2024, 9, 13, 11, 0),
  //     isReadOnly:false,
  //     isBlock:false,
  //   },
  // ];
  // console.log(datadata,'datadata')

  // Map over sessionsList to transform startTime and endTime to Date objects

  // datadata.map((dat)=>{
  //     sessionsList.push(dat)
  // })

  console.log(sessionsList, "sessionsList");

  const data = extend([], sessionsList, null, true);
  const eventSettings = {
    dataSource: data,
    fields: fields,
  //   template: eventTemplate,
  };
  const timeScale = { enable: true, interval: 120, slotCount: 4 };
  const workingDays = [1, 2, 3, 4, 5, 6];
  //   const workHours = {
  //     highlight: true, start: '06:30', end: '17:30'
  //   };

  if (isSessionsSuccess) {
    return (
      <>
        <Plannings />

        <ScheduleComponent
          width="100%"
          height="650px"
          selectedDate={new Date(2024, 9, 14)}
          //enableAdaptiveUI={true}
          eventSettings={eventSettings}
          timeScale={timeScale}
          //showTimeIndicator={true}
          workDays={workingDays} //set customised workdays
          //workHours={workHours}
          startHour="07:00"
          endHour="18:00"
          //enablePersistence={true}//save the current view and selected date in local storage
        >
          <ViewsDirective>
            <ViewDirective option="TimelineDay" />
            {/* <ViewDirective option="Day" />
            <ViewDirective option="Week" />

            <ViewDirective option="WorkWeek" />
            <ViewDirective option="Agenda" /> */}
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
      </>
    );
  }
};

export default SectionsPlannings;
