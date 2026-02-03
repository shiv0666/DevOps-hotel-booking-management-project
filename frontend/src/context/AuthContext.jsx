
import React, { createContext, useState, useEffect } from 'react'
import API from '../services/api'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`
      // You can optionally fetch user profile here
      const userData = localStorage.getItem('user')
      if (userData) {
        setUser(JSON.parse(userData))
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password })
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data))
    API.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
    setUser(data)
    return data
  }

  const register = async (name, email, password, role = 'CUSTOMER') => {
    const { data } = await API.post('/auth/register', { name, email, password, role })
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data))
    API.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
    setUser(data)
    return data
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete API.defaults.headers.common['Authorization']
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
