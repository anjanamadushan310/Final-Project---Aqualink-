import React from 'react'
import DashboardFooter from '../../components/common/DashboardFooter';

export default function CollectorDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <main className="flex-1 p-4 lg:p-8">
        <h1>CollectorDashboard</h1>
      </main>
      
      {/* Footer */}
      <DashboardFooter />
    </div>
  )
}
