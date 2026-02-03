import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import API from '../services/api'

export default function CustomerDashboard() {
  const { user, logout } = useContext(AuthContext)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const nav = useNavigate()

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const { data } = await API.get('/bookings/my')
      setBookings(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
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

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Welcome, {user?.name}!</h2>
          <button className="btn" style={{ background: '#f44336' }} onClick={handleLogout}>
            Logout
          </button>
        </div>
        <p className="small-muted">Your booking requests and their status</p>
      </div>

      <div className="card">
        <button 
          className="btn" 
          onClick={() => nav('/hotels')}
          style={{ marginBottom: '20px' }}
        >
          Browse Hotels
        </button>
      </div>

      {loading && <div className="card">Loading your bookings...</div>}
      {error && <div className="card error">Error: {error}</div>}

      {!loading && bookings.length === 0 && (
        <div className="card">
          <p>No bookings yet. <button 
            style={{ background: 'none', border: 'none', color: '#2196f3', cursor: 'pointer', textDecoration: 'underline' }}
            onClick={() => nav('/hotels')}
          >
            Browse hotels
          </button> to create a booking request.</p>
        </div>
      )}

      {!loading && bookings.length > 0 && (
        <div>
          {bookings.map(booking => (
            <div key={booking._id} className="card" style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <h3>{booking.hotel?.name || 'Hotel'}</h3>
                  <p><strong>Room Type:</strong> {booking.roomType}</p>
                  <p><strong>Check-in:</strong> {new Date(booking.checkIn).toLocaleDateString()}</p>
                  <p><strong>Check-out:</strong> {new Date(booking.checkOut).toLocaleDateString()}</p>
                  <p><strong>Rooms:</strong> {booking.rooms}</p>
                  <p><strong>Price:</strong> ₹{booking.price}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div 
                    style={{
                      padding: '10px 20px',
                      borderRadius: '5px',
                      backgroundColor: getStatusColor(booking.status),
                      color: 'white',
                      fontWeight: 'bold',
                      marginBottom: '10px'
                    }}
                  >
                    {booking.status}
                  </div>
                  {booking.status === 'PENDING' && (
                    <p style={{ color: '#ff9800', fontSize: '12px' }}>Waiting for approval...</p>
                  )}
                  {booking.status === 'CONFIRMED' && (
                    <p style={{ color: '#4caf50', fontSize: '12px' }}>Your booking is confirmed!</p>
                  )}
                  {booking.status === 'REJECTED' && (
                    <p style={{ color: '#f44336', fontSize: '12px' }}>Your booking was rejected</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
