/** biome-ignore-all assist/source/organizeImports: intentional order */
/** biome-ignore-all lint/a11y/useButtonType: <explanation> */
import { useCallback, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { AuthenticationContext } from '../../Context/Authentication'
import styles from './Profile.module.css'
import toast from 'react-hot-toast'

// ── Fetch user profile ──
async function fetchUserData() {
  const { data } = await axios.get(
    'https://ecommerce.routemisr.com/api/v1/auth/verifyToken',
    { headers: { token: localStorage.getItem('token') } }
  )
  return data
}

// ── Fetch order count for the stats card ──
async function fetchOrderCount(userId) {
  const { data } = await axios.get(
    `https://ecommerce.routemisr.com/api/v1/orders/user/${userId}`
  )
  return data.length
}

function ProfileSkeleton() {
  return (
    <div className={styles.skeleton}>
      <div className={styles.skeletonAvatar} />
      <div className={styles.skeletonLines}>
        <div className={styles.skeletonLine} style={{ width: '180px', height: '22px' }} />
        <div className={styles.skeletonLine} style={{ width: '140px', height: '14px' }} />
        <div className={styles.skeletonLine} style={{ width: '110px', height: '14px' }} />
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, color, onClick }) {
  return (
    <div
      className={`${styles.statCard} ${onClick ? styles.statCardClickable : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyUp={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      <div className={styles.statIcon} style={{ background: color }}>
        <i className={`fa-solid ${icon}`} />
      </div>
      <div>
        <p className={styles.statValue}>{value}</p>
        <p className={styles.statLabel}>{label}</p>
      </div>
      {onClick && (
        <i className="fa-solid fa-chevron-right" style={{ marginLeft: 'auto', color: '#ccc', fontSize: '0.75rem' }} />
      )}
    </div>
  )
}

export default function Profile() {

  const { setToken } = useContext(AuthenticationContext)
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [orderCount, setOrderCount] = useState('—')

  const loadUser = useCallback(async () => {
    try {
      const data = await fetchUserData()
      setUser(data.decoded)

      // ✅ Also fetch order count using jwt-decode for the stats card
      const token = localStorage.getItem('token')
      if (token) {
        const decoded = jwtDecode(token)
        const count = await fetchOrderCount(decoded.id)
        setOrderCount(count)
      }
    } catch {
      toast.error('Session expired. Please log in again.')
      localStorage.removeItem('token')
      setToken(null)
      navigate('/login')
    } finally {
      setIsLoading(false)
    }
  }, [navigate, setToken])

  useEffect(() => {
    loadUser()
  }, [loadUser])

  function handleLogout() {
    localStorage.removeItem('token')
    setToken(null)
    toast.success('Logged out successfully')
    navigate('/login')
  }

  function getInitials(name) {
    if (!name) return '?'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  function formatDate(timestamp) {
    if (!timestamp) return 'N/A'
    return new Date(timestamp * 1000).toLocaleDateString('en-EG', {
      year: 'numeric', month: 'long', day: 'numeric'
    })
  }

  return (
    <section className={styles.section}>

      <div className={styles.heroBanner}>
        <div className={styles.heroBannerInner}>
          {isLoading ? <ProfileSkeleton /> : (
            <div className={styles.heroContent}>
              <div className={styles.avatarWrapper}>
                <div className={styles.avatar}>{getInitials(user?.name)}</div>
                <div className={styles.avatarBadge}>
                  <i className="fa-solid fa-circle-check" />
                </div>
              </div>
              <div className={styles.heroInfo}>
                <h1 className={styles.heroName}>{user?.name || 'FreshCart User'}</h1>
                <p className={styles.heroRole}>
                  <i className="fa-solid fa-user" /> {user?.role || 'Customer'}
                </p>
                <p className={styles.heroMember}>
                  <i className="fa-solid fa-calendar-days" />
                  Member since {formatDate(user?.iat)}
                </p>
              </div>
              <button type="button" className={styles.logoutHeroBtn} onClick={handleLogout}>
                <i className="fa-solid fa-arrow-right-from-bracket" /> Log Out
              </button>
            </div>
          )}
        </div>
      </div>

      <div className={styles.content}>

        <div className={styles.statsRow}>
          {/* ✅ Total Orders stat is now clickable — navigates to /all-orders */}
          <StatCard
            icon="fa-bag-shopping"
            label="Total Orders"
            value={isLoading ? '—' : orderCount}
            color="rgba(76,175,80,0.12)"
            onClick={() => navigate('/all-orders')}
          />
          <StatCard icon="fa-heart" label="Wishlist Items" value="0" color="rgba(229,57,53,0.1)" />
          <StatCard icon="fa-star" label="Reviews Given" value="0" color="rgba(245,166,35,0.12)" />
          <StatCard icon="fa-truck-fast" label="Deliveries" value="0" color="rgba(33,150,243,0.1)" />
        </div>

        <div className={styles.cardsGrid}>

          <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>
                <i className="fa-solid fa-circle-user" /> Account Information
              </h2>
            </div>
            <div className={styles.cardBody}>
              {isLoading ? (
                <>
                  <div className={styles.skeletonLine} style={{ width: '100%', height: '48px', borderRadius: '10px' }} />
                  <div className={styles.skeletonLine} style={{ width: '100%', height: '48px', borderRadius: '10px' }} />
                  <div className={styles.skeletonLine} style={{ width: '100%', height: '48px', borderRadius: '10px' }} />
                </>
              ) : (
                <>
                  <div className={styles.infoRow}>
                    <div className={styles.infoIcon}><i className="fa-solid fa-user" /></div>
                    <div>
                      <p className={styles.infoLabel}>Full Name</p>
                      <p className={styles.infoValue}>{user?.name || '—'}</p>
                    </div>
                  </div>
                  <div className={styles.infoRow}>
                    <div className={styles.infoIcon}><i className="fa-solid fa-id-badge" /></div>
                    <div>
                      <p className={styles.infoLabel}>User ID</p>
                      <p className={styles.infoValue} style={{ fontSize: '0.78rem', fontFamily: 'monospace' }}>
                        {user?.id || '—'}
                      </p>
                    </div>
                  </div>
                  <div className={styles.infoRow}>
                    <div className={styles.infoIcon}><i className="fa-solid fa-shield-halved" /></div>
                    <div>
                      <p className={styles.infoLabel}>Account Role</p>
                      <p className={styles.infoValue}>{user?.role || '—'}</p>
                    </div>
                  </div>
                  <div className={styles.infoRow}>
                    <div className={styles.infoIcon}><i className="fa-solid fa-clock-rotate-left" /></div>
                    <div>
                      <p className={styles.infoLabel}>Session Expires</p>
                      <p className={styles.infoValue}>{formatDate(user?.exp)}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>
                <i className="fa-solid fa-bolt" /> Quick Actions
              </h2>
            </div>
            <div className={styles.cardBody}>
              {[
                { icon: 'fa-bag-shopping', label: 'Browse Products', sub: 'Discover fresh items', path: '/products', color: '#4caf50' },
                { icon: 'fa-cart-shopping', label: 'View My Cart', sub: 'Check your cart items', path: '/cart', color: '#2196f3' },
                // ✅ NEW: My Orders quick action
                { icon: 'fa-receipt', label: 'My Orders', sub: 'View your order history', path: '/all-orders', color: '#e65100' },
                { icon: 'fa-layer-group', label: 'Categories', sub: 'Shop by category', path: '/categories', color: '#ff9800' },
              ].map(action => (
                <button
                  key={action.path}
                  type="button"
                  className={styles.actionBtn}
                  onClick={() => navigate(action.path)}
                >
                  <div className={styles.actionIcon} style={{ background: `${action.color}18`, color: action.color }}>
                    <i className={`fa-solid ${action.icon}`} />
                  </div>
                  <div className={styles.actionText}>
                    <p className={styles.actionLabel}>{action.label}</p>
                    <p className={styles.actionSub}>{action.sub}</p>
                  </div>
                  <i className="fa-solid fa-chevron-right" style={{ color: '#ccc', fontSize: '0.75rem' }} />
                </button>
              ))}
            </div>
          </div>

        </div>

        <div className={styles.dangerZone}>
          <div className={styles.dangerContent}>
            <div>
              <h3 className={styles.dangerTitle}>Log Out of FreshCart</h3>
              <p className={styles.dangerText}>You'll need to sign in again to access your account.</p>
            </div>
            <button type="button" className={styles.dangerBtn} onClick={handleLogout}>
              <i className="fa-solid fa-arrow-right-from-bracket" /> Log Out
            </button>
          </div>
        </div>

      </div>
    </section>
  )
}