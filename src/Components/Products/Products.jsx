/** biome-ignore-all assist/source/organizeImports: <> */
/** biome-ignore-all lint/suspicious/noArrayIndexKey: <> */
import { useState } from 'react'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import styles from './Products.module.css'

// ── Fetch function — lives OUTSIDE the component ──
function getAllProducts() {
  return axios.get('https://ecommerce.routemisr.com/api/v1/products')
}

// ── Star Rating Component ──
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
function ProductCard({ product }) {
  const [wishlist, setWishlist] = useState(false)

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <img
          src={product.imageCover}
          alt={product.title}
          className={styles.image}
          loading="lazy"
        />
        <button
          type="button"
          className={`${styles.wishlistBtn} ${wishlist ? styles.wishlistActive : ''}`}
          onClick={() => setWishlist(prev => !prev)}
          aria-label="Add to wishlist"
        >
          <i className={wishlist ? 'fa-solid fa-heart' : 'fa-regular fa-heart'} />
        </button>
        <div className={styles.overlay}>
          <button type="button" className={styles.addToCartBtn}>
            <i className="fa-solid fa-cart-plus" /> Add to Cart
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
    </div>
  )
}

// ── Main Products Page ──
export default function Products() {

  const { data, isLoading, isError } = useQuery({
    queryKey: ['allProducts'],
    queryFn: getAllProducts,
  })

  const products = data?.data?.data ?? []

  return (
    <section className={styles.section}>

      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>All Products</h1>
        <p className={styles.pageSubtitle}>
          {isLoading ? 'Loading...' : `${products.length} products available`}
        </p>
      </div>

      {isError && (
        <div className={styles.errorBox}>
          <i className="fa-solid fa-circle-exclamation" />
          Failed to load products. Please try again.
        </div>
      )}

      <div className={styles.grid}>
        {isLoading
          ? Array.from({ length: 8 }, (_, i) => <SkeletonCard key={`skeleton-${i}`} />)
          : products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))
        }
      </div>

    </section>
  )
}