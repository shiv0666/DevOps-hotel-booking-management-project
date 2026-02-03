import React, { useState, useEffect } from 'react'
import API from '../services/api'
import { useNavigate } from 'react-router-dom'

export default function CreateBooking() {
  const [hotels, setHotels] = useState([])
  const [selectedHotel, setSelectedHotel] = useState('')
  const [roomType, setRoomType] = useState('Deluxe')
  const [rooms, setRooms] = useState(1)
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(1)
  const [price, setPrice] = useState(1000)
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  useEffect(() => {
    const loadHotels = async () => {
      try {
        const { data } = await API.get('/hotels')
        setHotels(data)
      } catch (err) {
        console.error('Failed to load hotels', err)
      }
    }
    loadHotels()
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await API.post('/bookings', {
        hotelId: selectedHotel,
        roomType,
        rooms,
        checkIn,
        checkOut,
        guests,
        price,
        contactInfo: { phone, notes }
      })
      nav('/bookings')
    } catch (err) {
      setError(err?.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Create Booking</h2>
        {error && <div className="error">{error}</div>}
        <form onSubmit={submit}>
          <div className="form-group">
            <label>Select Hotel</label>
            <select value={selectedHotel} onChange={e => setSelectedHotel(e.target.value)} required>
              <option value="">Choose a hotel</option>
              {hotels.map(h => <option key={h._id} value={h._id}>{h.name} - {h.location}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>Room Type</label>
            <select value={roomType} onChange={e => setRoomType(e.target.value)}>
              <option>Deluxe</option>
              <option>Suite</option>
              <option>Standard</option>
            </select>
          </div>

          <div className="form-group">
            <label>Rooms</label>
            <input type="number" min="1" value={rooms} onChange={e => setRooms(Number(e.target.value))} />
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Check-in</label>
              <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} required />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Check-out</label>
              <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} required />
            </div>
          </div>

          <div className="form-group">
            <label>Guests</label>
            <input type="number" min="1" value={guests} onChange={e => setGuests(Number(e.target.value))} />
          </div>

          <div className="form-group">
            <label>Price (total)</label>
            <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} />
          </div>

          <div className="form-group">
            <label>Contact Phone</label>
            <input value={phone} onChange={e => setPhone(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} />
          </div>

          <button className="btn" type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Booking'}
          </button>
        </form>
      </div>
    </div>
  )
}
