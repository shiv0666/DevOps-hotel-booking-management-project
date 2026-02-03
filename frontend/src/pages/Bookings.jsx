import React, { useEffect, useState } from 'react'
import API from '../services/api'

export default function Bookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const { data } = await API.get('/bookings/my')
        setBookings(data)
      } catch (err) {
        setError(err?.response?.data?.message || err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <div className="container">Loading...</div>
  if (error) return <div className="container"><div className="error">{error}</div></div>

  return (
    <div className="container">
      <div className="card">
        <h2>My Bookings</h2>
        <p className="small-muted">Manage your hotel reservations.</p>
      </div>
      {bookings.length === 0 && <div className="card small-muted">No bookings yet — create one.</div>}
      {bookings.map(b => (
        <div key={b._id} className="card">
          <div><strong>{b.roomType}</strong> — {b.rooms} room(s)</div>
          <div className="small-muted">
            {new Date(b.checkIn).toLocaleDateString()} → {new Date(b.checkOut).toLocaleDateString()}
          </div>
          <div>Guests: {b.guests} | Price: ₹{b.price}</div>
          <div className="small-muted">Status: {b.status}</div>
        </div>
      ))}
    </div>
  )
}
