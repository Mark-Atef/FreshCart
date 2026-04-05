/** biome-ignore-all lint/complexity/noUselessFragments: <> */
/** biome-ignore-all assist/source/organizeImports: <> */
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './Components/Layout/Layout'
import Home from './Components/Home/Home'
import Brands from './Components/Brands/Brands'
import Cart from './Components/Cart/Cart'
import Categories from './Components/Categories/Categories'
import Login from './Components/Login/Login'
import NotFound from './Components/NotFound/NotFound'
import Products from './Components/Products/Products'
import Register from './Components/Register/Register'
import Profile from './Components/Profile/Profile'
import ProductDetailes from './Components/ProductDetailes/ProductDetailes'
import { AuthenticationProvider } from './Context/Authentication.jsx'
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CartContextProvider } from './Context/CartContext'
import { Toaster } from "react-hot-toast";
import Checkout from './Components/Checkout/Checkout'
import OrderSuccess from './Components/OrderSuccess/OrderSuccess'

const queryClient = new QueryClient();

const myRouter = createBrowserRouter([

  {
    path: '/', element: <Layout />, children: [
      { index: true, element: <Home /> },
      { path: 'home', element: <Home /> },
      { path: 'brands', element: <Brands /> },
      { path: 'cart', element: <ProtectedRoute><Cart /></ProtectedRoute> },
      { path: 'categories', element: <Categories /> },
      { path: 'login', element: <Login /> },
      { path: 'products', element: <Products /> },
      { path: 'register', element: <Register /> },
      { path: 'profile', element: <ProtectedRoute><Profile /></ProtectedRoute> },
      { path: 'productDetailes/:id', element: <ProtectedRoute><ProductDetailes /></ProtectedRoute> },
      { path: 'checkout', element: <ProtectedRoute><Checkout /></ProtectedRoute> },
      { path: 'order-success', element: <ProtectedRoute><OrderSuccess /></ProtectedRoute> },
      { path: '*', element: <NotFound /> },
    ]
  },
])

export default function App() {

  return <>
    <QueryClientProvider client={queryClient}>

      <CartContextProvider>

        <AuthenticationProvider>
          <RouterProvider router={myRouter} />

          {/*  Toaster renders toast notifications globally — place it once here */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                borderRadius: '12px',
                fontWeight: '600',
                fontSize: '0.9rem',
              },
              success: {
                style: {
                  background: '#e8f5e9',
                  color: '#2e7d32',
                  border: '1px solid rgba(46,125,50,0.2)',
                },
                iconTheme: { primary: '#4caf50', secondary: '#fff' },
              },
              error: {
                style: {
                  background: '#ffebee',
                  color: '#c62828',
                  border: '1px solid rgba(198,40,40,0.2)',
                },
                iconTheme: { primary: '#e53935', secondary: '#fff' },
              },
            }}
          />

        </AuthenticationProvider>

      </CartContextProvider>

    </QueryClientProvider>
  </>
}
