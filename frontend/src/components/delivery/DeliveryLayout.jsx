import { Routes, Route } from 'react-router-dom'
import DeliverySidebar from './DeliverySidebar'
import DeliveryTopBar from './DeliveryTopBar'
import DeliveryDashboard from '../../pages/delivery/DeliveryDashboard'
import Orders from '../../pages/delivery/Orders'
import DeliveryPlanning from '../../pages/delivery/DeliveryPlanning'
import DeliverySettings from '../../pages/delivery/DeliverySettings'

export default function DeliveryLayout() {
  return (
    <div className="flex h-screen bg-surface">
      <DeliverySidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DeliveryTopBar />
        <main className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route path="/" element={<DeliveryDashboard />} />
            <Route path="/bestellingen" element={<Orders />} />
            <Route path="/planning" element={<DeliveryPlanning />} />
            <Route path="/instellingen" element={<DeliverySettings />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
