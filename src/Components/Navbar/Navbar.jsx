/** biome-ignore-all lint/complexity/noUselessFragments: React fragments required for layout wrapper */
/** biome-ignore-all assist/source/organizeImports: <> */
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
          <li><a href="https://www.instagram.com" target="_blank" rel="noreferrer"><i className="fab fa-instagram"></i></a></li>
          <li><a href="https://www.facebook.com" target="_blank" rel="noreferrer"><i className="fab fa-facebook-f"></i></a></li>
          <li><a href="https://www.tiktok.com" target="_blank" rel="noreferrer"><i className="fab fa-tiktok"></i></a></li>
          <li><a href="https://www.twitter.com" target="_blank" rel="noreferrer"><i className="fab fa-twitter"></i></a></li>
          <li><a href="https://www.linkedin.com" target="_blank" rel="noreferrer"><i className="fab fa-linkedin-in"></i></a></li>
          <li><a href="https://www.youtube.com" target="_blank" rel="noreferrer"><i className="fab fa-youtube"></i></a></li>
        </ul>


        <div className={styles.navActions}>
          <Link to="/login" className={styles.login}>Login</Link>
          <Link to="/register" className={styles.register}>Register</Link>
        </div>
      </nav>
    </header>
  </>
}
