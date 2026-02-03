import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import API from '../services/api'

export default function StaffDashboard() {
  const { user, logout } = useContext(AuthContext)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionLoading, setActionLoading] = useState(null)
  const nav = useNavigate()

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const { data } = await API.get('/bookings/pending')
      setBookings(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const approveBooking = async (bookingId) => {
    try {
      setActionLoading(bookingId)
      await API.put(`/bookings/${bookingId}/approve`)
      // Refresh bookings
      fetchBookings()
    } catch (err) {
      alert('Error approving booking: ' + err.message)
    } finally {
      setActionLoading(null)
    }
  }

  const rejectBooking = async (bookingId) => {
    try {
      setActionLoading(bookingId)
      await API.put(`/bookings/${bookingId}/reject`)
      // Refresh bookings
      fetchBookings()
    } catch (err) {
      alert('Error rejecting booking: ' + err.message)
    } finally {
      setActionLoading(null)
    }
  }

  const handleLogout = () => {
    logout()
    nav('/login')
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'PENDING': return '#ff9800'
      case 'CONFIRMED': return '#4caf50'
      case 'REJECTED': return '#f44336'
      default: return '#2196f3'
    }
  }

  const pendingBookings = bookings.filter(b => b.status === 'PENDING')
  const processedBookings = bookings.filter(b => b.status !== 'PENDING')

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2>Staff Dashboard</h2>
            <p className="small-muted">Welcome, {user?.name}!</p>
          </div>
          <button className="btn" style={{ background: '#f44336' }} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {loading && <div className="card">Loading bookings...</div>}
      {error && <div className="card error">Error: {error}</div>}

      {!loading && (
        <>
          <div className="card">
            <h3>Pending Bookings ({pendingBookings.length})</h3>
            {pendingBookings.length === 0 && <p className="small-muted">No pending bookings</p>}
          </div>

          {pendingBookings.map(booking => (
            <div key={booking._id} className="card" style={{ marginBottom: '15px', borderLeft: '4px solid #ff9800' }}>
              <div>
                <h4>{booking.user?.name}</h4>
                <p><strong>Email:</strong> {booking.user?.email}</p>
                <p><strong>Room Type:</strong> {booking.roomType}</p>
                <p><strong>Rooms:</strong> {booking.rooms}</p>
                <p><strong>Check-in:</strong> {new Date(booking.checkIn).toLocaleDateString()}</p>
                <p><strong>Check-out:</strong> {new Date(booking.checkOut).toLocaleDateString()}</p>
                <p><strong>Guests:</strong> {booking.guests}</p>
                <p><strong>Price:</strong> ₹{booking.price}</p>
                {booking.contactInfo?.phone && <p><strong>Phone:</strong> {booking.contactInfo.phone}</p>}
                {booking.contactInfo?.notes && <p><strong>Notes:</strong> {booking.contactInfo.notes}</p>}
              </div>
              <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                <button 
                  className="btn" 
                  style={{ background: '#4caf50' }}
                  onClick={() => approveBooking(booking._id)}
                  disabled={actionLoading === booking._id}
                >
                  {actionLoading === booking._id ? 'Processing...' : 'Approve'}
                </button>
                <button 
                  className="btn" 
                  style={{ background: '#f44336' }}
                  onClick={() => rejectBooking(booking._id)}
                  disabled={actionLoading === booking._id}
                >
                  {actionLoading === booking._id ? 'Processing...' : 'Reject'}
                </button>
              </div>
            </div>
          ))}

          {processedBookings.length > 0 && (
            <>
              <div className="card">
                <h3>Processed Bookings ({processedBookings.length})</h3>
              </div>

              {processedBookings.map(booking => (
                <div key={booking._id} className="card" style={{ marginBottom: '15px', opacity: 0.8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <h4>{booking.user?.name}</h4>
                      <p><strong>Room Type:</strong> {booking.roomType}</p>
                      <p><strong>Check-in:</strong> {new Date(booking.checkIn).toLocaleDateString()}</p>
                      <p><strong>Check-out:</strong> {new Date(booking.checkOut).toLocaleDateString()}</p>
                    </div>
                    <div 
                      style={{
                        padding: '10px 20px',
                        borderRadius: '5px',
                        backgroundColor: getStatusColor(booking.status),
                        color: 'white',
                        fontWeight: 'bold',
                        height: 'fit-content'
                      }}
                    >
                      {booking.status}
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </>
      )}
    </div>
  )
}
