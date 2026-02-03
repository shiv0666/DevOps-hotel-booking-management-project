import React, { useState } from 'react'
import API from '../services/api'
import HotelCard from '../components/HotelCard'

export default function Search() {
  const [filters, setFilters] = useState({
    location: '',
    roomType: '',
    minPrice: '',
    maxPrice: '',
    checkIn: '',
    checkOut: ''
  })
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  const handleChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value })

  const search = async (e) => {
    e?.preventDefault()
    setMsg('')
    setLoading(true)
    try {
      const params = {}
      Object.keys(filters).forEach(k => {
        if (filters[k]) params[k] = filters[k]
      })
      const { data } = await API.get('/hotels', { params })
      setHotels(data)
      if (data.length === 0) setMsg('No hotels found for these filters.')
    } catch (err) {
      setMsg(err?.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Search Hotels</h2>
        <p className="small-muted">Find the perfect hotel with advanced filters.</p>
        <form onSubmit={search}>
          <div className="form-group">
            <label>Location</label>
            <input name="location" value={filters.location} onChange={handleChange} placeholder="e.g. Mumbai" />
          </div>
          <div className="form-group">
            <label>Room Type</label>
            <select name="roomType" value={filters.roomType} onChange={handleChange}>
              <option value="">Any</option>
              <option>Deluxe</option>
              <option>Suite</option>
              <option>Standard</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Check-in</label>
              <input type="date" name="checkIn" value={filters.checkIn} onChange={handleChange} />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Check-out</label>
              <input type="date" name="checkOut" value={filters.checkOut} onChange={handleChange} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div className="form-group">
              <label>Min Price</label>
              <input name="minPrice" value={filters.minPrice} onChange={handleChange} type="number" placeholder="0" />
            </div>
            <div className="form-group">
              <label>Max Price</label>
              <input name="maxPrice" value={filters.maxPrice} onChange={handleChange} type="number" placeholder="10000" />
            </div>
          </div>
          <button className="btn" type="submit" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      <div style={{ marginTop: 16 }}>
        {msg && <div className="small-muted">{msg}</div>}
        <div className="grid">
          {hotels.map(h => (
            <HotelCard key={h._id} hotel={h} checkIn={filters.checkIn} checkOut={filters.checkOut} />
          ))}
        </div>
      </div>
    </div>
  )
}
