
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Hotels from './pages/Hotels'
import Login from './pages/Login'
import Signup from './pages/Signup'
import CreateBooking from './pages/CreateBooking'
import CustomerDashboard from './pages/CustomerDashboard'
import StaffDashboard from './pages/StaffDashboard'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <div>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Customer Routes */}
          <Route path="/create" element={<ProtectedRoute requiredRole="CUSTOMER"><CreateBooking /></ProtectedRoute>} />
          <Route path="/customer/dashboard" element={<ProtectedRoute requiredRole="CUSTOMER"><CustomerDashboard /></ProtectedRoute>} />
          
          {/* Staff Routes */}
          <Route path="/staff/dashboard" element={<ProtectedRoute requiredRole="STAFF"><StaffDashboard /></ProtectedRoute>} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
