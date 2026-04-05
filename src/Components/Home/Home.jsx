/** biome-ignore-all assist/source/organizeImports: intentional order */
/** biome-ignore-all lint/suspicious/noArrayIndexKey: <> */
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useContext } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import styles from './Home.module.css'
import slide1 from '../../assets/images/slider-image-1.jpeg'
import slide2 from '../../assets/images/slider-image-2.jpeg'
import slide3 from '../../assets/images/slider-image-3.jpeg'
import groceryBanner from '../../assets/images/grocery-banner.png'
import groceryBanner2 from '../../assets/images/grocery-banner-2.jpeg'
import { AuthenticationContext } from '../../Context/Authentication.jsx'
import { CartContext } from '../../Context/CartContext.jsx' // ✅ was missing!

// ── Fetch functions — outside component ──
function getFeaturedProducts() {
  return axios.get('https://ecommerce.routemisr.com/api/v1/products?limit=8')
}
function getCategories() {
  return axios.get('https://ecommerce.routemisr.com/api/v1/categories?limit=6')
}

// ── Skeleton: Product ──
function ProductSkeleton() {
  return (
    <div className={styles.productSkeleton}>
      <div className={styles.skeletonImg} />
      <div className={styles.skeletonBody}>
        <div className={styles.skeletonLine} style={{ width: '40%', height: '10px' }} />
        <div className={styles.skeletonLine} style={{ width: '90%', height: '13px' }} />
        <div className={styles.skeletonLine} style={{ width: '60%', height: '13px' }} />
        <div className={styles.skeletonLine} style={{ width: '75%', height: '12px', marginTop: '4px' }} />
      </div>
    </div>
  )
}

// ── Skeleton: Category ──
function CategorySkeleton() {
  return (
    <div className={styles.categorySkeleton}>
      <div className={styles.skeletonCatImg} />
      <div className={styles.skeletonLine} style={{ width: '60%', height: '12px', margin: '0.75rem auto 0' }} />
    </div>
  )
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
            style={{ color: filled || half ? '#f5a623' : '#ddd', fontSize: '0.7rem' }}
          />
        )
      })}
    </div>
  )
}

// ── Product Card ──
// ✅ addToCart and cartLoading received as PROPS
function ProductCard({ product, addToCart, cartLoading }) {
  const navigate = useNavigate()

  async function handleAddToCart(e) {
    e.stopPropagation() // prevent card click from navigating
    try {
      await addToCart(product._id)
      toast.success(`${product.title.split(' ').slice(0, 3).join(' ')} added to cart!`)
    } catch {
      toast.error('Failed to add to cart. Please try again.')
    }
  }

  return (
    <button
      type="button"
      className={styles.productCard}
      onClick={() => navigate(`/productDetailes/${product._id}`)}
    >
      <div className={styles.productImageWrapper}>
        <img src={product.imageCover} alt={product.title} className={styles.productImage} loading="lazy" />
        <div className={styles.productOverlay}>
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
      <div className={styles.productBody}>
        <span className={styles.productCategory}>{product.category?.name}</span>
        <h3 className={styles.productTitle}>{product.title}</h3>
        <div className={styles.productFooter}>
          <span className={styles.productPrice}>{product.price} EGP</span>
          <StarRating rating={product.ratingsAverage} />
        </div>
      </div>
    </button>
  )
}

// ── Section Header ──
function SectionHeader({ title, subtitle, linkTo, linkLabel }) {
  return (
    <div className={styles.sectionHeader}>
      <div>
        <h2 className={styles.sectionTitle}>{title}</h2>
        {subtitle && <p className={styles.sectionSubtitle}>{subtitle}</p>}
      </div>
      {linkTo && (
        <Link to={linkTo} className={styles.seeAllBtn}>
          {linkLabel} <i className="fa-solid fa-arrow-right" />
        </Link>
      )}
    </div>
  )
}

// ── Main Home Page ──
export default function Home() {

  // ✅ Both contexts imported and used correctly in the PARENT
  const { token } = useContext(AuthenticationContext)
  const { addToCart, cartLoading } = useContext(CartContext)

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: getFeaturedProducts,
    staleTime: 5 * 60 * 1000,
  })

  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['homeCategories'],
    queryFn: getCategories,
    staleTime: 10 * 60 * 1000,
  })

  const products = productsData?.data?.data ?? []
  const categories = categoriesData?.data?.data ?? []

  return (
    <main className={styles.main}>

      {/* ══════════════════════════════
          Hero Carousel
      ══════════════════════════════ */}
      <section className={styles.heroSection}>
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={0}
          slidesPerView={1}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation
          loop
          className={styles.heroSwiper}
        >
          {[
            { img: slide1, badge: 'New Arrivals', title: 'Fresh Groceries Delivered Fast', text: 'From farm to your door in under 2 hours' },
            { img: slide2, badge: 'Best Deals', title: 'Fresh Produce Every Day', text: 'Handpicked fruits and vegetables daily' },
            { img: slide3, badge: 'Free Delivery', title: 'Special Offers This Week', text: 'Free delivery on orders over 200 EGP' },
          ].map((slide, i) => (
            <SwiperSlide key={`slide-${i}`}>
              <div className={styles.slide}>
                <img src={slide.img} alt={slide.title} />
                <div className={styles.slideOverlay}>
                  <div className={styles.slideContent}>
                    <span className={styles.slideBadge}>{slide.badge}</span>
                    <h1 className={styles.slideTitle}>{slide.title}</h1>
                    <p className={styles.slideText}>{slide.text}</p>
                    <Link to="/products" className={styles.slideBtn}>
                      Shop Now <i className="fa-solid fa-arrow-right" />
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* ══════════════════════════════
          Features Strip
      ══════════════════════════════ */}
      <section className={styles.featuresStrip}>
        <div className={styles.featuresGrid}>
          {[
            { icon: 'fa-truck-fast', title: 'Free Delivery', text: 'On orders over 200 EGP' },
            { icon: 'fa-leaf', title: '100% Fresh', text: 'Farm to door guarantee' },
            { icon: 'fa-rotate-left', title: 'Easy Returns', text: 'Hassle-free returns' },
            { icon: 'fa-headset', title: '24/7 Support', text: "We're always here" },
          ].map((f) => (
            <div key={f.title} className={styles.featureItem}>
              <i className={`fa-solid ${f.icon}`} />
              <div>
                <h4>{f.title}</h4>
                <p>{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════
          Categories Carousel
      ══════════════════════════════ */}
      <section className={styles.innerSection}>
        <SectionHeader
          title="Shop by Category"
          subtitle="Find exactly what you're looking for"
          linkTo="/categories"
          linkLabel="All Categories"
        />

        {categoriesLoading ? (
          <div className={styles.categorySkeletonRow}>
            {Array.from({ length: 6 }, (_, i) => <CategorySkeleton key={`cat-sk-${i}`} />)}
          </div>
        ) : (
          <Swiper
            modules={[Autoplay, Navigation]}
            spaceBetween={16}
            slidesPerView={2}
            breakpoints={{
              480: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
              1024: { slidesPerView: 6 },
            }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            navigation
            loop
            className={styles.categorySwiper}
          >
            {categories.map(cat => (
              <SwiperSlide key={cat._id}>
                <Link to="/categories" className={styles.categoryCard}>
                  <div className={styles.categoryImageWrapper}>
                    <img src={cat.image} alt={cat.name} className={styles.categoryImage} loading="lazy" />
                  </div>
                  <span className={styles.categoryName}>{cat.name}</span>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </section>

      {/* ══════════════════════════════
          Banners
      ══════════════════════════════ */}
      <section className={styles.innerSection}>
        <div className={styles.bannersGrid}>
          <div className={styles.bannerCard}>
            <img src={groceryBanner} alt="Fresh vegetables" className={styles.bannerImage} />
            <div className={styles.bannerContent}>
              <span className={styles.bannerBadge}>Up to 30% off</span>
              <h3>Fresh Vegetables</h3>
              <Link to="/products" className={styles.bannerBtn}>Shop Now</Link>
            </div>
          </div>
          <div className={styles.bannerCard}>
            <img src={groceryBanner2} alt="Weekly specials" className={styles.bannerImage} />
            <div className={styles.bannerContent}>
              <span className={styles.bannerBadge}>Limited time</span>
              <h3>Weekly Specials</h3>
              <Link to="/products" className={styles.bannerBtn}>Shop Now</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          Featured Products
      ══════════════════════════════ */}
      <section className={styles.innerSection}>
        <SectionHeader
          title="Featured Products"
          subtitle="Handpicked just for you"
          linkTo="/products"
          linkLabel="View All"
        />
        <div className={styles.productsGrid}>
          {productsLoading
            ? Array.from({ length: 8 }, (_, i) => <ProductSkeleton key={`prod-sk-${i}`} />)
            // ✅ Pass addToCart and cartLoading as props
            : products.map(product => (
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

      {/* ══════════════════════════════
          CTA Banner
      ══════════════════════════════ */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Get Fresh Groceries Delivered Today</h2>
          <p className={styles.ctaText}>Join thousands of happy customers. Free delivery on your first order!</p>
          <div className={styles.ctaButtons}>
            <Link to={token ? '/' : '/register'} className={styles.ctaPrimary}>
              {token ? 'Back to Home' : 'Get Started Free'}
            </Link>
            <Link to="/products" className={styles.ctaSecondary}>Browse Products</Link>
          </div>
        </div>
      </section>

    </main>
  )
}