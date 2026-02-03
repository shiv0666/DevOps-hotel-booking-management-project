
import React from 'react'

export default function HotelCard({ hotel }) {
  return (
    <div className="card hotel-card">
      <div className="hotel-image">
        <img src={hotel.image || 'https://via.placeholder.com/300x200?text=Hotel'} alt={hotel.name} />
      </div>
      <div className="hotel-info">
        <h3 className="hotel-title">{hotel.name}</h3>
        <div className="small-muted">{hotel.location}</div>
        <div className="rating">⭐⭐⭐⭐☆ (4.0)</div>
        <p>{hotel.description}</p>
        <div className="price">From ₹{hotel.roomTypes?.[0]?.price || 0} per night</div>
        <button className="btn">View Details</button>
      </div>
    </div>
  )
}
