/** biome-ignore-all assist/source/organizeImports: intentional order */
import { useCallback, useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import toast from 'react-hot-toast'
import { CartContext } from '../../Context/CartContext'
import styles from './Checkout.module.css'

// ── Step indicator ──
function StepBar({ currentStep }) {
  const steps = [
    { num: 1, label: 'Delivery', icon: 'fa-location-dot' },
    { num: 2, label: 'Payment', icon: 'fa-credit-card' },
    { num: 3, label: 'Review', icon: 'fa-circle-check' },
  ]
  return (
    <div className={styles.stepBar}>
      {steps.map((step, i) => (
        <div key={step.num} className={styles.stepItem}>
          <div className={`${styles.stepCircle} ${currentStep >= step.num ? styles.stepActive : ''} ${currentStep > step.num ? styles.stepDone : ''}`}>
            {currentStep > step.num
              ? <i className="fa-solid fa-check" />
              : <i className={`fa-solid ${step.icon}`} />
            }
          </div>
          <span className={`${styles.stepLabel} ${currentStep >= step.num ? styles.stepLabelActive : ''}`}>
            {step.label}
          </span>
          {i < steps.length - 1 && (
            <div className={`${styles.stepLine} ${currentStep > step.num ? styles.stepLineDone : ''}`} />
          )}
        </div>
      ))}
    </div>
  )
}

// ── Order Summary Card ──
function OrderSummary({ cartData }) {
  const items = cartData?.data?.products ?? []
  const totalPrice = cartData?.data?.totalCartPrice ?? 0
  const delivery = totalPrice >= 200 ? 0 : 30
  const total = totalPrice + delivery

  return (
    <div className={styles.summaryCard}>
      <h3 className={styles.summaryTitle}>Order Summary</h3>

      <div className={styles.summaryItems}>
        {items.map(item => (
          <div key={item.product._id} className={styles.summaryItem}>
            <div className={styles.summaryItemImg}>
              <img src={item.product.imageCover} alt={item.product.title} />
              <span className={styles.summaryItemQty}>{item.count}</span>
            </div>
            <div className={styles.summaryItemInfo}>
              <p className={styles.summaryItemTitle}>{item.product.title}</p>
              <p className={styles.summaryItemCat}>{item.product.category?.name}</p>
            </div>
            <span className={styles.summaryItemPrice}>
              {(item.price * item.count).toLocaleString()} EGP
            </span>
          </div>
        ))}
      </div>

      <div className={styles.summaryDivider} />

      <div className={styles.summaryRows}>
        <div className={styles.summaryRow}>
          <span>Subtotal</span>
          <span>{totalPrice.toLocaleString()} EGP</span>
        </div>
        <div className={styles.summaryRow}>
          <span>Delivery</span>
          <span className={delivery === 0 ? styles.free : ''}>
            {delivery === 0 ? 'FREE' : `${delivery} EGP`}
          </span>
        </div>
      </div>

      <div className={styles.summaryDivider} />

      <div className={styles.summaryTotal}>
        <span>Total</span>
        <span>{total.toLocaleString()} EGP</span>
      </div>

      {totalPrice < 200 && (
        <div className={styles.freeShippingNote}>
          <i className="fa-solid fa-truck-fast" />
          Add {(200 - totalPrice).toLocaleString()} EGP for free delivery
        </div>
      )}
    </div>
  )
}

// ── Step 1: Delivery ──
function DeliveryStep({ formik }) {
  return (
    <div className={styles.stepContent}>
      <h2 className={styles.stepTitle}>
        <i className="fa-solid fa-location-dot" /> Delivery Information
      </h2>

      <div className={styles.formGrid}>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="fullName">Full Name</label>
          <div className={styles.inputWrapper}>
            <i className="fa-solid fa-user" />
            <input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="John Doe"
              className={styles.input}
              value={formik.values.fullName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          {formik.errors.fullName && formik.touched.fullName && (
            <span className={styles.error}>{formik.errors.fullName}</span>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="phone">Phone Number</label>
          <div className={styles.inputWrapper}>
            <i className="fa-solid fa-phone" />
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+20 1XX XXX XXXX"
              className={styles.input}
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          {formik.errors.phone && formik.touched.phone && (
            <span className={styles.error}>{formik.errors.phone}</span>
          )}
        </div>

        <div className={`${styles.field} ${styles.fieldFull}`}>
          <label className={styles.label} htmlFor="address">Street Address</label>
          <div className={styles.inputWrapper}>
            <i className="fa-solid fa-house" />
            <input
              id="address"
              name="address"
              type="text"
              placeholder="123 Main Street, Apt 4B"
              className={styles.input}
              value={formik.values.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          {formik.errors.address && formik.touched.address && (
            <span className={styles.error}>{formik.errors.address}</span>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="city">City</label>
          <div className={styles.inputWrapper}>
            <i className="fa-solid fa-building" />
            <input
              id="city"
              name="city"
              type="text"
              placeholder="Cairo"
              className={styles.input}
              value={formik.values.city}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          {formik.errors.city && formik.touched.city && (
            <span className={styles.error}>{formik.errors.city}</span>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="postalCode">Postal Code</label>
          <div className={styles.inputWrapper}>
            <i className="fa-solid fa-envelope" />
            <input
              id="postalCode"
              name="postalCode"
              type="text"
              placeholder="12345"
              className={styles.input}
              value={formik.values.postalCode}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          {formik.errors.postalCode && formik.touched.postalCode && (
            <span className={styles.error}>{formik.errors.postalCode}</span>
          )}
        </div>

        <div className={`${styles.field} ${styles.fieldFull}`}>
          <label className={styles.label} htmlFor="notes">Delivery Notes (optional)</label>
          <div className={styles.inputWrapper}>
            <i className="fa-solid fa-note-sticky" />
            <input
              id="notes"
              name="notes"
              type="text"
              placeholder="Leave at door, ring bell twice..."
              className={styles.input}
              value={formik.values.notes}
              onChange={formik.handleChange}
            />
          </div>
        </div>

      </div>
    </div>
  )
}

// ── Step 2: Payment ──
function PaymentStep({ formik }) {
  const [payMethod, setPayMethod] = useState('card')
  const { setFieldValue } = formik

  // sync to formik
  useEffect(() => {
    setFieldValue('paymentMethod', payMethod)
  }, [setFieldValue, payMethod])

  return (
    <div className={styles.stepContent}>
      <h2 className={styles.stepTitle}>
        <i className="fa-solid fa-credit-card" /> Payment Method
      </h2>

      {/* Method selector */}
      <div className={styles.paymentMethods}>
        {[
          { id: 'card', label: 'Credit / Debit Card', icon: 'fa-credit-card' },
          { id: 'cash', label: 'Cash on Delivery', icon: 'fa-money-bill-wave' },
          { id: 'wallet', label: 'Digital Wallet', icon: 'fa-wallet' },
        ].map(m => (
          <button
            key={m.id}
            type="button"
            className={`${styles.methodBtn} ${payMethod === m.id ? styles.methodActive : ''}`}
            onClick={() => setPayMethod(m.id)}
          >
            <i className={`fa-solid ${m.icon}`} />
            <span>{m.label}</span>
            {payMethod === m.id && <i className="fa-solid fa-circle-check" style={{ marginLeft: 'auto', color: '#4caf50' }} />}
          </button>
        ))}
      </div>

      {/* Card form */}
      {payMethod === 'card' && (
        <div className={styles.formGrid}>

          <div className={`${styles.field} ${styles.fieldFull}`}>
            <label className={styles.label} htmlFor="cardNumber">Card Number</label>
            <div className={styles.inputWrapper}>
              <i className="fa-solid fa-credit-card" />
              <input
                id="cardNumber"
                name="cardNumber"
                type="text"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                className={styles.input}
                value={formik.values.cardNumber}
                onChange={(e) => {
                  // Auto-format with spaces every 4 digits
                  const raw = e.target.value.replace(/\D/g, '').slice(0, 16)
                  const formatted = raw.match(/.{1,4}/g)?.join(' ') ?? raw
                  formik.setFieldValue('cardNumber', formatted)
                }}
                onBlur={formik.handleBlur}
              />
              <div className={styles.cardIcons}>
                <i className="fab fa-cc-visa" />
                <i className="fab fa-cc-mastercard" />
              </div>
            </div>
            {formik.errors.cardNumber && formik.touched.cardNumber && (
              <span className={styles.error}>{formik.errors.cardNumber}</span>
            )}
          </div>

          <div className={`${styles.field} ${styles.fieldFull}`}>
            <label className={styles.label} htmlFor="cardName">Cardholder Name</label>
            <div className={styles.inputWrapper}>
              <i className="fa-solid fa-user" />
              <input
                id="cardName"
                name="cardName"
                type="text"
                placeholder="JOHN DOE"
                className={styles.input}
                value={formik.values.cardName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.errors.cardName && formik.touched.cardName && (
              <span className={styles.error}>{formik.errors.cardName}</span>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="expiry">Expiry Date</label>
            <div className={styles.inputWrapper}>
              <i className="fa-solid fa-calendar" />
              <input
                id="expiry"
                name="expiry"
                type="text"
                placeholder="MM / YY"
                maxLength={7}
                className={styles.input}
                value={formik.values.expiry}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, '').slice(0, 4)
                  const formatted = raw.length > 2 ? `${raw.slice(0, 2)} / ${raw.slice(2)}` : raw
                  formik.setFieldValue('expiry', formatted)
                }}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.errors.expiry && formik.touched.expiry && (
              <span className={styles.error}>{formik.errors.expiry}</span>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="cvv">CVV</label>
            <div className={styles.inputWrapper}>
              <i className="fa-solid fa-lock" />
              <input
                id="cvv"
                name="cvv"
                type="password"
                placeholder="•••"
                maxLength={4}
                className={styles.input}
                value={formik.values.cvv}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.errors.cvv && formik.touched.cvv && (
              <span className={styles.error}>{formik.errors.cvv}</span>
            )}
          </div>

        </div>
      )}

      {payMethod === 'cash' && (
        <div className={styles.cashNote}>
          <i className="fa-solid fa-circle-info" />
          <div>
            <p><strong>Pay when your order arrives.</strong></p>
            <p>Have exact change ready. Our delivery team will bring a receipt.</p>
          </div>
        </div>
      )}

      {payMethod === 'wallet' && (
        <div className={styles.cashNote}>
          <i className="fa-solid fa-circle-info" />
          <div>
            <p><strong>You will receive a payment link on your phone.</strong></p>
            <p>Supported: Vodafone Cash, Fawry, Orange Money, Etisalat Cash.</p>
          </div>
        </div>
      )}

    </div>
  )
}

// ── Step 3: Review ──
function ReviewStep({ formik, cartData }) {
  const items = cartData?.data?.products ?? []
  const totalPrice = cartData?.data?.totalCartPrice ?? 0
  const delivery = totalPrice >= 200 ? 0 : 30

  return (
    <div className={styles.stepContent}>
      <h2 className={styles.stepTitle}>
        <i className="fa-solid fa-circle-check" /> Review Your Order
      </h2>

      {/* Delivery summary */}
      <div className={styles.reviewSection}>
        <h4 className={styles.reviewSectionTitle}>
          <i className="fa-solid fa-location-dot" /> Delivery To
        </h4>
        <div className={styles.reviewBox}>
          <p className={styles.reviewLine}><strong>{formik.values.fullName}</strong></p>
          <p className={styles.reviewLine}>{formik.values.address}, {formik.values.city}</p>
          <p className={styles.reviewLine}>{formik.values.phone}</p>
          {formik.values.notes && <p className={styles.reviewLine} style={{ color: '#888' }}>Note: {formik.values.notes}</p>}
        </div>
      </div>

      {/* Payment summary */}
      <div className={styles.reviewSection}>
        <h4 className={styles.reviewSectionTitle}>
          <i className="fa-solid fa-credit-card" /> Payment
        </h4>
        <div className={styles.reviewBox}>
          <p className={styles.reviewLine}>
            {formik.values.paymentMethod === 'card' && `Card ending in ${formik.values.cardNumber.slice(-4)}`}
            {formik.values.paymentMethod === 'cash' && 'Cash on Delivery'}
            {formik.values.paymentMethod === 'wallet' && 'Digital Wallet'}
          </p>
        </div>
      </div>

      {/* Items */}
      <div className={styles.reviewSection}>
        <h4 className={styles.reviewSectionTitle}>
          <i className="fa-solid fa-box" /> Items ({items.length})
        </h4>
        <div className={styles.reviewItems}>
          {items.map(item => (
            <div key={item.product._id} className={styles.reviewItem}>
              <img src={item.product.imageCover} alt={item.product.title} className={styles.reviewItemImg} />
              <div className={styles.reviewItemInfo}>
                <p className={styles.reviewItemTitle}>{item.product.title}</p>
                <p className={styles.reviewItemSub}>Qty: {item.count} × {item.price} EGP</p>
              </div>
              <span className={styles.reviewItemTotal}>{(item.price * item.count).toLocaleString()} EGP</span>
            </div>
          ))}
        </div>
      </div>

      {/* Total */}
      <div className={styles.reviewTotal}>
        <div className={styles.reviewTotalRow}>
          <span>Subtotal</span><span>{totalPrice.toLocaleString()} EGP</span>
        </div>
        <div className={styles.reviewTotalRow}>
          <span>Delivery</span>
          <span style={{ color: delivery === 0 ? '#4caf50' : 'inherit' }}>
            {delivery === 0 ? 'FREE' : `${delivery} EGP`}
          </span>
        </div>
        <div className={`${styles.reviewTotalRow} ${styles.reviewTotalFinal}`}>
          <span>Total</span>
          <span>{(totalPrice + delivery).toLocaleString()} EGP</span>
        </div>
      </div>

    </div>
  )
}

// ── Main Checkout Page ──
export default function Checkout() {

  const { getCart, clearCart } = useContext(CartContext)
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [cartData, setCartData] = useState(null)
  const [isLoadingCart, setIsLoadingCart] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loadCart = useCallback(async () => {
    try {
      const data = await getCart()
      setCartData(data)
      if ((data?.numOfCartItems ?? 0) === 0&& location.pathname === '/checkout') {
        toast.error('Your cart is empty')
        navigate('/products')
      }
    } catch {
      toast.error('Failed to load cart')
      navigate('/cart')
    } finally {
      setIsLoadingCart(false)
    }
  }, [getCart, navigate])

  useEffect(() => { loadCart() }, [loadCart])

  const totalPrice = cartData?.data?.totalCartPrice ?? 0
  const delivery = totalPrice >= 200 ? 0 : 30

  const formik = useFormik({
    initialValues: {
      fullName: '',
      phone: '',
      address: '',
      city: '',
      postalCode: '',
      notes: '',
      paymentMethod: 'card',
      cardNumber: '',
      cardName: '',
      expiry: '',
      cvv: '',
    },
    validate: (values) => {
      const errors = {}
      if (step === 1) {
        if (!values.fullName) errors.fullName = 'Full name is required'
        if (!/^(02)?01[0125][0-9]{8}$/.test(values.phone)) errors.phone = 'Enter a valid Egyptian phone number'
        if (!values.address) errors.address = 'Address is required'
        if (!values.city) errors.city = 'City is required'
        if (!values.postalCode) errors.postalCode = 'Postal code is required'
      }
      if (step === 2 && values.paymentMethod === 'card') {
        if (!values.cardNumber || values.cardNumber.replace(/\s/g, '').length < 16) errors.cardNumber = 'Enter a valid 16-digit card number'
        if (!values.cardName) errors.cardName = 'Cardholder name is required'
        if (!values.expiry || values.expiry.length < 7) errors.expiry = 'Enter a valid expiry date'
        if (!values.cvv || values.cvv.length < 3) errors.cvv = 'Enter a valid CVV'
      }
      return errors
    },
    onSubmit: async () => {
      if (step < 3) {
        setStep(s => s + 1)
        return
      }
      // Final submission
      setIsSubmitting(true)
      try {
        // In production: call your order API here
        // await axios.post('/api/orders', { ...formik.values, cartId: cartData.data._id })
        await new Promise(r => setTimeout(r, 1500)) // simulate API call
        await clearCart()
        toast.success('Order placed successfully!')
        navigate('/order-success', { replace: true })
      } catch {
        toast.error('Failed to place order. Please try again.')
      } finally {
        setIsSubmitting(false)
      }
    },
  })

  if (isLoadingCart) {
    return (
      <section className={styles.section}>
        <div className={styles.loadingWrapper}>
          <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem', color: '#4caf50' }} />
          <p>Loading your cart...</p>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.section}>

      {/* Back link */}
      <Link to="/cart" className={styles.backLink}>
        <i className="fa-solid fa-arrow-left" /> Back to Cart
      </Link>

      <h1 className={styles.pageTitle}>Checkout</h1>

      {/* Step bar */}
      <StepBar currentStep={step} />

      <div className={styles.checkoutGrid}>

        {/* Left — form */}
        <div className={styles.formSide}>
          <form onSubmit={formik.handleSubmit}>

            {step === 1 && <DeliveryStep formik={formik} />}
            {step === 2 && <PaymentStep formik={formik} />}
            {step === 3 && <ReviewStep formik={formik} cartData={cartData} />}

            {/* Navigation buttons */}
            <div className={styles.navBtns}>
              {step > 1 && (
                <button
                  type="button"
                  className={styles.prevBtn}
                  onClick={() => setStep(s => s - 1)}
                >
                  <i className="fa-solid fa-arrow-left" /> Back
                </button>
              )}

              <button
                type="submit"
                className={styles.nextBtn}
                disabled={isSubmitting}
              >
                {isSubmitting && <i className="fa-solid fa-spinner fa-spin" />}
                {step < 3 && !isSubmitting && <>Continue <i className="fa-solid fa-arrow-right" /></>}
                {step === 3 && !isSubmitting && <><i className="fa-solid fa-lock" /> Place Order — {(totalPrice + delivery).toLocaleString()} EGP</>}
                {isSubmitting && 'Placing order...'}
              </button>
            </div>

          </form>

          {/* Security note */}
          <div className={styles.secureNote}>
            <i className="fa-solid fa-shield-halved" />
            <span>Your payment information is encrypted and secure</span>
          </div>
        </div>

        {/* Right — order summary */}
        <div className={styles.summarySide}>
          <OrderSummary cartData={cartData} />
        </div>

      </div>
    </section>
  )
}