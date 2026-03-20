import { Link, useNavigate } from 'react-router-dom'
import styles from './Login.module.css'
import { useFormik } from 'formik'
import axios from 'axios'
import { useState } from 'react'
import { RotatingLines } from 'react-loader-spinner'

export default function Login() {

  const [errMessage, setErrMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

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
        setSuccessMessage('Login successful! Redirecting...')
        setTimeout(() => {
          navigate('/home')
        }, 2000)
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

      {/* Background decorative blobs */}
      <div className={styles.blob1}></div>
      <div className={styles.blob2}></div>

      <div className={styles.card}>

        {/* Top brand strip */}
        <div className={styles.brandStrip}>
          <i className="fa-solid fa-cart-shopping"></i>
          <span>FreshCart</span>
        </div>

        {/* Heading */}
        <div className={styles.headingBlock}>
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>Sign in to continue shopping</p>
        </div>

        {/* Alerts */}
        {errMessage && (
          <div className={styles.alertError}>
            <i className="fa-solid fa-circle-exclamation"></i>
            {errMessage}
          </div>
        )}
        {successMessage && (
          <div className={styles.alertSuccess}>
            <i className="fa-solid fa-circle-check"></i>
            {successMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={formik.handleSubmit} className={styles.form}>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">Email Address</label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>
                <i className="fa-regular fa-envelope"></i>
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
                <i className="fa-solid fa-lock"></i>
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