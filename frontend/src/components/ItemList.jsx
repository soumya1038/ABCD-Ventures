import { useState, useEffect } from 'react'
import axios from 'axios'
import './ItemList.css'

function ItemList({ onLogout }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [cartCount, setCartCount] = useState(0)
  const [showCartModal, setShowCartModal] = useState(false)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [cartItems, setCartItems] = useState([])
  const [orders, setOrders] = useState([])
  const [flashMessage, setFlashMessage] = useState({ show: false, message: '', type: '' })

  useEffect(() => {
    fetchItems()
    fetchCartCount()
  }, [])

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:8088/items')
      setItems(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching items:', error)
      setLoading(false)
    }
  }

  const fetchCartCount = async () => {
    const token = localStorage.getItem('token')
    try {
      const response = await axios.get('http://localhost:8088/carts/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data.items) {
        const total = response.data.items.reduce((sum, item) => sum + item.quantity, 0)
        setCartCount(total)
      }
    } catch (error) {
      console.error('Error fetching cart count:', error)
    }
  }

  const showFlash = (message, type = 'success') => {
    setFlashMessage({ show: true, message, type })
    setTimeout(() => {
      setFlashMessage({ show: false, message: '', type: '' })
    }, 3000)
  }

  const addToCart = async (itemId) => {
    const token = localStorage.getItem('token')
    try {
      await axios.post(
        'http://localhost:8088/carts',
        { item_id: itemId, qty: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      showFlash('Item added to cart!')
      fetchCartCount()
    } catch (error) {
      showFlash('Failed to add item to cart', 'error')
    }
  }

  const viewCart = async () => {
    const token = localStorage.getItem('token')
    try {
      const response = await axios.get('http://localhost:8088/carts/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCartItems(response.data.items || [])
      setShowCartModal(true)
    } catch (error) {
      showFlash('Failed to fetch cart', 'error')
    }
  }

  const viewOrders = async () => {
    const token = localStorage.getItem('token')
    try {
      const response = await axios.get('http://localhost:8088/orders/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setOrders(response.data || [])
      setShowOrderModal(true)
    } catch (error) {
      showFlash('Failed to fetch orders', 'error')
    }
  }

  const checkout = async () => {
    const token = localStorage.getItem('token')
    try {
      await axios.post(
        'http://localhost:8088/orders',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      showFlash('Order successful!')
      fetchCartCount()
      setShowCartModal(false)
    } catch (error) {
      showFlash('Checkout failed. Make sure you have items in cart.', 'error')
    }
  }

  const handleLogout = async () => {
    const token = localStorage.getItem('token')
    try {
      await axios.post(
        'http://localhost:8088/users/logout',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
    } catch (error) {
      console.error('Logout error:', error)
    }
    onLogout()
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="item-list-container">
      {flashMessage.show && (
        <div className={`flash-message ${flashMessage.type}`}>
          {flashMessage.message}
        </div>
      )}

      <nav className="navbar">
        <h1>Shopping Cart</h1>
        <div className="nav-buttons">
          <button onClick={viewCart} className="btn-nav">
            Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
          <button onClick={viewOrders} className="btn-nav">Order History</button>
          <button onClick={checkout} className="btn-checkout">Checkout</button>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </nav>

      <div className="items-grid">
        {items.map(item => (
          <div key={item._id} className="item-card" onClick={() => addToCart(item._id)}>
            <div className="item-icon">🛍️</div>
            <h3>{item.name}</h3>
            <p className="item-price">₹{item.price}</p>
            <button className="btn-add">Add to Cart</button>
          </div>
        ))}
      </div>

      {showCartModal && (
        <div className="modal-overlay" onClick={() => setShowCartModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Your Cart</h2>
              <button className="modal-close" onClick={() => setShowCartModal(false)}>×</button>
            </div>
            <div className="modal-body">
              {cartItems.length > 0 ? (
                <div className="cart-items">
                  {cartItems.map((item, index) => (
                    <div key={index} className="cart-item">
                      <span>{item.itemId.name}</span>
                      <span>Qty: {item.quantity}</span>
                      <span>₹{item.itemId.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-message">Your cart is empty</p>
              )}
            </div>
          </div>
        </div>
      )}

      {showOrderModal && (
        <div className="modal-overlay" onClick={() => setShowOrderModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Order History</h2>
              <button className="modal-close" onClick={() => setShowOrderModal(false)}>×</button>
            </div>
            <div className="modal-body">
              {orders.length > 0 ? (
                <div className="order-list">
                  {orders.map((order) => (
                    <div key={order._id} className="order-item">
                      <div className="order-id">Order ID: {order._id}</div>
                      <div className="order-date">{new Date(order.createdAt).toLocaleDateString()}</div>
                      <div className="order-items">
                        {order.items.map((item, index) => (
                          <div key={index} className="order-item-detail">
                            {item.itemId.name} × {item.quantity}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-message">No orders found</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ItemList
