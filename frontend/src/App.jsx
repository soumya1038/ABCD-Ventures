import { useState, useEffect } from 'react'
import Login from './components/Login'
import Register from './components/Register'
import ItemList from './components/ItemList'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showRegister, setShowRegister] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setIsLoggedIn(true)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsLoggedIn(false)
  }

  if (!isLoggedIn) {
    if (showRegister) {
      return <Register onBack={() => setShowRegister(false)} onSuccess={() => setShowRegister(false)} />
    }
    return <Login onLogin={() => setIsLoggedIn(true)} onRegister={() => setShowRegister(true)} />
  }

  return <ItemList onLogout={handleLogout} />
}

export default App
