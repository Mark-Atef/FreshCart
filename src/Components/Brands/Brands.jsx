/** biome-ignore-all assist/source/organizeImports: intentional order */
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import styles from './Brands.module.css'

// ── Fetch function — OUTSIDE component ──
function getAllBrands() {
  return axios.get('https://ecommerce.routemisr.com/api/v1/brands')
}

// ── Skeleton Card ──
function SkeletonCard() {
  return (
    <div className={styles.skeletonCard}>
      <div className={styles.skeletonImg} />
      <div className={styles.skeletonBody}>
        <div className={styles.skeletonLine} style={{ width: '55%', height: '13px', margin: '0 auto' }} />
      </div>
    </div>
  )
}

// ── Brand Card ──
function BrandCard({ brand, onClick }) {
  return (
    <button
      type="button"
      className={styles.card}
      onClick={onClick}
      aria-label={`Browse ${brand.name} products`}
    >
      <div className={styles.imageWrapper}>
        <img
          src={brand.image}
          alt={brand.name}
          className={styles.image}
          loading="lazy"
        />
      </div>
      <div className={styles.body}>
        <h3 className={styles.name}>{brand.name}</h3>
        <span className={styles.browseLabel}>
          Browse <i className="fa-solid fa-arrow-right" />
        </span>
      </div>
    </button>
  )
}

// ── Main Brands Page ──
export default function Brands() {

  const navigate = useNavigate()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['allBrands'],
    queryFn: getAllBrands,
    staleTime: 15 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  })

  const brands = data?.data?.data ?? []

  return (
    <section className={styles.section}>

      {/* ── Page Header ── */}
      <div className={styles.pageHeader}>
        <span className={styles.headerBadge}>
          <i className="fa-solid fa-tag" /> Official Brands
        </span>
        <h1 className={styles.pageTitle}>All Brands</h1>
        <p className={styles.pageSubtitle}>
          {isLoading
            ? 'Loading brands...'
            : `${brands.length} brands available`}
        </p>
      </div>

      {/* ── Error ── */}
      {isError && (
        <div className={styles.errorBox}>
          <i className="fa-solid fa-circle-exclamation" />
          Failed to load brands. Please try again.
        </div>
      )}

      {/* ── Grid ── */}
      <div className={styles.grid}>
        {isLoading
          ? Array.from({ length: 12 }, (_, i) => <SkeletonCard key={`sk-${i}`} />)
          : brands.map(brand => (
              <BrandCard
                key={brand._id}
                brand={brand}
                onClick={() => navigate(`/products?brand=${brand._id}`)}
              />
            ))
        }
      </div>

    </section>
  )
}