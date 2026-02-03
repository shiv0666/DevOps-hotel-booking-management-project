import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function AdminDashboard() {
  const { user, logout } = useContext(AuthContext)
  const [activeTab, setActiveTab] = useState('overview')
  const nav = useNavigate()

  const handleLogout = () => {
    logout()
    nav('/login')
  }

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2>Admin Dashboard</h2>
            <p className="small-muted">Welcome, {user?.name}!</p>
          </div>
          <button className="btn" style={{ background: '#f44336' }} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button 
            className="btn"
            style={{ background: activeTab === 'overview' ? '#2196f3' : '#ccc' }}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className="btn"
            style={{ background: activeTab === 'hotels' ? '#2196f3' : '#ccc' }}
            onClick={() => setActiveTab('hotels')}
          >
            Manage Hotels
          </button>
          <button 
            className="btn"
            style={{ background: activeTab === 'staff' ? '#2196f3' : '#ccc' }}
            onClick={() => setActiveTab('staff')}
          >
            Manage Staff
          </button>
          <button 
            className="btn"
            style={{ background: activeTab === 'bookings' ? '#2196f3' : '#ccc' }}
            onClick={() => setActiveTab('bookings')}
          >
            All Bookings
          </button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="card">
          <h3>Admin Overview</h3>
          <p>You have full control over the system:</p>
          <ul style={{ marginLeft: '20px' }}>
            <li>Add and manage hotels</li>
            <li>Add and manage staff accounts</li>
            <li>View all bookings across all hotels</li>
            <li>Monitor system activity</li>
          </ul>
        </div>
      )}

      {activeTab === 'hotels' && (
        <div className="card">
          <h3>Manage Hotels</h3>
          <button 
            className="btn"
            onClick={() => nav('/add-hotel')}
            style={{ marginBottom: '20px' }}
          >
            Add New Hotel
          </button>
          <p className="small-muted">Navigate to /add-hotel page to create hotels</p>
        </div>
      )}

      {activeTab === 'staff' && (
        <div className="card">
          <h3>Create Staff Account</h3>
          <p>Use the API endpoint <code>POST /api/auth/create-staff</code> to create staff accounts.</p>
          <p>Include:</p>
          <ul style={{ marginLeft: '20px' }}>
            <li>name: Staff member's name</li>
            <li>email: Staff email</li>
            <li>password: Staff password</li>
            <li>hotelId: Hotel ID to assign staff to</li>
          </ul>
          <p style={{ marginTop: '20px', fontStyle: 'italic' }}>
            Staff can only see and manage bookings for their assigned hotel.
          </p>
        </div>
      )}

      {activeTab === 'bookings' && (
        <div className="card">
          <h3>View All Bookings</h3>
          <p>Use the API endpoint <code>GET /api/bookings</code> (with admin token) to view all bookings in the system.</p>
          <p>This gives you a complete overview of all booking requests and their statuses.</p>
        </div>
      )}
    </div>
  )
}
