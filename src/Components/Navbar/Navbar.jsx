/** biome-ignore-all assist/source/organizeImports: intentional import order */
import { useContext, useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import styles from './Navbar.module.css'
import logo from '../../assets/images/freshcart-logo.svg'
import { AuthenticationContext } from '../../Context/Authentication.jsx'
import { CartContext } from '../../Context/CartContext.jsx'

export default function Navbar() {

  const { token, setToken } = useContext(AuthenticationContext)

  // ✅ FIX Bug 4: import cartCount for badge + resetCart for logout
  const { cartCount, resetCart } = useContext(CartContext)

  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  function closeMenu() { setMenuOpen(false) }
  function toggleMenu() { setMenuOpen(prev => !prev) }

  function logout() {
    localStorage.removeItem('token')
    setToken(null)
    // ✅ FIX: reset cartCount to 0 so badge disappears immediately on logout
    resetCart()
    navigate('/login')
    closeMenu()
  }

  useEffect(() => {
    function handleScroll() { setScrolled(window.scrollY > 10) }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <nav className={styles.navbar}>

        {/* ── Logo ── */}
        <Link to="/" className={styles.logo} onClick={closeMenu}>
          <img src={logo} alt="FreshCart Logo" />
        </Link>

        {/* ── Desktop nav links ── */}
        <ul className={styles.navLinks}>
          <li><NavLink to="/" end className={({ isActive }) => isActive ? styles.active : ''}>Home</NavLink></li>
          <li><NavLink to="/products" className={({ isActive }) => isActive ? styles.active : ''}>Products</NavLink></li>
          <li><NavLink to="/categories" className={({ isActive }) => isActive ? styles.active : ''}>Categories</NavLink></li>
          <li><NavLink to="/brands" className={({ isActive }) => isActive ? styles.active : ''}>Brands</NavLink></li>

          {/* ── Cart with live badge ── */}
          <li>
            <NavLink
              to="/cart"
              className={({ isActive }) => `${styles.cartLink} ${isActive ? styles.active : ''}`}
            >
              Cart
              {cartCount > 0 && (
                <span className={styles.cartBadge}>
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </NavLink>
          </li>
        </ul>

        {/* ── Desktop right side ── */}
        <div className={styles.navRight}>

          {/* cspell:disable */}
          <ul className={styles.navIcons}>
            <li><a href="https://www.instagram.com" target="_blank" rel="noreferrer"><i className="fab fa-instagram" /></a></li>
            <li><a href="https://www.facebook.com" target="_blank" rel="noreferrer"><i className="fab fa-facebook-f" /></a></li>
            <li><a href="https://www.tiktok.com" target="_blank" rel="noreferrer"><i className="fab fa-tiktok" /></a></li>
            <li><a href="https://www.twitter.com" target="_blank" rel="noreferrer"><i className="fab fa-twitter" /></a></li>
            <li><a href="https://www.linkedin.com" target="_blank" rel="noreferrer"><i className="fab fa-linkedin-in" /></a></li>
            <li><a href="https://www.youtube.com" target="_blank" rel="noreferrer"><i className="fab fa-youtube" /></a></li>
          </ul>
          {/* cspell:enable */}

          <div className={styles.navActions}>
            {token ? (
              <>
                <Link to="/profile" className={styles.profileBtn}>
                  <i className="fa-regular fa-circle-user" /> Profile
                </Link>
                <button type="button" onClick={logout} className={styles.logoutBtn}>
                  <i className="fa-solid fa-arrow-right-from-bracket" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={styles.loginBtn}>Login</Link>
                <Link to="/register" className={styles.registerBtn}>Register</Link>
              </>
            )}
          </div>

        </div>

        {/* ── Hamburger ── */}
        <button
          type="button"
          className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>

      </nav>

      {/* ── Overlay ── */}
      {menuOpen && (
        <button
          type="button"
          className={styles.overlay}
          onClick={closeMenu}
          onKeyUp={(e) => e.key === 'Escape' && closeMenu()}
          aria-label="Close menu"
        />
      )}

      {/* ── Mobile Drawer ── */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`}>

        <button type="button" className={styles.closeBtn} onClick={closeMenu} aria-label="Close menu">
          <i className="fa-solid fa-xmark" />
        </button>

        <ul className={styles.mobileLinks}>
          <li><NavLink to="/" end className={({ isActive }) => isActive ? styles.mobileActive : ''} onClick={closeMenu}><i className="fa-solid fa-house" /> Home</NavLink></li>
          <li><NavLink to="/products" className={({ isActive }) => isActive ? styles.mobileActive : ''} onClick={closeMenu}><i className="fa-solid fa-box" /> Products</NavLink></li>
          <li><NavLink to="/categories" className={({ isActive }) => isActive ? styles.mobileActive : ''} onClick={closeMenu}><i className="fa-solid fa-layer-group" /> Categories</NavLink></li>
          <li><NavLink to="/brands" className={({ isActive }) => isActive ? styles.mobileActive : ''} onClick={closeMenu}><i className="fa-solid fa-tag" /> Brands</NavLink></li>
          <li>
            <NavLink
              to="/cart"
              className={({ isActive }) => `${styles.mobileCartLink} ${isActive ? styles.mobileActive : ''}`}
              onClick={closeMenu}
            >
              <i className="fa-solid fa-cart-shopping" /> Cart
              {cartCount > 0 && (
                <span className={styles.mobileBadge}>{cartCount > 99 ? '99+' : cartCount}</span>
              )}
            </NavLink>
          </li>
        </ul>

        <div className={styles.mobileDivider} />

        <div className={styles.mobileActions}>
          {token ? (
            <>
              <Link to="/profile" className={styles.mobileProfileBtn} onClick={closeMenu}>
                <i className="fa-regular fa-circle-user" /> Profile
              </Link>
              <button type="button" onClick={logout} className={styles.mobileLogoutBtn}>
                <i className="fa-solid fa-arrow-right-from-bracket" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.mobileLoginBtn} onClick={closeMenu}>Login</Link>
              <Link to="/register" className={styles.mobileRegisterBtn} onClick={closeMenu}>Register</Link>
            </>
          )}
        </div>

        {/* cspell:disable */}
        <ul className={styles.mobileIcons}>
          <li><a href="https://www.instagram.com" target="_blank" rel="noreferrer"><i className="fab fa-instagram" /></a></li>
          <li><a href="https://www.facebook.com" target="_blank" rel="noreferrer"><i className="fab fa-facebook-f" /></a></li>
          <li><a href="https://www.tiktok.com" target="_blank" rel="noreferrer"><i className="fab fa-tiktok" /></a></li>
          <li><a href="https://www.twitter.com" target="_blank" rel="noreferrer"><i className="fab fa-twitter" /></a></li>
          <li><a href="https://www.linkedin.com" target="_blank" rel="noreferrer"><i className="fab fa-linkedin-in" /></a></li>
          <li><a href="https://www.youtube.com" target="_blank" rel="noreferrer"><i className="fab fa-youtube" /></a></li>
        </ul>
        {/* cspell:enable */}

      </div>
    </header>
  )
}