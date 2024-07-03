import React from 'react'
import DashboardStatsGrid from '../../Components/Shared/DashboardStatsGrid'
import PaymentPie from '../../Components/lib/PaymentPie'

const Dashboard = () => {
  return (
    <div className='flex flex-col gap-4'>
    
      <DashboardStatsGrid />
      <PaymentPie/>
      
      </div>
  )
}

export default Dashboard