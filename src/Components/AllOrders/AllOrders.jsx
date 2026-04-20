/** biome-ignore-all assist/source/organizeImports: intentional order */
import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'
import styles from './AllOrders.module.css'

// ── Fetch function — OUTSIDE component for stable reference ──
async function fetchUserOrders(userId) {
  const { data } = await axios.get(
    `https://ecommerce.routemisr.com/api/v1/orders/user/${userId}`
  )
  return data
}

// ── Status Badge ──
// Shows paid/unpaid and delivered/pending statuses
function StatusBadge({ isPaid, isDelivered }) {
  return (
    <div className={styles.statusRow}>
      <span className={`${styles.badge} ${isPaid ? styles.badgePaid : styles.badgeUnpaid}`}>
        <i className={`fa-solid ${isPaid ? 'fa-circle-check' : 'fa-clock'}`} />
        {isPaid ? 'Paid' : 'Unpaid'}
      </span>
      <span className={`${styles.badge} ${isDelivered ? styles.badgeDelivered : styles.badgePending}`}>
        <i className={`fa-solid ${isDelivered ? 'fa-truck-fast' : 'fa-hourglass-half'}`} />
        {isDelivered ? 'Delivered' : 'Processing'}
      </span>
    </div>
  )
}

// ── Order Card ──
function OrderCard({ order, index }) {
  const [expanded, setExpanded] = useState(false)

  // Format date like "Apr 20, 2026 · 10:55 PM"
  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleString('en-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const previewItems = order.cartItems.slice(0, 3)
  const remainingCount = order.cartItems.length - 3

  return (
    <div
      className={styles.orderCard}
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      {/* ── Card Header ── */}
      <div className={styles.cardHeader}>
        <div className={styles.orderMeta}>
          <div className={styles.orderIdRow}>
            <span className={styles.orderIdLabel}>Order</span>
            <span className={styles.orderId}>#{order.id}</span>
          </div>
          <span className={styles.orderDate}>
            <i className="fa-regular fa-calendar" />
            {formatDate(order.createdAt)}
          </span>
        </div>

        <StatusBadge isPaid={order.isPaid} isDelivered={order.isDelivered} />
      </div>

      {/* ── Product Previews ── */}
      <div className={styles.itemsPreview}>
        {previewItems.map(item => (
          <div key={item._id} className={styles.previewItem}>
            <div className={styles.previewImg}>
              <img
                src={item.product.imageCover}
                alt={item.product.title}
                loading="lazy"
              />
            </div>
            <div className={styles.previewInfo}>
              <p className={styles.previewTitle}>{item.product.title}</p>
              <div className={styles.previewMeta}>
                <span className={styles.previewBrand}>{item.product.brand?.name}</span>
                <span className={styles.previewDot}>·</span>
                <span className={styles.previewQty}>Qty: {item.count}</span>
                <span className={styles.previewDot}>·</span>
                <span className={styles.previewPrice}>{item.price.toLocaleString()} EGP</span>
              </div>
              <span className={styles.previewCategory}>{item.product.category?.name}</span>
            </div>
          </div>
        ))}

        {/* Show "N more items" if more than 3 */}
        {remainingCount > 0 && !expanded && (
          <button
            type="button"
            className={styles.showMoreBtn}
            onClick={() => setExpanded(true)}
          >
            <i className="fa-solid fa-plus" />
            {remainingCount} more item{remainingCount > 1 ? 's' : ''}
          </button>
        )}

        {/* Expanded items */}
        {expanded && order.cartItems.slice(3).map(item => (
          <div key={item._id} className={`${styles.previewItem} ${styles.previewItemExtra}`}>
            <div className={styles.previewImg}>
              <img src={item.product.imageCover} alt={item.product.title} loading="lazy" />
            </div>
            <div className={styles.previewInfo}>
              <p className={styles.previewTitle}>{item.product.title}</p>
              <div className={styles.previewMeta}>
                <span className={styles.previewBrand}>{item.product.brand?.name}</span>
                <span className={styles.previewDot}>·</span>
                <span className={styles.previewQty}>Qty: {item.count}</span>
                <span className={styles.previewDot}>·</span>
                <span className={styles.previewPrice}>{item.price.toLocaleString()} EGP</span>
              </div>
              <span className={styles.previewCategory}>{item.product.category?.name}</span>
            </div>
          </div>
        ))}

        {expanded && remainingCount > 0 && (
          <button
            type="button"
            className={styles.showLessBtn}
            onClick={() => setExpanded(false)}
          >
            <i className="fa-solid fa-chevron-up" /> Show less
          </button>
        )}
      </div>

      {/* ── Card Footer ── */}
      <div className={styles.cardFooter}>
        <div className={styles.footerLeft}>
          <div className={styles.shippingInfo}>
            <i className="fa-solid fa-location-dot" />
            <span>{order.shippingAddress.city} — {order.shippingAddress.phone}</span>
          </div>
          <div className={styles.paymentMethod}>
            <i className={`fa-solid ${order.paymentMethodType === 'card' ? 'fa-credit-card' : 'fa-money-bill-wave'}`} />
            <span>{order.paymentMethodType === 'card' ? 'Card Payment' : 'Cash on Delivery'}</span>
          </div>
        </div>

        <div className={styles.totalBox}>
          <span className={styles.totalLabel}>{order.cartItems.length} item{order.cartItems.length > 1 ? 's' : ''}</span>
          <span className={styles.totalAmount}>{order.totalOrderPrice.toLocaleString()} EGP</span>
        </div>
      </div>
    </div>
  )
}

// ── Skeleton Card ──
function OrderSkeleton({ index }) {
  return (
    <div className={styles.skeletonCard} style={{ animationDelay: `${index * 0.06}s` }}>
      <div className={styles.skeletonHeader}>
        <div className={styles.skeletonBlock} style={{ width: '120px', height: '20px' }} />
        <div className={styles.skeletonBlock} style={{ width: '160px', height: '16px' }} />
      </div>
      {[1, 2].map(i => (
        <div key={i} className={styles.skeletonItem}>
          <div className={styles.skeletonImg} />
          <div className={styles.skeletonItemInfo}>
            <div className={styles.skeletonBlock} style={{ width: '70%', height: '14px' }} />
            <div className={styles.skeletonBlock} style={{ width: '40%', height: '11px', marginTop: '6px' }} />
          </div>
        </div>
      ))}
      <div className={styles.skeletonFooter}>
        <div className={styles.skeletonBlock} style={{ width: '150px', height: '14px' }} />
        <div className={styles.skeletonBlock} style={{ width: '90px', height: '22px' }} />
      </div>
    </div>
  )
}

// ── Empty State ──
function EmptyOrders() {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyIcon}>
        <i className="fa-solid fa-bag-shopping" />
      </div>
      <h2 className={styles.emptyTitle}>No orders yet</h2>
      <p className={styles.emptyText}>
        You haven't placed any orders yet. Start shopping and your orders will appear here.
      </p>
      <Link to="/products" className={styles.emptyBtn}>
        <i className="fa-solid fa-bag-shopping" /> Start Shopping
      </Link>
    </div>
  )
}

// ── Main AllOrders Page ──
export default function AllOrders() {

  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  // ── Load orders using jwt-decode to get user ID ──
  const loadOrders = useCallback(async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        navigate('/login')
        return
      }

      // Decode token client-side to get user ID
      // No API call needed — just read the payload
      const decoded = jwtDecode(token)
      const userId = decoded.id

      const data = await fetchUserOrders(userId)
      // API returns array sorted by newest first already
      setOrders(data)
    } catch {
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }, [navigate])

  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  // ── Summary stats ──
  const totalSpent = orders.reduce((sum, o) => sum + o.totalOrderPrice, 0)
  const paidCount = orders.filter(o => o.isPaid).length
  const deliveredCount = orders.filter(o => o.isDelivered).length

  return (
    <section className={styles.section}>

      {/* ── Page Header ── */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>My Orders</h1>
          <p className={styles.pageSubtitle}>
            {isLoading
              ? 'Loading your orders...'
              : orders.length > 0
                ? `${orders.length} order${orders.length > 1 ? 's' : ''} in your history`
                : 'No orders placed yet'
            }
          </p>
        </div>
        <Link to="/products" className={styles.shopMoreBtn}>
          <i className="fa-solid fa-bag-shopping" /> Shop More
        </Link>
      </div>

      {/* ── Stats Row — only when orders exist ── */}
      {!isLoading && orders.length > 0 && (
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: 'rgba(76,175,80,0.1)' }}>
              <i className="fa-solid fa-receipt" style={{ color: '#2e7d32' }} />
            </div>
            <div>
              <p className={styles.statValue}>{orders.length}</p>
              <p className={styles.statLabel}>Total Orders</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: 'rgba(33,150,243,0.1)' }}>
              <i className="fa-solid fa-circle-check" style={{ color: '#1976d2' }} />
            </div>
            <div>
              <p className={styles.statValue}>{paidCount}</p>
              <p className={styles.statLabel}>Paid</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: 'rgba(245,166,35,0.12)' }}>
              <i className="fa-solid fa-truck-fast" style={{ color: '#f57c00' }} />
            </div>
            <div>
              <p className={styles.statValue}>{deliveredCount}</p>
              <p className={styles.statLabel}>Delivered</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: 'rgba(156,39,176,0.1)' }}>
              <i className="fa-solid fa-wallet" style={{ color: '#7b1fa2' }} />
            </div>
            <div>
              <p className={styles.statValue}>{totalSpent.toLocaleString()}</p>
              <p className={styles.statLabel}>EGP Spent</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Error ── */}
      {isError && (
        <div className={styles.errorBox}>
          <i className="fa-solid fa-circle-exclamation" />
          <div>
            <p>Failed to load your orders.</p>
            <button type="button" className={styles.retryBtn} onClick={loadOrders}>
              <i className="fa-solid fa-rotate-right" /> Try Again
            </button>
          </div>
        </div>
      )}

      {/* ── Loading Skeletons ── */}
      {isLoading && (
        <div className={styles.ordersList}>
          {[0, 1, 2].map(i => <OrderSkeleton key={i} index={i} />)}
        </div>
      )}

      {/* ── Empty State ── */}
      {!isLoading && !isError && orders.length === 0 && <EmptyOrders />}

      {/* ── Orders List ── */}
      {!isLoading && !isError && orders.length > 0 && (
        <div className={styles.ordersList}>
          {orders.map((order, i) => (
            <OrderCard key={order._id} order={order} index={i} />
          ))}
        </div>
      )}

    </section>
  )
}