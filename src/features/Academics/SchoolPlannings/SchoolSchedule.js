import { useEffect, useRef } from "react";
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
import { SidebarComponent } from '@syncfusion/ej2-react-navigations';
import { extend } from "@syncfusion/ej2-base";
import { DateTimePickerComponent } from "@syncfusion/ej2-react-calendars";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
import SchoolPlannings from "../SchoolPlannings";
import { DataArray } from "../../../config/SampleSchedule";
const SchoolSchedule = () => {
  const data = extend([], DataArray, null, true);
  const eventSettings = { dataSource: data };
  const timeScale = { enable: true, interval: 60, slotCount: 4 };
  const workingDays = [1, 2, 3, 4, 5, 6];
  //   const workHours = {
  //     highlight: true, start: '06:30', end: '17:30'
  //   };


 



  return (
    <>
      <SchoolPlannings />

      <ScheduleComponent
        width="100%"
        height="650px"
        electedDate={new Date(2024, 10, 10)}
        //enableAdaptiveUI={true}
        eventSettings={eventSettings}
        timeScale={timeScale}
        showTimeIndicator={true}
        workDays={workingDays} //set customised workdays
        //workHours={workHours}
        startHour="07:00"
        endHour="18:00"
        //enablePersistence={true}//save the current view and selected date in local storage
      >
        <ViewsDirective>
          <ViewDirective option="TimelineDay" />
          <ViewDirective option="Day" />
          <ViewDirective option="Week" />

          <ViewDirective option="WorkWeek" />
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
          ]}
        />
      </ScheduleComponent>
    </>
  );
};

export default SchoolSchedule;
