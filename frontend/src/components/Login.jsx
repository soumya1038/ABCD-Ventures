import { useState } from 'react'
import axios from 'axios'
import './Login.css'

function Login({ onLogin, onRegister }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const response = await axios.post('http://localhost:8088/users/login', {
        username,
        password
      })
      
      localStorage.setItem('token', response.data.token)
      onLogin()
    } catch (error) {
      if (error.response && error.response.status === 403) {
        window.alert('You are already logged in on another device.')
      } else {
        window.alert('Invalid username/password')
      }
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Shopping Cart</h1>
        <h2>Login</h2>
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
          <button type="submit" className="btn-primary">Login</button>
        </form>
        <p className="register-link">
          Don't have an account? <span onClick={onRegister}>Register here</span>
        </p>
      </div>
    </div>
  )
}

export default Login
