/** biome-ignore-all assist/source/organizeImports: <> */
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import { Outlet } from 'react-router-dom'
import ScrollToTop from '../ScrollToTop/ScrollToTop'

export default function Layout() {
  return <>

    {/* ✅ Scrolls to top on every route change */}
    <ScrollToTop />
    <Navbar />
    <Outlet />
    <Footer />

  </>
}
