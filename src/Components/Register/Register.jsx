/** biome-ignore-all lint/complexity/noUselessFragments: <> */
/** biome-ignore-all assist/source/organizeImports: <> */
import { Link, useNavigate } from 'react-router-dom'
import styles from './Register.module.css'
import { useFormik } from 'formik'
import axios from 'axios'
import { useState, useEffect, useRef } from 'react'
import { RotatingLines } from 'react-loader-spinner'

export default function Register() {

  const [errMessage, setErrMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [emailExists, setEmailExists] = useState(false)
  const navigate = useNavigate()

  // ✅ Ref for error alert — scrolls to it when it appears
  const alertRef = useRef(null)

  // ✅ Ref for email field — scrolls to it when email already exists
  const emailRef = useRef(null)

  // ✅ Scroll to alert when any message appears
  useEffect(() => {
    if (errMessage || successMessage) {
      alertRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [errMessage, successMessage])

  // ✅ Scroll to email field when email already exists
  useEffect(() => {
    if (emailExists) {
      emailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      emailRef.current?.focus()
    }
  }, [emailExists])

  async function registerNewUser(values) {
    setErrMessage(null)
    setSuccessMessage(null)
    setEmailExists(false)
    setIsLoading(true)

    try {
      const { data } = await axios.post(
        'https://ecommerce.routemisr.com/api/v1/auth/signup',
        values
      )

      if (data.message === 'success') {
        setSuccessMessage('Account created! Redirecting to login...')
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      }

    } catch (err) {
      const message = err.response?.data?.message || 'Something went wrong'

      if (message.toLowerCase().includes('exist')) {
        // ✅ Special case — email exists — mark field and scroll to it
        setEmailExists(true)
        setErrMessage('This email is already registered. Please use a different email or log in.')
      } else {
        setErrMessage(message)
      }

    } finally {
      setIsLoading(false)
    }
  }

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      rePassword: '',
      phone: '',
    },
    validateOnMount: true,
    onSubmit: registerNewUser,
    validate: (values) => {
      const errors = {}

      if (!values.name || values.name.length < 2) {
        errors.name = 'Name must be at least 2 characters'
      }
      if (!values.email) {
        errors.email = 'Email is required'
      } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
        errors.email = 'Enter valid email'
      }
      if (!/^(02)?01[0125][0-9]{8}$/.test(values.phone)) {
        errors.phone = 'Enter Valid Phone Number'
      }
      if (!values.password) {
        errors.password = 'Password is required'
      } else if (values.password.length < 8) {
        errors.password = 'Password must be at least 8 characters'
      }
      if (values.rePassword !== values.password) {
        errors.rePassword = "Password and RePassword Doesn't Match"
      }

      return errors
    },
  })

  // ✅ Clear emailExists flag when user starts typing a new email
  function handleEmailChange(e) {
    setEmailExists(false)
    formik.handleChange(e)
  }

  return (
    <section className={styles.section}>
      <div className={styles.card}>

        {/* Left decorative panel */}
        <div className={styles.panel}>
          <div className={styles.panelContent}>
            <div className={styles.panelIcon}><i className="fa-solid fa-cart-shopping" /></div>
            <h2 className={styles.panelTitle}>Welcome to FreshCart</h2>
            <p className={styles.panelText}>
              Fresh groceries delivered to your door. Join thousands of happy customers today.
            </p>
            <ul className={styles.panelList}>
              <li><i className="fa-solid fa-basket-shopping" /> Fresh produce daily</li>
              <li><i className="fa-solid fa-truck-fast" /> Free delivery over 200 EGP</li>
              <li><i className="fa-solid fa-credit-card" /> Secure payments</li>
              <li><i className="fa-solid fa-star" /> Exclusive member deals</li>
            </ul>
          </div>
          <div className={styles.panelCircle1} />
          <div className={styles.panelCircle2} />
        </div>

        {/* Right form panel */}
        <div className={styles.formSide}>
          <h1 className={styles.title}>Create Account</h1>
          <p className={styles.subtitle}>Fill in your details to get started</p>

          {/* ✅ Alert section — ref attached for scrolling */}
          <div ref={alertRef}>
            {errMessage && (
              <div className={`${styles.alertError} ${emailExists ? styles.alertErrorBold : ''}`}>
                <i className="fa-solid fa-circle-exclamation" />
                <div className={styles.alertBody}>
                  <span>{errMessage}</span>
                  {emailExists && (
                    <button
                      type="button"
                      className={styles.loginRedirectBtn}
                      onClick={() => navigate('/login')}
                    >
                      Sign in instead <i className="fa-solid fa-arrow-right" />
                    </button>
                  )}
                </div>
              </div>
            )}
            {successMessage && (
              <div className={styles.alertSuccess}>
                <i className="fa-solid fa-circle-check" />
                {successMessage}
              </div>
            )}
          </div>

          <form onSubmit={formik.handleSubmit} className={styles.form}>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="name">Full Name</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}><i className="fa-regular fa-circle-user" /></span>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  className={styles.input}
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.errors.name && formik.touched.name && (
                <span className={styles.errorMessage}>{formik.errors.name}</span>
              )}
            </div>

            {/* ✅ Email field — ref attached + special red border when email exists */}
            <div className={`${styles.field} ${emailExists ? styles.fieldError : ''}`}>
              <label className={styles.label} htmlFor="email">
                Email Address
                {/* ✅ Extra visible badge when email exists */}
                {emailExists && (
                  <span className={styles.existsBadge}>
                    <i className="fa-solid fa-triangle-exclamation" /> Already registered
                  </span>
                )}
              </label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}><i className="fa-regular fa-envelope" /></span>
                <input
                  ref={emailRef}
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  className={`${styles.input} ${emailExists ? styles.inputExists : ''}`}
                  value={formik.values.email}
                  onChange={handleEmailChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.errors.email && formik.touched.email && !emailExists && (
                <span className={styles.errorMessage}>{formik.errors.email}</span>
              )}
              {emailExists && (
                <span className={styles.errorMessage}>
                  This email is already taken — try a different one
                </span>
              )}
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="password">Password</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}><i className="fa-solid fa-lock" /></span>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Min. 8 characters"
                    className={styles.input}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
                {formik.errors.password && formik.touched.password && (
                  <span className={styles.errorMessage}>{formik.errors.password}</span>
                )}
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="rePassword">Confirm Password</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}><i className="fa-solid fa-lock" /></span>
                  <input
                    id="rePassword"
                    name="rePassword"
                    type="password"
                    placeholder="Repeat password"
                    className={styles.input}
                    value={formik.values.rePassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
                {formik.errors.rePassword && formik.touched.rePassword && (
                  <span className={styles.errorMessage}>{formik.errors.rePassword}</span>
                )}
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="phone">Phone Number</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}><i className="fa-solid fa-phone" /></span>
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
                <span className={styles.errorMessage}>{formik.errors.phone}</span>
              )}
            </div>

            <button
              type="submit"
              disabled={!formik.isValid || !formik.dirty || isLoading}
              className={styles.btn}
            >
              {isLoading && <RotatingLines visible height="18" width="18" color="white" strokeWidth="5" />}
              {isLoading ? 'Creating...' : 'Create My Account'}
            </button>

          </form>

          <p className={styles.loginText}>
            Already have an account?{' '}
            <Link to="/login" className={styles.loginLink}>Sign in here</Link>
          </p>

        </div>
      </div>
    </section>
  )
}