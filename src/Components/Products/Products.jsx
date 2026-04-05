/** biome-ignore-all assist/source/organizeImports: intentional order */
/** biome-ignore-all lint/suspicious/noArrayIndexKey: <> */
import { useCallback, useContext, useMemo, useState } from 'react'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { CartContext } from '../../Context/CartContext'
import toast from 'react-hot-toast'
import styles from './Products.module.css'

// ── Fetch functions — OUTSIDE component, never recreated ──
function getAllProducts() {
  return axios.get('https://ecommerce.routemisr.com/api/v1/products')
}

function getAllCategories() {
  return axios.get('https://ecommerce.routemisr.com/api/v1/categories')
}

// ── Star Rating — pure display, no state ──
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

// ── Product Card — no internal state that causes rerenders ──
function ProductCard({ product, onAddToCart, cartLoading }) {
  const navigate = useNavigate()

  function handleCardClick() {
    navigate(`/productDetailes/${product._id}`)
  }

  async function handleAddToCart(e) {
    e.stopPropagation()
    try {
      await onAddToCart(product._id)
      toast.success(`${product.title.split(' ').slice(0, 3).join(' ')} added!`)
    } catch {
      toast.error('Failed to add to cart. Try again.')
    }
  }

  return (
    <button
      type="button"
      className={styles.card}
      onClick={handleCardClick}
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
            onClick={handleAddToCart}
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

  const { addToCart, cartLoading } = useContext(CartContext)

  // ── Filters state ──
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('default')
  const [priceRange, setPriceRange] = useState('all')

  // ── Fetch products ──
  const { data: productsData, isLoading, isError } = useQuery({
    queryKey: ['allProducts'],
    queryFn: getAllProducts,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })

  // ── Fetch categories for filter ──
  const { data: categoriesData } = useQuery({
    queryKey: ['allCategories'],
    queryFn: getAllCategories,
    staleTime: 15 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  })

  const allProducts = useMemo(() => productsData?.data?.data ?? [], [productsData])
  const allCategories = categoriesData?.data?.data ?? []

  // ── useCallback — stable reference, ProductCard won't rerender due to this ──
  const handleAddToCart = useCallback((productId) => {
    return addToCart(productId)
  }, [addToCart])

  // ── useMemo — only recalculates when filters or products change ──
  const filteredProducts = useMemo(() => {
    let result = [...allProducts]

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.category?.name.toLowerCase().includes(q)
      )
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category?._id === selectedCategory)
    }

    // Price range filter
    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number)
      result = result.filter(p => {
        if (max) return p.price >= min && p.price <= max
        return p.price >= min // "500+" case
      })
    }

    // Sort
    if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price)
    else if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price)
    else if (sortBy === 'rating') result.sort((a, b) => b.ratingsAverage - a.ratingsAverage)
    else if (sortBy === 'name') result.sort((a, b) => a.title.localeCompare(b.title))

    return result
  }, [allProducts, search, selectedCategory, sortBy, priceRange])

  // ── Reset all filters ──
  function handleReset() {
    setSearch('')
    setSelectedCategory('all')
    setSortBy('default')
    setPriceRange('all')
  }

  const hasActiveFilters = search || selectedCategory !== 'all' || sortBy !== 'default' || priceRange !== 'all'

  return (
    <section className={styles.section}>

      {/* ── Page Header ── */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>All Products</h1>
          <p className={styles.pageSubtitle}>
            {isLoading
              ? 'Loading products...'
              : `Showing ${filteredProducts.length} of ${allProducts.length} products`}
          </p>
        </div>
      </div>

      {/* ── Search + Filters Bar ── */}
      <div className={styles.filtersBar}>

        {/* Search */}
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

        {/* Category filter */}
        <select
          className={styles.filterSelect}
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          aria-label="Filter by category"
        >
          <option value="all">All Categories</option>
          {allCategories.map(cat => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>

        {/* Price range */}
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

        {/* Sort */}
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

        {/* Reset */}
        {hasActiveFilters && (
          <button
            type="button"
            className={styles.resetBtn}
            onClick={handleReset}
          >
            <i className="fa-solid fa-rotate-left" /> Reset
          </button>
        )}
      </div>

      {/* ── Error ── */}
      {isError && (
        <div className={styles.errorBox}>
          <i className="fa-solid fa-circle-exclamation" />
          Failed to load products. Please try again.
        </div>
      )}

      {/* ── No results ── */}
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

      {/* ── Grid ── */}
      <div className={styles.grid}>
        {isLoading
          ? Array.from({ length: 8 }, (_, i) => <SkeletonCard key={`skeleton-${i}`} />)
          : filteredProducts.map(product => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={handleAddToCart}
                cartLoading={cartLoading}
              />
            ))
        }
      </div>

    </section>
  )
}