/** biome-ignore-all assist/source/organizeImports: <> */
import { Link, useNavigate, useLocation } from 'react-router-dom'
import styles from './Login.module.css'
import { useFormik } from 'formik'
import axios from 'axios'
import { useContext, useState, useEffect, useRef } from 'react'
import { RotatingLines } from 'react-loader-spinner'
import { AuthenticationContext } from '../../Context/Authentication.jsx'

export default function Login() {

  const { setToken } = useContext(AuthenticationContext)
  const [errMessage, setErrMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Where the user was trying to go before being redirected to login
  const from = location.state?.from || '/'

  // Ref attached to the alert div — used to scroll to it
  const alertRef = useRef(null)

  // Scroll to alert whenever errMessage or successMessage appears
  useEffect(() => {
    if (errMessage || successMessage) {
      alertRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [errMessage, successMessage])

  async function loginUser(values) {
    setErrMessage(null)
    setSuccessMessage(null)
    setIsLoading(true)

    try {
      const { data } = await axios.post(
        'https://ecommerce.routemisr.com/api/v1/auth/signin',
        values
      )

      if (data.message === 'success') {
        localStorage.setItem('token', data.token)
        setToken(data.token)
        setSuccessMessage('Login successful! Redirecting...')
        setTimeout(() => {
          // Go back to where the user originally came from
          navigate(from)
        }, 1500)
      }

    } catch (err) {
      const message = err.response?.data?.message || 'Something went wrong'
      setErrMessage(message)
    } finally {
      setIsLoading(false)
    }
  }

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validateOnMount: true,
    onSubmit: loginUser,
    validate: (values) => {
      const errors = {}
      if (!values.email) {
        errors.email = 'Email is required'
      } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
        errors.email = 'Enter a valid email'
      }
      if (!values.password) {
        errors.password = 'Password is required'
      } else if (values.password.length < 8) {
        errors.password = 'Password must be at least 8 characters'
      }
      return errors
    },
  })

  return (
    <section className={styles.section}>

      <div className={styles.blob1} />
      <div className={styles.blob2} />

      <div className={styles.card}>

        <div className={styles.brandStrip}>
          <i className="fa-solid fa-cart-shopping" />
          <span>FreshCart</span>
        </div>

        <div className={styles.headingBlock}>
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>
            {/* Tell user where they'll be redirected after login */}
            {from !== '/'
              ? `Sign in to continue to ${from.replace('/', '')}`
              : 'Sign in to continue shopping'}
          </p>
        </div>

        {/* ref attached here — scrolls into view when message appears */}
        <div ref={alertRef}>
          {errMessage && (
            <div className={styles.alertError}>
              <i className="fa-solid fa-circle-exclamation" />
              {errMessage}
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
            <label className={styles.label} htmlFor="email">Email Address</label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>
                <i className="fa-regular fa-envelope" />
              </span>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                className={styles.input}
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.errors.email && formik.touched.email && (
              <span className={styles.errorMessage}>{formik.errors.email}</span>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">Password</label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>
                <i className="fa-solid fa-lock" />
              </span>
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

          <button
            type="submit"
            disabled={!formik.isValid || !formik.dirty || isLoading}
            className={styles.btn}
          >
            {isLoading && (
              <RotatingLines visible height="18" width="18" color="white" strokeWidth="5" />
            )}
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>

        </form>

        <p className={styles.registerText}>
          Don't have an account?{' '}
          <Link to="/register" className={styles.registerLink}>Create one here</Link>
        </p>

      </div>
    </section>
  )
}