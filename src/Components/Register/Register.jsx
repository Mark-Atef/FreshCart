/** biome-ignore-all lint/complexity/noUselessFragments: React fragments required for layout wrapper */
/** biome-ignore-all assist/source/organizeImports: <> */
import { Link } from 'react-router-dom'
import styles from './Register.module.css'
import { useFormik } from 'formik'



export default function Register() {


  const formik = useFormik({

    initialValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      phone: ""
    },

    validateOnMount: true,

    onSubmit: (Values) => {
      console.log("Submitted.", Values);
    },

    validate: (values) => {

      const errors = {}

      if (values.name.length < 2) {
        errors.name = "Name must be at least 2 characters"
      }

      if (!/^\S+@\S+\.\S+$/.test(values.email)) {
        errors.email = "Enter Valid E-mail"
      }

      if (!/^(02)?01[0125][0-9]{8}$/.test(values.phone)) {
        errors.phone = "Enter Valid Phone Number"
      }

      if (values.password.length < 8) {
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
          <h1 className={styles.title}>Create Account</h1>
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
                  required
                  minLength={2}
                />
                {formik.errors.name && formik.touched.name ? <span className={styles.errorMessage} id="nameError"> {formik.errors.name} </span> : null}
              </div>
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
                  required
                />
                {formik.errors.email && formik.touched.email ? <span className={styles.errorMessage} id="emailError"> {formik.errors.email} </span> : null}
              </div>
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
                    required
                  />
                  {formik.errors.password && formik.touched.password ? <span className={styles.errorMessage} id="passwordError"> {formik.errors.password} </span> : null}
                </div>
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
                    required
                  />
                  {formik.errors.rePassword && formik.touched.rePassword ? <span className={styles.errorMessage} id="rePasswordError"> {formik.errors.rePassword} </span> : null}
                </div>
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
                  required
                />
                { formik.errors.phone && formik.touched.phone ? <span className={styles.errorMessage} id="phoneError"> {formik.errors.phone} </span> : null }
              </div>
            </div>

            <button type="submit" disabled={ !formik.isValid || !formik.dirty } className={styles.btn}>
              Create My Account
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
