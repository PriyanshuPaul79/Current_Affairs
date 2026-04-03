import ArticleCard from './ArticleCard'

function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-line short" />
      <div className="skeleton-line tall" />
      <div className="skeleton-line medium" />
    </div>
  )
}

export default function NewsView({ articles, loading, error, onOpenArticle, onBookmark, isBookmarked, category }) {
  if (loading) {
    return (
      <div className="skeleton-grid">
        {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-banner">
        <span className="error-banner-icon">⚠️</span>
        <span>{error}</span>
      </div>
    )
  }

  if (articles.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon">📰</span>
        <p className="empty-title">No articles yet</p>
        <p className="empty-desc">
          Click <strong>Fetch News</strong> to load the latest {category} news from your selected source.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="news-header">
        <h2>{category}</h2>
        <span className="news-count">{articles.length} articles</span>
      </div>
      <div className="news-grid">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            onOpen={onOpenArticle}
            onBookmark={onBookmark}
            isBookmarked={isBookmarked(article.id)}
          />
        ))}
      </div>
    </>
  )
}
