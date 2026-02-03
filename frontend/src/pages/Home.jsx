
import React, { useEffect, useState } from 'react'
import API from '../services/api'
import HotelCard from '../components/HotelCard'

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const { data } = await API.get('/hotels')
        setFeatured(data.slice(0, 4))
      } catch (e) {
        console.warn(e)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <div className="container">
      <div className="hero">
        <h1>Welcome to Hotel Booking System</h1>
        <p className="small-muted">Find and book the perfect hotel for your stay.</p>
      </div>
      <div className="card">
        <h2>Featured Hotels</h2>
        {loading && <div>Loading...</div>}
        <div className="grid">
          {featured.map(h => <HotelCard key={h._id} hotel={h} />)}
        </div>
      </div>
    </div>
  )
}
