/** biome-ignore-all assist/source/organizeImports: <> */
import { useContext, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import toast from 'react-hot-toast'
import styles from './ProductDetailes.module.css'
import { CartContext } from '../../Context/CartContext'

// ── Fetch function — OUTSIDE component ──
function fetchProductDetails(id) {
  return axios.get(`https://ecommerce.routemisr.com/api/v1/products/${id}`)
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
      <span className={styles.ratingValue}>{rating} / 5</span>
    </div>
  )
}

// ── Skeleton Loader ──
function ProductDetailSkeleton() {
  return (
    <div className={styles.skeletonWrapper}>
      <div className={styles.skeletonImageBox}>
        <div className={styles.skeletonMainImg} />
        <div className={styles.skeletonThumbs}>
          {[1, 2, 3].map(i => <div key={i} className={styles.skeletonThumb} />)}
        </div>
      </div>
      <div className={styles.skeletonInfo}>
        <div className={styles.skeletonLine} style={{ width: '35%', height: '14px' }} />
        <div className={styles.skeletonLine} style={{ width: '85%', height: '28px' }} />
        <div className={styles.skeletonLine} style={{ width: '60%', height: '28px' }} />
        <div className={styles.skeletonLine} style={{ width: '30%', height: '18px' }} />
        <div className={styles.skeletonLine} style={{ width: '100%', height: '12px' }} />
        <div className={styles.skeletonLine} style={{ width: '90%', height: '12px' }} />
        <div className={styles.skeletonLine} style={{ width: '75%', height: '12px' }} />
        <div className={styles.skeletonLine} style={{ width: '50%', height: '44px', borderRadius: '12px' }} />
      </div>
    </div>
  )
}

// ── Main ProductDetailes Page ──
export default function ProductDetailes() {

  const { addToCart, cartLoading } = useContext(CartContext)
  const { id } = useParams()
  const navigate = useNavigate()
  const [quantity, setQuantity] = useState(1)
  const [wishlist, setWishlist] = useState(false)
  const [activeImage, setActiveImage] = useState(0)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['productDetails', id],
    queryFn: () => fetchProductDetails(id),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })

  const product = data?.data?.data

  const images = product
    ? [product.imageCover, ...(product.images ?? [])].filter(Boolean)
    : []

  // ✅ Handle add to cart with toast
  async function handleAddToCart() {
    try {
      await addToCart(product._id)
      toast.success(`${product.title.split(' ').slice(0, 3).join(' ')} added to cart!`)
    } catch {
      toast.error('Failed to add to cart. Please try again.')
    }
  }

  if (isError) {
    return (
      <section className={styles.section}>
        <div className={styles.errorBox}>
          <i className="fa-solid fa-circle-exclamation" />
          <div>
            <h3>Failed to load product</h3>
            <button type="button" className={styles.retryBtn} onClick={() => navigate(-1)}>
              <i className="fa-solid fa-arrow-left" /> Go Back
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.section}>

      <nav className={styles.breadcrumb}>
        <button type="button" onClick={() => navigate('/products')} className={styles.breadcrumbLink}>
          Products
        </button>
        <i className="fa-solid fa-chevron-right" />
        <span className={styles.breadcrumbCurrent}>
          {isLoading ? '...' : product?.title?.split(' ').slice(0, 4).join(' ')}
        </span>
      </nav>

      {isLoading ? <ProductDetailSkeleton /> : (
        <div className={styles.wrapper}>

          {/* ── Image Gallery ── */}
          <div className={styles.gallery}>
            <div className={styles.mainImageWrapper}>
              <img
                src={images[activeImage] || product.imageCover}
                alt={product.title}
                className={styles.mainImage}
              />
              <button
                type="button"
                className={`${styles.wishlistBtn} ${wishlist ? styles.wishlistActive : ''}`}
                onClick={() => setWishlist(prev => !prev)}
                aria-label="Wishlist"
              >
                <i className={wishlist ? 'fa-solid fa-heart' : 'fa-regular fa-heart'} />
              </button>
            </div>

            {images.length > 1 && (
              <div className={styles.thumbs}>
                {images.map((img, i) => (
                  <button
                    key={img}
                    type="button"
                    className={`${styles.thumb} ${activeImage === i ? styles.thumbActive : ''}`}
                    onClick={() => setActiveImage(i)}
                  >
                    <img src={img} alt={`View ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Product Info ── */}
          <div className={styles.info}>

            <span className={styles.categoryBadge}>{product.category?.name}</span>
            <h1 className={styles.title}>{product.title}</h1>

            <div className={styles.ratingRow}>
              <StarRating rating={product.ratingsAverage} />
              <span className={styles.ratingCount}>({product.ratingsQuantity} reviews)</span>
            </div>

            <div className={styles.priceRow}>
              <span className={styles.price}>{product.price} EGP</span>
              {product.priceAfterDiscount && (
                <span className={styles.oldPrice}>{product.priceAfterDiscount} EGP</span>
              )}
            </div>

            <p className={styles.description}>{product.description}</p>
            <div className={styles.divider} />

            <div className={styles.stockRow}>
              <span className={`${styles.stockBadge} ${product.quantity > 0 ? styles.inStock : styles.outOfStock}`}>
                <i className={`fa-solid ${product.quantity > 0 ? 'fa-circle-check' : 'fa-circle-xmark'}`} />
                {product.quantity > 0 ? `In Stock (${product.quantity})` : 'Out of Stock'}
              </span>
            </div>

            <div className={styles.quantityRow}>
              <span className={styles.quantityLabel}>Quantity</span>
              <div className={styles.quantityControls}>
                <button
                  type="button"
                  className={styles.qtyBtn}
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >
                  <i className="fa-solid fa-minus" />
                </button>
                <span className={styles.qtyValue}>{quantity}</span>
                <button
                  type="button"
                  className={styles.qtyBtn}
                  onClick={() => setQuantity(q => Math.min(product.quantity, q + 1))}
                  disabled={quantity >= product.quantity}
                >
                  <i className="fa-solid fa-plus" />
                </button>
              </div>
            </div>

            <div className={styles.actions}>
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
              <button
                type="button"
                className={styles.buyNowBtn}
                disabled={product.quantity === 0}
              >
                Buy Now
              </button>
            </div>

            <div className={styles.deliveryInfo}>
              <div className={styles.deliveryItem}>
                <i className="fa-solid fa-truck-fast" />
                <span>Free delivery on orders over 200 EGP</span>
              </div>
              <div className={styles.deliveryItem}>
                <i className="fa-solid fa-rotate-left" />
                <span>Easy 30-day returns</span>
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  )
}