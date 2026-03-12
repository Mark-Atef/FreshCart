import React from 'react'
import { Link } from 'react-router-dom'
import styles from './Navbar.module.css'
import logo from '../../assets/images/freshcart-logo.svg'

export default function Navbar() {
  return <>

    <header className={styles.header}>
      <nav className={styles.navbar}>
        <img src={logo} alt="FreshCart Logo" className={styles.logo} />
        <ul className={styles.navLinks}>
          <li><Link to="/" className={styles.active}>Home</Link></li>
          <li><Link to="/products">Products</Link></li>
          <li><Link to="/categories">Categories</Link></li>
          <li><Link to="/brands">Brands</Link></li>
          <li><Link to="/cart">Cart</Link></li>
        </ul>

        <ul className={styles.navIcons}>
          <li><i className="fab fa-instagram"></i></li>
          <li><i className="fab fa-facebook-f"></i></li>
          <li><i className="fab fa-tiktok"></i></li>
          <li><i className="fab fa-twitter"></i></li>
          <li><i className="fab fa-linkedin-in"></i></li>
          <li><i className="fab fa-youtube"></i></li>
        </ul>


        <div className={styles.navActions}>
          <Link to="/login" className={styles.login}>Login</Link>
          <Link to="/register" className={styles.register}>Register</Link>
        </div>
      </nav>
    </header>
  </>
}
