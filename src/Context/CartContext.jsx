/* eslint-disable react-refresh/only-export-components */
import axios from 'axios'
import { createContext, useState } from 'react'

export const CartContext = createContext()

const BASE_URL = 'https://ecommerce.routemisr.com/api/v1/cart'

// Helper — always gets fresh token from localStorage
function getHeaders() {
  return { token: localStorage.getItem('token') }
}

export function CartContextProvider({ children }) {

  const [cartCount, setCartCount] = useState(0)
  const [cartLoading, setCartLoading] = useState(false)
  const [totalCartPrice, setTotalCartPrice] = useState(0)

  // ── Add product to cart ──
  async function addToCart(productId) {
    setCartLoading(true)
    try {
      const { data } = await axios.post(
        BASE_URL,
        { productId },
        { headers: getHeaders() }
      )
      // Update cart count from response
      setCartCount(data.numOfCartItems)
      return data
    } catch (err) {
      console.error('Add to cart failed:', err.response?.data?.message)
      throw err // re-throw so the component can show an error
    } finally {
      setCartLoading(false)
    }
  }

  // ── Get user's cart ──
  async function getCart() {
    try {
      const { data } = await axios.get(
        BASE_URL,
        { headers: getHeaders() }
      )
      setCartCount(data.numOfCartItems)
      return data
    } catch (err) {
      console.error('Get cart failed:', err.response?.data?.message)
      throw err
    }
  }

  // ── Remove product from cart ──
  async function removeFromCart(productId) {
    try {
      const { data } = await axios.delete(
        `${BASE_URL}/${productId}`,
        { headers: getHeaders() }
      )
      setCartCount(data.numOfCartItems)
      return data
    } catch (err) {
      console.error('Remove from cart failed:', err.response?.data?.message)
      throw err
    }
  }

  // ── Update product quantity ──
  async function updateQuantity(productId, count) {
    try {
      const { data } = await axios.put(
        `${BASE_URL}/${productId}`,
        { count },
        { headers: getHeaders() }
      )
      setCartCount(data.numOfCartItems)
      return data
    } catch (err) {
      console.error('Update quantity failed:', err.response?.data?.message)
      throw err
    }
  }

  // ── Clear entire cart ──
  async function clearCart() {
    try {
      const { data } = await axios.delete(
        BASE_URL,
        { headers: getHeaders() }
      )
      setCartCount(0)
      return data
    } catch (err) {
      console.error('Clear cart failed:', err.response?.data?.message)
      throw err
    }
  }

  return (
    <CartContext.Provider value={{
      addToCart,
      getCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount,
      cartLoading,
    }}>
      {children}
    </CartContext.Provider>
  )
}