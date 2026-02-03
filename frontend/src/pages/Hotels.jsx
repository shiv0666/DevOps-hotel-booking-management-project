
import React, { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import API from '../services/api'
import HotelCard from '../components/HotelCard'

export default function Hotels() {
  const { user } = useContext(AuthContext)
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState(null)
  const nav = useNavigate()

  useEffect(() => {
    fetchHotels()
  }, [])

  const fetchHotels = async () => {
    try {
      const { data } = await API.get('/hotels')
      setHotels(data)
    } catch (e) {
      setErr(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h2>All Hotels</h2>
        <p className="small-muted">Browse and book your perfect stay.</p>
      </div>
      {loading && <div>Loading...</div>}
      {err && <div className="error">Error: {err}</div>}
      <div className="grid">
        {hotels.map(h => (
          <div key={h._id}>
            <HotelCard hotel={h} />
            {user && user.role === 'CUSTOMER' && (
              <button 
                className="btn"
                onClick={() => nav(`/create?hotelId=${h._id}`)}
                style={{ width: '100%', marginTop: '10px' }}
              >
                Book Now
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
