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
import { CartContextProvider } from './Components/Cart/Cart';


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
        </AuthenticationProvider>

      </CartContextProvider>

    </QueryClientProvider>
  </>
}
