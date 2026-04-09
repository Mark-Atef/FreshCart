import { Link } from 'react-router-dom'
import styles from './OrderSuccess.module.css'

export default function OrderSuccess() {
  return (
    <section className={styles.section}>
      <div className={styles.content}>

        <div className={styles.iconWrapper}>
          <i className="fa-solid fa-circle-check" />
        </div>

        <h1 className={styles.title}>Order Placed!</h1>
        <p className={styles.subtitle}>
          Thank you for shopping with FreshCart. Your order has been confirmed and will be delivered soon.
        </p>

        <div className={styles.info}>
          <div className={styles.infoItem}>
            <i className="fa-solid fa-truck-fast" />
            <div>
              <p className={styles.infoLabel}>Estimated Delivery</p>
              <p className={styles.infoValue}>2 - 3 working days</p>
            </div>
          </div>
          <div className={styles.infoItem}>
            <i className="fa-solid fa-envelope" />
            <div>
              <p className={styles.infoLabel}>Confirmation</p>
              <p className={styles.infoValue}>Sent to your phone</p>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <Link to="/products" className={styles.primaryBtn}>
            <i className="fa-solid fa-bag-shopping" /> Continue Shopping
          </Link>
          <Link to="/" className={styles.secondaryBtn}>
            <i className="fa-solid fa-house" /> Back to Home
          </Link>
        </div>

      </div>
    </section>
  )
}