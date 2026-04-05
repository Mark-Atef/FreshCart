/** biome-ignore-all assist/source/organizeImports: intentional order */
import { Link } from 'react-router-dom'
import styles from './Footer.module.css'
import logo from '../../assets/images/freshcart-logo.svg'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={styles.footer}>

      {/* ── Newsletter Banner ── */}
      <div className={styles.newsletter}>
        <div className={styles.newsletterInner}>
          <div className={styles.newsletterText}>
            <h3 className={styles.newsletterTitle}>Get Fresh Deals in Your Inbox</h3>
            <p className={styles.newsletterSubtitle}>Subscribe for exclusive offers, recipes, and weekly specials</p>
          </div>
          <form
            className={styles.newsletterForm}
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Enter your email address"
              className={styles.newsletterInput}
              aria-label="Email for newsletter"
            />
            <button type="submit" className={styles.newsletterBtn}>
              Subscribe <i className="fa-solid fa-arrow-right" />
            </button>
          </form>
        </div>
      </div>

      {/* ── Main Footer Grid ── */}
      <div className={styles.mainGrid}>

        {/* Brand Column */}
        <div className={styles.brandCol}>
          <Link to="/" className={styles.logoLink}>
            <img src={logo} alt="FreshCart" className={styles.logo} />
          </Link>
          <p className={styles.brandDesc}>
            Your one-stop shop for fresh groceries delivered right to your door. Quality you can taste, speed you can count on.
          </p>
          <ul className={styles.socialList}>
            {/* cspell:disable */}
            <li><a href="https://www.instagram.com" target="_blank" rel="noreferrer" className={styles.socialLink} aria-label="Instagram"><i className="fab fa-instagram" /></a></li>
            <li><a href="https://www.facebook.com" target="_blank" rel="noreferrer" className={styles.socialLink} aria-label="Facebook"><i className="fab fa-facebook-f" /></a></li>
            <li><a href="https://www.tiktok.com" target="_blank" rel="noreferrer" className={styles.socialLink} aria-label="TikTok"><i className="fab fa-tiktok" /></a></li>
            <li><a href="https://www.twitter.com" target="_blank" rel="noreferrer" className={styles.socialLink} aria-label="Twitter"><i className="fab fa-twitter" /></a></li>
            <li><a href="https://www.youtube.com" target="_blank" rel="noreferrer" className={styles.socialLink} aria-label="YouTube"><i className="fab fa-youtube" /></a></li>
            {/* cspell:enable */}
          </ul>
        </div>

        {/* Shop Column */}
        <div className={styles.linkCol}>
          <h4 className={styles.colTitle}>Shop</h4>
          <ul className={styles.linkList}>
            <li><Link to="/products" className={styles.footerLink}>All Products</Link></li>
            <li><Link to="/categories" className={styles.footerLink}>Categories</Link></li>
            <li><Link to="/brands" className={styles.footerLink}>Brands</Link></li>
            <li><Link to="/cart" className={styles.footerLink}>My Cart</Link></li>
          </ul>
        </div>

        {/* Account Column */}
        <div className={styles.linkCol}>
          <h4 className={styles.colTitle}>Account</h4>
          <ul className={styles.linkList}>
            <li><Link to="/profile" className={styles.footerLink}>My Profile</Link></li>
            <li><Link to="/login" className={styles.footerLink}>Sign In</Link></li>
            <li><Link to="/register" className={styles.footerLink}>Create Account</Link></li>
          </ul>
        </div>

        {/* Help Column */}
        <div className={styles.linkCol}>
          <h4 className={styles.colTitle}>Help</h4>
          <ul className={styles.linkList}>
            <li><a href="#!" className={styles.footerLink}>FAQs</a></li>
            <li><a href="#!" className={styles.footerLink}>Track Order</a></li>
            <li><a href="#!" className={styles.footerLink}>Return Policy</a></li>
            <li><a href="#!" className={styles.footerLink}>Contact Us</a></li>
          </ul>
        </div>

        {/* Contact Column */}
        <div className={styles.linkCol}>
          <h4 className={styles.colTitle}>Contact</h4>
          <ul className={styles.contactList}>
            <li className={styles.contactItem}>
              <i className="fa-solid fa-location-dot" />
              <span>123 Fresh Street, Cairo, Egypt</span>
            </li>
            <li className={styles.contactItem}>
              <i className="fa-solid fa-phone" />
              <span>+20 100 000 0000</span>
            </li>
            <li className={styles.contactItem}>
              <i className="fa-solid fa-envelope" />
              <span>hello@freshcart.com</span>
            </li>
            <li className={styles.contactItem}>
              <i className="fa-solid fa-clock" />
              <span>Daily: 8AM – 12AM</span>
            </li>
          </ul>
        </div>

      </div>

      {/* ── Features Strip ── */}
      <div className={styles.featuresStrip}>
        {[
          { icon: 'fa-truck-fast', label: 'Free Delivery over 200 EGP' },
          { icon: 'fa-leaf', label: '100% Fresh Guarantee' },
          { icon: 'fa-shield-halved', label: 'Secure Payments' },
          { icon: 'fa-headset', label: '24/7 Customer Support' },
        ].map(f => (
          <div key={f.label} className={styles.featureItem}>
            <i className={`fa-solid ${f.icon}`} />
            <span>{f.label}</span>
          </div>
        ))}
      </div>

      {/* ── Bottom Bar ── */}
      <div className={styles.bottomBar}>
        <p className={styles.copyright}>
          © {currentYear} FreshCart. All rights reserved. Made with <i className="fa-solid fa-heart" style={{ color: '#e53935' }} /> in Egypt.
        </p>
        <div className={styles.paymentIcons}>
          <i className="fab fa-cc-visa" title="Visa" />
          <i className="fab fa-cc-mastercard" title="Mastercard" />
          <i className="fab fa-cc-paypal" title="PayPal" />
          <i className="fab fa-apple-pay" title="Apple Pay" />
        </div>
      </div>

    </footer>
  )
}