import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useContext(AuthContext)
  
  if (loading) return <div className="container">Loading...</div>
  if (!user) return <Navigate to="/login" replace />
  
  // If a specific role is required, check it
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />
  }
  
  return children
}

