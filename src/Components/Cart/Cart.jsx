/** biome-ignore-all assist/source/organizeImports: intentional order */
import { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CartContext } from '../../Context/CartContext'
import toast from 'react-hot-toast'
import styles from './Cart.module.css'

// ── Skeleton Row ──
function SkeletonRow() {
  return (
    <div className={styles.skeletonRow}>
      <div className={styles.skeletonImg} />
      <div className={styles.skeletonInfo}>
        <div className={styles.skeletonLine} style={{ width: '60%', height: '14px' }} />
        <div className={styles.skeletonLine} style={{ width: '35%', height: '11px' }} />
        <div className={styles.skeletonLine} style={{ width: '25%', height: '18px' }} />
      </div>
      <div className={styles.skeletonLine} style={{ width: '80px', height: '36px', borderRadius: '10px' }} />
      <div className={styles.skeletonLine} style={{ width: '60px', height: '18px' }} />
    </div>
  )
}

// ── Cart Item Row ──
function CartItem({ item, onRemove, onUpdateQty }) {
  const [isUpdating, setIsUpdating] = useState(false)

  async function handleQtyChange(newCount) {
    if (newCount < 1) return
    setIsUpdating(true)
    try {
      await onUpdateQty(item.product._id, newCount)
    } catch {
      toast.error('Failed to update quantity')
    } finally {
      setIsUpdating(false)
    }
  }

  async function handleRemove() {
    try {
      await onRemove(item.product._id)
      toast.success('Item removed from cart')
    } catch {
      toast.error('Failed to remove item')
    }
  }

  return (
    <div className={styles.cartItem}>

      {/* Image */}
      <Link to={`/productDetailes/${item.product._id}`} className={styles.itemImageLink}>
        <img
          src={item.product.imageCover}
          alt={item.product.title}
          className={styles.itemImage}
        />
      </Link>

      {/* Info */}
      <div className={styles.itemInfo}>
        <Link to={`/productDetailes/${item.product._id}`} className={styles.itemTitle}>
          {item.product.title}
        </Link>
        <span className={styles.itemCategory}>{item.product.category?.name}</span>
        <span className={styles.itemUnitPrice}>{item.price} EGP each</span>
      </div>

      {/* Quantity Controls */}
      <div className={styles.qtyControls}>
        <button
          type="button"
          className={styles.qtyBtn}
          onClick={() => handleQtyChange(item.count - 1)}
          disabled={item.count <= 1 || isUpdating}
          aria-label="Decrease quantity"
        >
          <i className="fa-solid fa-minus" />
        </button>
        <span className={styles.qtyValue}>
          {isUpdating ? <i className="fa-solid fa-spinner fa-spin" /> : item.count}
        </span>
        <button
          type="button"
          className={styles.qtyBtn}
          onClick={() => handleQtyChange(item.count + 1)}
          disabled={isUpdating}
          aria-label="Increase quantity"
        >
          <i className="fa-solid fa-plus" />
        </button>
      </div>

      {/* Subtotal */}
      <div className={styles.itemSubtotal}>
        {(item.price * item.count).toLocaleString()} EGP
      </div>

      {/* Remove */}
      <button
        type="button"
        className={styles.removeBtn}
        onClick={handleRemove}
        aria-label="Remove item"
      >
        <i className="fa-solid fa-trash-can" />
      </button>

    </div>
  )
}

// ── Empty Cart ──
function EmptyCart() {
  return (
    <div className={styles.emptyCart}>
      <div className={styles.emptyIcon}>
        <i className="fa-solid fa-cart-shopping" />
      </div>
      <h2 className={styles.emptyTitle}>Your cart is empty</h2>
      <p className={styles.emptyText}>Looks like you haven't added anything yet. Start shopping!</p>
      <Link to="/products" className={styles.emptyBtn}>
        <i className="fa-solid fa-bag-shopping" /> Browse Products
      </Link>
    </div>
  )
}

// ── Main Cart Page ──
export default function Cart() {

  const { getCart, removeFromCart, updateQuantity, clearCart } = useContext(CartContext)
  const navigate = useNavigate()

  const [cartData, setCartData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isClearing, setIsClearing] = useState(false)

  // ── Fetch cart on mount ──
  useEffect(() => {
    async function loadCart() {
      try {
        const data = await getCart()
        setCartData(data)
      } catch {
        toast.error('Failed to load cart')
      } finally {
        setIsLoading(false)
      }
    }
    loadCart()
  }, [])

  // ── Remove item and refresh ──
  async function handleRemove(productId) {
    const data = await removeFromCart(productId)
    setCartData(data)
  }

  // ── Update quantity and refresh ──
  async function handleUpdateQty(productId, count) {
    const data = await updateQuantity(productId, count)
    setCartData(data)
  }

  // ── Clear entire cart ──
  async function handleClearCart() {
    setIsClearing(true)
    try {
      await clearCart()
      setCartData(null)
      toast.success('Cart cleared')
    } catch {
      toast.error('Failed to clear cart')
    } finally {
      setIsClearing(false)
    }
  }

  const items = cartData?.data?.products ?? []
  const totalPrice = cartData?.data?.totalCartPrice ?? 0
  const numItems = cartData?.numOfCartItems ?? 0

  return (
    <section className={styles.section}>

      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>My Cart</h1>
          <p className={styles.pageSubtitle}>
            {isLoading ? 'Loading...' : numItems > 0 ? `${numItems} item${numItems > 1 ? 's' : ''} in your cart` : 'Your cart is empty'}
          </p>
        </div>
        {!isLoading && items.length > 0 && (
          <button
            type="button"
            className={styles.clearBtn}
            onClick={handleClearCart}
            disabled={isClearing}
          >
            {isClearing
              ? <><i className="fa-solid fa-spinner fa-spin" /> Clearing...</>
              : <><i className="fa-solid fa-trash" /> Clear Cart</>
            }
          </button>
        )}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className={styles.cartGrid}>
          <div className={styles.itemsList}>
            {[1, 2, 3].map(i => <SkeletonRow key={i} />)}
          </div>
        </div>
      )}

      {/* Empty */}
      {!isLoading && items.length === 0 && <EmptyCart />}

      {/* Cart Items */}
      {!isLoading && items.length > 0 && (
        <div className={styles.cartGrid}>

          {/* Left — Items */}
          <div className={styles.itemsList}>

            {/* Column headers */}
            <div className={styles.listHeader}>
              <span>Product</span>
              <span className={styles.headerQty}>Quantity</span>
              <span className={styles.headerTotal}>Subtotal</span>
              <span />
            </div>

            {items.map(item => (
              <CartItem
                key={item.product._id}
                item={item}
                onRemove={handleRemove}
                onUpdateQty={handleUpdateQty}
              />
            ))}
          </div>

          {/* Right — Order Summary */}
          <div className={styles.summary}>

            <h2 className={styles.summaryTitle}>Order Summary</h2>

            <div className={styles.summaryRows}>
              <div className={styles.summaryRow}>
                <span>Subtotal ({numItems} items)</span>
                <span>{totalPrice.toLocaleString()} EGP</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Delivery fee</span>
                <span className={totalPrice >= 200 ? styles.free : ''}>
                  {totalPrice >= 200 ? 'FREE' : '30 EGP'}
                </span>
              </div>
              {totalPrice < 200 && (
                <div className={styles.freeShippingNote}>
                  <i className="fa-solid fa-truck-fast" />
                  Add {(200 - totalPrice).toLocaleString()} EGP more for free delivery
                </div>
              )}
            </div>

            <div className={styles.summaryDivider} />

            <div className={styles.summaryTotal}>
              <span>Total</span>
              <span>{(totalPrice + (totalPrice >= 200 ? 0 : 30)).toLocaleString()} EGP</span>
            </div>

            <button
              type="button"
              className={styles.checkoutBtn}
              onClick={() => navigate('/checkout')}
            >
              <i className="fa-solid fa-lock" /> Proceed to Checkout
            </button>

            <Link to="/products" className={styles.continueLink}>
              <i className="fa-solid fa-arrow-left" /> Continue Shopping
            </Link>

            {/* Accepted payments */}
            <div className={styles.paymentMethods}>
              <p className={styles.paymentLabel}>We accept</p>
              <div className={styles.paymentIcons}>
                <i className="fab fa-cc-visa" />
                <i className="fab fa-cc-mastercard" />
                <i className="fab fa-cc-paypal" />
                <i className="fab fa-apple-pay" />
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  )
}