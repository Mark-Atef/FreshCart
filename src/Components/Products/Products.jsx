/** biome-ignore-all assist/source/organizeImports: <> */
import { useContext, useState } from 'react'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { CartContext } from '../../Context/CartContext'
import toast from 'react-hot-toast'
import styles from './Products.module.css'

// ── Fetch function — OUTSIDE component ──
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
// ✅ addToCart and cartLoading are passed as PROPS — not accessed from thin air
function ProductCard({ product, addToCart, cartLoading }) {
  const [wishlist, setWishlist] = useState(false)
  const navigate = useNavigate()

  // ✅ Handle add to cart with toast notifications
  async function handleAddToCart(e) {
    e.stopPropagation() // prevent navigating to product details
    try {
      await addToCart(product._id)
      toast.success(`${product.title.split(' ').slice(0, 3).join(' ')} added to cart!`)
    } catch {
      toast.error('Failed to add to cart. Please try again.')
    }
  }

  return (
    <div
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

        <button
          type="button"
          className={`${styles.wishlistBtn} ${wishlist ? styles.wishlistActive : ''}`}
          onClick={(e) => { e.stopPropagation(); setWishlist(prev => !prev) }}
          aria-label="Add to wishlist"
        >
          <i className={wishlist ? 'fa-solid fa-heart' : 'fa-regular fa-heart'} />
        </button>

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
    </div>
  )
}

// ── Main Products Page ──
export default function Products() {

  // ✅ useContext in the PARENT — then pass down as props
  const { addToCart, cartLoading } = useContext(CartContext)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['allProducts'],
    queryFn: getAllProducts,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
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
              // ✅ addToCart and cartLoading passed as props
              <ProductCard
                key={product._id}
                product={product}
                addToCart={addToCart}
                cartLoading={cartLoading}
              />
            ))
        }
      </div>

    </section>
  )
}