/** biome-ignore-all assist/source/organizeImports: intentional order */
/** biome-ignore-all lint/suspicious/noArrayIndexKey: <> */
import { useContext, useMemo, useState } from 'react'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CartContext } from '../../Context/CartContext'
import styles from './Products.module.css'
import { useAddToCart } from '../../hooks/useAddToCart'

// ── Fetch functions — OUTSIDE component ──
function getAllProducts() {
  return axios.get('https://ecommerce.routemisr.com/api/v1/products')
}

function getAllCategories() {
  return axios.get('https://ecommerce.routemisr.com/api/v1/categories')
}

// ── Star Rating ──
function StarRating({ rating }) {
  return (
    <div className={styles.stars}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = rating >= star
        const half = !filled && rating >= star - 0.5
        return (
          <i
            key={star}
            className={`fa-star ${filled ? 'fa-solid' : half ? 'fa-regular fa-star-half-stroke' : 'fa-regular'}`}
            style={{ color: filled || half ? '#f5a623' : '#ddd' }}
          />
        )
      })}
      <span className={styles.ratingNumber}>({rating})</span>
    </div>
  )
}

// ── Skeleton Card ──
function SkeletonCard() {
  return (
    <div className={styles.skeletonCard}>
      <div className={styles.skeletonImg} />
      <div className={styles.skeletonBody}>
        <div className={styles.skeletonCategory} />
        <div className={styles.skeletonTitle} />
        <div className={styles.skeletonTitleShort} />
        <div className={styles.skeletonBottom} />
      </div>
    </div>
  )
}

// ── Product Card ──
//    onAddToCart is the useAddToCart hook function — it already handles:
//    auth check, success toast, error toast, redirect to login
//    DO NOT add another try/catch or toast wrapper — it causes double toasts
function ProductCard({ product, onAddToCart, cartLoading }) {
  const navigate = useNavigate()

  return (
    <button
      type="button"
      className={styles.card}
      onClick={() => navigate(`/productDetailes/${product._id}`)}
    >
      <div className={styles.imageWrapper}>
        <img
          src={product.imageCover}
          alt={product.title}
          className={styles.image}
          loading="lazy"
        />
        <div className={styles.overlay}>
          <button
            type="button"
            className={styles.addToCartBtn}
            onClick={(e) => {
              // ✅ Stops click bubbling to the card button (which navigates)
              e.stopPropagation()
              // ✅ Let the hook handle everything — NO extra toast/catch needed
              onAddToCart(product._id, product.title)
            }}
            disabled={product.quantity === 0 || cartLoading}
          >
            {cartLoading
              ? <><i className="fa-solid fa-spinner fa-spin" /> Adding...</>
              : <><i className="fa-solid fa-cart-plus" /> Add to Cart</>
            }
          </button>
        </div>
      </div>
      <div className={styles.body}>
        <span className={styles.category}>{product.category?.name}</span>
        <h3 className={styles.title}>{product.title}</h3>
        <div className={styles.footer}>
          <span className={styles.price}>{product.price} EGP</span>
          <StarRating rating={product.ratingsAverage} />
        </div>
      </div>
    </button>
  )
}

// ── Main Products Page ──
export default function Products() {

  // ✅ cartLoading still from CartContext for the disabled/spinner state
  const { cartLoading } = useContext(CartContext)

  // ✅ useAddToCart hook — auth-aware, handles toasts, redirects if not logged in
  const onAddToCart = useAddToCart()

  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const selectedCategory = useMemo(
    () => searchParams.get('category') ?? 'all',
    [searchParams]
  )
  const [sortBy, setSortBy] = useState('default')
  const [priceRange, setPriceRange] = useState('all')

  const { data: productsData, isLoading, isError } = useQuery({
    queryKey: ['allProducts'],
    queryFn: getAllProducts,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })

  const { data: categoriesData } = useQuery({
    queryKey: ['allCategories'],
    queryFn: getAllCategories,
    staleTime: 15 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  })

  const allProducts = useMemo(() => productsData?.data?.data ?? [], [productsData])
  const allCategories = useMemo(() => categoriesData?.data?.data ?? [], [categoriesData])

  function handleCategoryChange(value) {
    const nextParams = new URLSearchParams(searchParams)
    if (value === 'all') {
      nextParams.delete('category')
    } else {
      nextParams.set('category', value)
    }
    setSearchParams(nextParams)
  }

  const filteredProducts = useMemo(() => {
    let result = [...allProducts]

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.category?.name.toLowerCase().includes(q)
      )
    }

    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category?._id === selectedCategory)
    }

    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number)
      result = result.filter(p => max ? p.price >= min && p.price <= max : p.price >= min)
    }

    if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price)
    else if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price)
    else if (sortBy === 'rating') result.sort((a, b) => b.ratingsAverage - a.ratingsAverage)
    else if (sortBy === 'name') result.sort((a, b) => a.title.localeCompare(b.title))

    return result
  }, [allProducts, search, selectedCategory, sortBy, priceRange])

  const activeCategoryName = useMemo(() => {
    if (selectedCategory === 'all') return null
    return allCategories.find(c => c._id === selectedCategory)?.name ?? null
  }, [selectedCategory, allCategories])

  function handleReset() {
    setSearch('')
    handleCategoryChange('all')
    setSortBy('default')
    setPriceRange('all')
  }

  const hasActiveFilters = search || selectedCategory !== 'all' || sortBy !== 'default' || priceRange !== 'all'

  return (
    <section className={styles.section}>

      <div className={styles.pageHeader}>
        <div>
          {activeCategoryName && (
            <div className={styles.breadcrumb}>
              <button type="button" className={styles.breadcrumbLink} onClick={handleReset}>
                All Products
              </button>
              <i className="fa-solid fa-chevron-right" />
              <span className={styles.breadcrumbCurrent}>{activeCategoryName}</span>
            </div>
          )}
          <h1 className={styles.pageTitle}>
            {activeCategoryName ?? 'All Products'}
          </h1>
          <p className={styles.pageSubtitle}>
            {isLoading
              ? 'Loading products...'
              : `Showing ${filteredProducts.length} of ${allProducts.length} products`}
          </p>
        </div>
      </div>

      <div className={styles.filtersBar}>

        <div className={styles.searchWrapper}>
          <i className="fa-solid fa-magnifying-glass" />
          <input
            type="text"
            placeholder="Search products..."
            className={styles.searchInput}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              type="button"
              className={styles.searchClear}
              onClick={() => setSearch('')}
              aria-label="Clear search"
            >
              <i className="fa-solid fa-xmark" />
            </button>
          )}
        </div>

        <select
          className={styles.filterSelect}
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
          aria-label="Filter by category"
        >
          <option value="all">All Categories</option>
          {allCategories.map(cat => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>

        <select
          className={styles.filterSelect}
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
          aria-label="Filter by price"
        >
          <option value="all">Any Price</option>
          <option value="0-100">Under 100 EGP</option>
          <option value="100-300">100 – 300 EGP</option>
          <option value="300-500">300 – 500 EGP</option>
          <option value="500-1000">500 – 1000 EGP</option>
          <option value="1000-999999">Over 1000 EGP</option>
        </select>

        <select
          className={styles.filterSelect}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          aria-label="Sort products"
        >
          <option value="default">Default Order</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
          <option value="name">Name A–Z</option>
        </select>

        {hasActiveFilters && (
          <button type="button" className={styles.resetBtn} onClick={handleReset}>
            <i className="fa-solid fa-rotate-left" /> Reset
          </button>
        )}
      </div>

      {activeCategoryName && (
        <div className={styles.activePill}>
          <i className="fa-solid fa-layer-group" />
          {activeCategoryName}
          <button type="button" className={styles.pillRemove} onClick={handleReset} aria-label="Remove filter">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
      )}

      {isError && (
        <div className={styles.errorBox}>
          <i className="fa-solid fa-circle-exclamation" />
          Failed to load products. Please try again.
        </div>
      )}

      {!isLoading && filteredProducts.length === 0 && !isError && (
        <div className={styles.noResults}>
          <i className="fa-solid fa-box-open" />
          <h3>No products found</h3>
          <p>Try adjusting your search or filters</p>
          <button type="button" className={styles.resetBtn} onClick={handleReset}>
            Clear all filters
          </button>
        </div>
      )}

      <div className={styles.grid}>
        {isLoading
          ? Array.from({ length: 8 }, (_, i) => <SkeletonCard key={`skeleton-${i}`} />)
          : filteredProducts.map(product => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={onAddToCart}   // ✅ hook passed as prop
                cartLoading={cartLoading}
              />
            ))
        }
      </div>

    </section>
  )
}