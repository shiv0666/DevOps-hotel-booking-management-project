import React, { useState } from 'react'
import API from '../services/api'

export default function AddHotel() {
  const [form, setForm] = useState({
    name: '',
    location: '',
    description: '',
    roomTypes: [{ type: '', totalRooms: 1, price: 0 }]
  })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleRoomChange = (index, field, value) => {
    const newRoomTypes = [...form.roomTypes]
    newRoomTypes[index][field] = value
    setForm({ ...form, roomTypes: newRoomTypes })
  }

  const addRoomType = () => {
    setForm({ ...form, roomTypes: [...form.roomTypes, { type: '', totalRooms: 1, price: 0 }] })
  }

  const removeRoomType = (index) => {
    const newRoomTypes = form.roomTypes.filter((_, i) => i !== index)
    setForm({ ...form, roomTypes: newRoomTypes })
  }

  const submit = async (e) => {
    e.preventDefault()
    setMsg('')
    setLoading(true)
    try {
      const { data } = await API.post('/hotels', form)
      setMsg('Hotel added successfully!')
      setForm({
        name: '',
        location: '',
        description: '',
        roomTypes: [{ type: '', totalRooms: 1, price: 0 }]
      })
    } catch (err) {
      setMsg(err?.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Add New Hotel</h2>
        <p className="small-muted">Fill in the details to add a new hotel.</p>
        <form onSubmit={submit}>
          <div className="form-group">
            <label>Hotel Name *</label>
            <input name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input name="location" value={form.location} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} />
          </div>
          <div className="form-group">
            <label>Room Types *</label>
            {form.roomTypes.map((rt, index) => (
              <div key={index} style={{ border: '1px solid #ccc', padding: 8, marginBottom: 8 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input
                    placeholder="Type (e.g. Deluxe)"
                    value={rt.type}
                    onChange={(e) => handleRoomChange(index, 'type', e.target.value)}
                    required
                  />
                  <input
                    type="number"
                    placeholder="Total Rooms"
                    value={rt.totalRooms}
                    onChange={(e) => handleRoomChange(index, 'totalRooms', Number(e.target.value))}
                    min="1"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={rt.price}
                    onChange={(e) => handleRoomChange(index, 'price', Number(e.target.value))}
                    min="0"
                    required
                  />
                  {form.roomTypes.length > 1 && (
                    <button type="button" onClick={() => removeRoomType(index)}>Remove</button>
                  )}
                </div>
              </div>
            ))}
            <button type="button" onClick={addRoomType}>Add Room Type</button>
          </div>
          <button className="btn" type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add Hotel'}
          </button>
        </form>
        {msg && <div className="small-muted" style={{ marginTop: 16 }}>{msg}</div>}
      </div>
    </div>
  )
}
