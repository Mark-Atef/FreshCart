import { Link, useNavigate } from 'react-router-dom'
import styles from './NotFound.module.css'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <section className={styles.section}>

      {/* Background decoration */}
      <div className={styles.blob1} />
      <div className={styles.blob2} />

      <div className={styles.content}>

        {/* Big 404 */}
        <div className={styles.errorCode}>
          <span className={styles.four}>4</span>
          <div className={styles.cartIcon}>
            <i className="fa-solid fa-cart-shopping" />
          </div>
          <span className={styles.four}>4</span>
        </div>

        {/* Text */}
        <h1 className={styles.title}>Page Not Found</h1>
        <p className={styles.subtitle}>
          Looks like this page got lost in the grocery aisle. Let's get you back on track!
        </p>

        {/* Actions */}
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.backBtn}
            onClick={() => navigate(-1)}
          >
            <i className="fa-solid fa-arrow-left" /> Go Back
          </button>
          <Link to="/" className={styles.homeBtn}>
            <i className="fa-solid fa-house" /> Back to Home
          </Link>
        </div>

        {/* Quick links */}
        <div className={styles.quickLinks}>
          <p className={styles.quickLinksLabel}>Or explore these pages:</p>
          <div className={styles.quickLinksRow}>
            <Link to="/products" className={styles.quickLink}>
              <i className="fa-solid fa-box" /> Products
            </Link>
            <Link to="/categories" className={styles.quickLink}>
              <i className="fa-solid fa-layer-group" /> Categories
            </Link>
            <Link to="/brands" className={styles.quickLink}>
              <i className="fa-solid fa-tag" /> Brands
            </Link>
            <Link to="/cart" className={styles.quickLink}>
              <i className="fa-solid fa-cart-shopping" /> Cart
            </Link>
          </div>
        </div>

      </div>
    </section>
  )
}