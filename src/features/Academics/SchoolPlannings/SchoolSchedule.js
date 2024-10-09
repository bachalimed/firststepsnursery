import React from 'react'
import {Inject, ScheduleComponent, Day, Week, WorkWeek, Month, Agenda } from '@syncfusion/ej2-react-schedule'
import SchoolPlannings from '../SchoolPlannings'
const schoolSchedule = () => {
  return (
    <>
    <SchoolPlannings/>
      <ScheduleComponent>

<Inject services={[Day, Week, WorkWeek, Month, Agenda]}/>







      </ScheduleComponent>

   
        </>
  )
}

export default schoolSchedule
