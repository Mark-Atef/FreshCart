// src/hooks/useAddToCart.js
/** biome-ignore-all assist/source/organizeImports: <> */
//
// ════════════════════════════════════════════════════════════
// FIX Bug 3 — Add to cart when not logged in
//
// PROBLEM: CartContext's addToCart now throws { type: 'unauthorized' }
// when no token exists. Components previously caught this as a generic
// error and showed an error toast.
//
// SOLUTION: This hook wraps addToCart with auth-aware logic:
//   - If not logged in → redirect to /login with current path saved
//   - If logged in → add to cart normally
//   - All components replace their handleAddToCart with this hook
//
// USAGE in any component:
//   const handleAddToCart = useAddToCart()
//   await handleAddToCart(product._id)   // ← done
//
// The hook reads the current location automatically, so the user
// is redirected back to the correct page after login.
// ════════════════════════════════════════════════════════════

import { useCallback, useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { CartContext } from '../Context/CartContext'
import toast from 'react-hot-toast'

export function useAddToCart() {
  const { addToCart } = useContext(CartContext)
  const navigate = useNavigate()
  const location = useLocation()

  const handleAddToCart = useCallback(async (productId, productTitle = '') => {
    try {
      await addToCart(productId)
      const shortTitle = productTitle
        ? productTitle.split(' ').slice(0, 3).join(' ')
        : 'Item'
      toast.success(`${shortTitle} added to cart!`)
      return true
    } catch (err) {
      if (err?.type === 'unauthorized') {
        // Not logged in → redirect to login, save current page
        toast('Please log in to add items to your cart', {
          icon: '🔐',
          style: {
            background: '#fff8e1',
            color: '#f57c00',
            border: '1px solid rgba(245,124,0,0.2)',
            fontWeight: '600',
          },
          duration: 2500,
        })
        setTimeout(() => {
          navigate('/login', { state: { from: location.pathname } })
        }, 800) // short delay so user sees the toast before redirect
      } else {
        toast.error('Failed to add to cart. Please try again.')
      }
      return false
    }
  }, [addToCart, navigate, location.pathname])

  return handleAddToCart
}