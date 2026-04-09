/* eslint-disable react-refresh/only-export-components */
/** biome-ignore-all assist/source/organizeImports: <> */
import axios from 'axios'
import { createContext, useState, useEffect, useCallback } from 'react'

export const CartContext = createContext()

const BASE_URL = 'https://ecommerce.routemisr.com/api/v1/cart'

// Helper — always gets fresh token from localStorage at call time
function getHeaders() {
  return { token: localStorage.getItem('token') }
}

export function CartContextProvider({ children }) {

  const [cartCount, setCartCount] = useState(0)
  const [cartLoading, setCartLoading] = useState(false)

  const addToCart = useCallback(async (productId) => {
    // FIX: Check token BEFORE API call — redirect handled by caller
    const token = localStorage.getItem('token')
    if (!token) {
      const err = new Error('Login required')
      err.type = 'unauthorized'
      throw err
    }

    setCartLoading(true)
    try {
      const { data } = await axios.post(
        BASE_URL,
        { productId },
        { headers: getHeaders() }
      )
      setCartCount(data.numOfCartItems)
      return data
    } catch (err) {
      console.error('Add to cart failed:', err.response?.data?.message)
      throw err
    } finally {
      setCartLoading(false)
    }
  }, []) // ← stable forever — getHeaders reads localStorage, not state

  const getCart = useCallback(async () => {
    try {
      const { data } = await axios.get(BASE_URL, { headers: getHeaders() })
      setCartCount(data.numOfCartItems)
      return data
    } catch (err) {
      console.error('Get cart failed:', err.response?.data?.message)
      throw err
    }
  }, []) // ← stable forever

  const removeFromCart = useCallback(async (productId) => {
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
  }, []) // ← stable forever

  const updateQuantity = useCallback(async (productId, count) => {
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
  }, []) // ← stable forever

  const clearCart = useCallback(async () => {
    try {
      const { data } = await axios.delete(BASE_URL, { headers: getHeaders() })
      setCartCount(0)
      return data
    } catch (err) {
      console.error('Clear cart failed:', err.response?.data?.message)
      throw err
    }
  }, []) // ← stable forever

  // FIX for Bug 4 — reset cart count on logout
  // Called by Navbar when user logs out
  const resetCart = useCallback(() => {
    setCartCount(0)
  }, [])

  // ── Silent startup cart load ──
  // Loads cart count once on app mount if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    async function loadInitialCart() {
      try {
        const { data } = await axios.get(BASE_URL, { headers: getHeaders() })
        setCartCount(data.numOfCartItems ?? 0)
      } catch {
        // Silently fail — user sees 0 badge, not a crash
      }
    }

    loadInitialCart()
  }, [])

  return (
    <CartContext.Provider value={{
      addToCart,
      getCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      resetCart,   // ← exposed for Navbar logout
      cartCount,
      cartLoading,
    }}>
      {children}
    </CartContext.Provider>
  )
}