/** biome-ignore-all lint/complexity/noUselessFragments: React fragments required for layout wrapper */
/** biome-ignore-all assist/source/organizeImports: <> */
import { Link, useNavigate } from 'react-router-dom'
import styles from './Register.module.css'
import { useFormik } from 'formik'
import axios from 'axios';
import { useState } from 'react';
import { RotatingLines } from 'react-loader-spinner';



export default function Register() {

  const [errMessage, setErrMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate();


  async function registerNewUser(values) {
    setErrMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {

      const { data } = await axios.post("https://ecommerce.routemisr.com/api/v1/auth/signup", values);
      console.log(data);

      if (data.message === "success") {
        // success message for user => navigate to login 
        setSuccessMessage(" Account has Created ")

        setTimeout(() => {
          navigate("/login");
        }, 2500);

      }
    }

    catch (err) {


      setErrMessage(err.response?.data?.message || "Something went wrong");
      const message = err.response?.data?.message
      if (message.includes("exist")) {
        setErrMessage("Email already exists. Try logging in.");
      } else {
        setErrMessage(message);
      }

    }
    finally {
      setIsLoading(false);
    }
  }


  const formik = useFormik({

    initialValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      phone: ""
    },

    validateOnMount: true,

    onSubmit: registerNewUser,

    validate: (values) => {

      const errors = {}

      if (!values.name || values.name.length < 2) {
        errors.name = "Name must be at least 2 characters"
      }

      if (!values.email) {
        errors.email = "Email is required"
      } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
        errors.email = "Enter valid email"
      }

      if (!/^(02)?01[0125][0-9]{8}$/.test(values.phone)) {
        errors.phone = "Enter Valid Phone Number"
      }

      if (!values.password) {
        errors.password = "Password is required"
      }
      else if (values.password.length < 8) {
        errors.password = "Password must be at least 8 characters"
      }

      if (values.rePassword !== values.password) {
        errors.rePassword = "Password and RePassword Doesn't Match"
      }

      return errors;
    }

  });

  return <>

    <section className={styles.section}>

      <div className={styles.card}>

        {/* Left decorative panel */}
        <div className={styles.panel}>
          <div className={styles.panelContent}>
            <div className={styles.panelIcon}><i className="fa-solid fa-cart-shopping"></i></div>
            <h2 className={styles.panelTitle}>Welcome to FreshCart</h2>
            <p className={styles.panelText}>
              Fresh groceries delivered to your door. Join thousands of happy customers today.
            </p>
            <ul className={styles.panelList}>
              <li><i className="fa-solid fa-basket-shopping"></i> Fresh produce daily</li>
              <li><i className="fa-solid fa-truck-fast"></i> Free delivery over 200 EGP</li>
              <li><i className="fa-solid fa-credit-card"></i> Secure payments</li>
              <li><i className="fa-solid fa-star"></i> Exclusive member deals</li>
            </ul>
          </div>
          <div className={styles.panelCircle1}></div>
          <div className={styles.panelCircle2}></div>
        </div>

        {/* Right form panel */}
        <div className={styles.formSide}>
          <div className='rightPanelWrapper'>
            <h1 className={styles.title}>Create Account</h1>
            {errMessage && (
              <div className='errMessage'>
                {errMessage}
                {errMessage?.toLowerCase().includes("exist") && (
                  <button
                    type='button'
                    className={styles.loginRedirectBtn}
                    onClick={() => navigate("/login")}
                  >
                    Go to Login
                  </button>
                )}
              </div>
            )}
            {successMessage && (
              <div className='successMessage'>
                {successMessage}
              </div>
            )}
          </div>

          <p className={styles.subtitle}>Fill in your details to get started</p>

          <form onSubmit={formik.handleSubmit} className={styles.form}>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="name">Full Name</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}><i className="fa-regular fa-circle-user"></i></span>
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

            <div className={styles.field}>
              <label className={styles.label} htmlFor="email">Email Address</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}><i className="fa-regular fa-envelope"></i></span>
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

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="password">Password</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}><i className="fa-solid fa-lock"></i></span>
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
                  <span className={styles.inputIcon}><i className="fa-solid fa-lock"></i></span>
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
                <span className={styles.inputIcon}><i className="fa-solid fa-phone"></i></span>
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

            <button type="submit" disabled={!formik.isValid || !formik.dirty || isLoading} className={styles.btn}>
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

  </>
}
