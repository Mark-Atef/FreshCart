# 🛒 FreshCart

**A full-featured e-commerce Single Page Application** built with React, Vite, and a live REST API. FreshCart covers the complete shopping journey — browsing, filtering, cart management, authentication, and checkout — deployed and live on Vercel.

🔗 **Live Demo:** [fresh-cart-pi-gilt.vercel.app](https://fresh-cart-pi-gilt.vercel.app/)
📦 **GitHub:** [github.com/Mark-Atef](https://github.com/Mark-Atef)

---

## ✨ Features

| Feature | Details |
|---|---|
|  Authentication | Register, Login, JWT token persistence, protected routes with redirect |
|  Products | Full product catalog with search, category filter, price range, and sort |
|  Categories | Browse by category with navigation to filtered products |
|  Brands | Browse top brands with hover effects |
|  Cart | Add, remove, update quantity, clear cart, free shipping logic |
|  Checkout | 3-step form: Delivery → Payment → Review with step-aware validation |
|  Profile | Account info, quick actions, session management, logout |
|  Notifications | React Hot Toast for all cart and auth feedback |
|  Responsive | Mobile-first design with hamburger drawer on all pages |
|  Performance | `useMemo`, `useCallback`, React Query caching, skeleton loaders |
|  URL Filters | Category filter syncs to URL `?category=` for shareable links |
|  Scroll to Top | Instant scroll to top on every route change |
| 404 Page | Custom not-found page with navigation shortcuts |

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Framework | React 19 + Vite 7 |
| Routing | React Router v7 |
| Data Fetching | @tanstack/react-query v5 |
| HTTP | Axios |
| Forms | Formik |
| Styling | CSS Modules |
| Notifications | react-hot-toast |
| Icons | FontAwesome 6 |
| Carousel | Swiper.js |
| Linting | Biome + ESLint |
| Deployment | Vercel |

---

## 📁 Project Structure

```
fresh-cart/
├── public/
├── src/
│   ├── assets/
│   │   └── images/              # Slider images, banners, logo
│   ├── Components/
│   │   ├── Layout/              # Layout wrapper with Navbar + Footer
│   │   ├── Navbar/              # Sticky navbar with cart badge
│   │   ├── Footer/              # Newsletter, links, payment icons
│   │   ├── ScrollToTop/         # Auto-scroll on route change
│   │   ├── ProtectedRoute/      # Auth guard with redirect
│   │   ├── Home/                # Hero carousel, features, categories, products
│   │   ├── Products/            # Full product grid with search + filters
│   │   ├── ProductDetailes/     # Product detail page with add to cart
│   │   ├── Categories/          # Category grid
│   │   ├── Brands/              # Brand grid
│   │   ├── Cart/                # Cart page with quantity controls
│   │   ├── Checkout/            # 3-step checkout form
│   │   ├── OrderSuccess/        # Post-order confirmation
│   │   ├── Profile/             # User profile and account info
│   │   ├── Login/               # Login with Formik
│   │   ├── Register/            # Register with Formik
│   │   └── NotFound/            # 404 page
│   ├── Context/
│   │   ├── Authentication.jsx   # Token state + provider
│   │   └── CartContext.jsx      # Cart operations + count badge
│   ├── App.jsx                  # Router config + providers
│   └── main.jsx                 # App entry point
├── vercel.json                  # SPA rewrites for Vercel
├── biome.json
└── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Mark-Atef/fresh-cart.git
cd fresh-cart

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🔑 Demo Account

You can register a new account directly on the app.

---

## 📱 Pages Overview

### 🏠 Home
- Hero carousel with autoplay and navigation
- Feature highlights strip
- Category carousel (Swiper.js)
- Promotional banners
- Featured products grid (8 products)
- Call-to-action section

### 📦 Products
- Full product grid (all products from API)
- Real-time search by title or category name
- Filter by category (synced to URL `?category=`)
- Filter by price range
- Sort by price, rating, or name
- Active filter pill with breadcrumb
- Skeleton loaders while fetching

### 🛒 Cart
- View all cart items with images, categories, and unit price
- Increment / decrement quantity per item
- Remove individual items
- Clear entire cart
- Order summary with free shipping threshold (200 EGP)
- Proceed to checkout button

### 💳 Checkout (3-step)
- **Step 1 — Delivery:** Name, phone, address, city, postal code, notes
- **Step 2 — Payment:** Card / Cash on Delivery / Digital Wallet
  - Card form with auto-formatting (number: `1234 5678 ...`, expiry: `MM / YY`)
- **Step 3 — Review:** Full order summary before placing
- Step-aware validation: only validates fields relevant to the current step
- `setTouched({})` called between steps so no premature red fields

### 👤 Profile
- User avatar with initials
- Account info from token decode (name, ID, role, expiry)
- Stats row: orders, wishlist, reviews, deliveries
- Quick action buttons
- Logout with danger zone

---

## ⚙️ Architecture Decisions

### Context API for Auth + Cart
Auth token and cart count live in separate React contexts. `CartContext` performs a silent startup fetch on mount — if a token exists, it loads the cart count so the navbar badge is accurate from the first second.

```jsx
// CartContext.jsx — silent cart load on app start
useEffect(() => {
  const token = localStorage.getItem('token')
  if (!token) return
  async function loadInitialCart() {
    try {
      const { data } = await axios.get(BASE_URL, { headers: getHeaders() })
      setCartCount(data.numOfCartItems ?? 0)
    } catch { /* silent fail */ }
  }
  loadInitialCart()
}, [])
```

### React Query for Data Fetching
All API reads (products, categories, brands) go through React Query with configured `staleTime` and `gcTime` so repeated visits hit the cache, not the network.

```jsx
const { data, isLoading } = useQuery({
  queryKey: ['allProducts'],
  queryFn: getAllProducts,
  staleTime: 5 * 60 * 1000,  // fresh for 5 minutes
  gcTime: 10 * 60 * 1000,    // kept in memory for 10 minutes
})
```

### Performance: `useMemo` + `useCallback`
Product filtering and sorting runs through `useMemo` so it only recalculates when the filter values actually change — not on every render.

```jsx
const filteredProducts = useMemo(() => {
  let result = [...allProducts]
  if (search.trim()) result = result.filter(p => p.title.toLowerCase().includes(search))
  if (selectedCategory !== 'all') result = result.filter(p => p.category?._id === selectedCategory)
  if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price)
  return result
}, [allProducts, search, selectedCategory, sortBy, priceRange])
```

### URL-Synced Filters
Category filter state is synced to the URL with `useSearchParams`, so:
- Users can share or bookmark filtered URLs
- Clicking a category from the Categories page pre-selects the filter

```jsx
// Read from URL on mount
const [selectedCategory, setSelectedCategory] = useState(
  searchParams.get('category') ?? 'all'
)

// Write to URL on change
searchParams.set('category', value)
setSearchParams(searchParams)
```

### Protected Routes
Routes requiring authentication redirect to `/login` with the original path stored in `location.state.from`, so the user is sent back after logging in.

```jsx
<Navigate to="/login" state={{ from: location.pathname }} replace />
// After login:
navigate(location.state?.from ?? '/')
```

---

## 🧠 Key Concepts Demonstrated

- **React 19** functional components with hooks
- **React Router v7** with nested routes and protected routes
- **React Query v5** with `queryKey`, `staleTime`, and `gcTime`
- **Formik** with custom validate function and step-aware validation
- **Context API** for global auth and cart state
- **useMemo** for expensive filter/sort operations
- **useCallback** for stable function references passed as props
- **useSearchParams** for URL-synced filters
- **useEffect + useCallback** pattern for stable async side effects
- **CSS Modules** with camelCase class names throughout
- **Skeleton loaders** on every data-fetching page
- **React Hot Toast** for all user-facing feedback

---

## 🚢 Deployment

Deployed on **Vercel** with a `vercel.json` rewrite to support SPA client-side routing:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

This ensures direct URL access and page refreshes work correctly without 404s.

---

## 🗺️ Roadmap

- [ ] Connect real order submission API
- [ ] Wishlist functionality (heart buttons already in UI)
- [ ] Order history page
- [ ] Product search with debounce
- [ ] TypeScript migration
- [ ] Unit tests (React Testing Library)
- [ ] Accessibility audit and aria improvements

---

## 👤 Author

**Mark Atef Yacoub**
- LinkedIn: [linkedin.com/in/mark-yacoub-005711255](https://www.linkedin.com/in/mark-yacoub-005711255)
- GitHub: [github.com/Mark-Atef](https://github.com/Mark-Atef)
- Email: Yacoub.markatef@gmail.com

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).