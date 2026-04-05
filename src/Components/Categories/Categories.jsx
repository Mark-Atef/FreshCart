/** biome-ignore-all assist/source/organizeImports: intentional order */
/** biome-ignore-all lint/suspicious/noArrayIndexKey: <> */
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import styles from './Categories.module.css'

function getAllCategories() {
  return axios.get('https://ecommerce.routemisr.com/api/v1/categories')
}

function SkeletonCard() {
  return (
    <div className={styles.skeletonCard}>
      <div className={styles.skeletonImg} />
      <div className={styles.skeletonBody}>
        <div className={styles.skeletonLine} style={{ width: '65%', height: '14px' }} />
        <div className={styles.skeletonLine} style={{ width: '40%', height: '11px' }} />
      </div>
    </div>
  )
}

// ✅ Changed from div to button — fixes Biome noStaticElementInteractions
function CategoryCard({ category, onClick }) {
  return (
    <button
      type="button"
      className={styles.card}
      onClick={onClick}
      aria-label={`Browse ${category.name} products`}
    >
      <div className={styles.imageWrapper}>
        <img
          src={category.image}
          alt={category.name}
          className={styles.image}
          loading="lazy"
        />
        <div className={styles.overlay}>
          <span className={styles.exploreBtn}>
            <i className="fa-solid fa-arrow-right" /> Explore
          </span>
        </div>
      </div>
      <div className={styles.body}>
        <h3 className={styles.name}>{category.name}</h3>
        <span className={styles.meta}>Browse products</span>
      </div>
    </button>
  )
}

export default function Categories() {

  const navigate = useNavigate()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['allCategories'],
    queryFn: getAllCategories,
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnMount: false,
  })

  const categories = data?.data?.data ?? []

  return (
    <section className={styles.section}>

      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <span className={styles.headerBadge}>
            <i className="fa-solid fa-layer-group" /> Browse
          </span>
          <h1 className={styles.pageTitle}>All Categories</h1>
          <p className={styles.pageSubtitle}>
            {isLoading
              ? 'Loading categories...'
              : `${categories.length} categories available`}
          </p>
        </div>
      </div>

      {isError && (
        <div className={styles.errorBox}>
          <i className="fa-solid fa-circle-exclamation" />
          Failed to load categories. Please try again.
        </div>
      )}

      <div className={styles.grid}>
        {isLoading
          ? Array.from({ length: 12 }, (_, i) => <SkeletonCard key={`sk-${i}`} />)
          : categories.map(category => (
              <CategoryCard
                key={category._id}
                category={category}
                onClick={() => navigate(`/products?category=${category._id}`)}
              />
            ))
        }
      </div>

    </section>
  )
}