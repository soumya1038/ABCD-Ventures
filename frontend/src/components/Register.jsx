import { useState } from 'react'
import axios from 'axios'
import './Login.css'

function Register({ onBack, onSuccess }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/users`, {
        username,
        password
      })
      
      window.alert('Registration successful! Please login.')
      onSuccess()
    } catch (error) {
      window.alert('Registration failed. Username may already exist.')
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Shopping Cart</h1>
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary">Register</button>
        </form>
        <p className="register-link">
          Already have an account? <span onClick={onBack}>Login here</span>
        </p>
      </div>
    </div>
  )
}

export default Register
