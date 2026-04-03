function formatDate(dateStr) {
  if (!dateStr) return ''
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      month: 'short', day: 'numeric', year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

export default function ArticleCard({ article, onOpen, onBookmark, isBookmarked }) {
  return (
    <div className="article-card" onClick={() => onOpen(article)}>
      <div className="card-source">
        <span className="source-badge">{article.source || article.provider}</span>
        <span className="card-date">{formatDate(article.publishedAt)}</span>
      </div>

      <h3 className="card-title">{article.title}</h3>

      {article.description && (
        <p className="card-description">{article.description}</p>
      )}

      <div className="card-actions">
        <span className="card-read-more">Read more →</span>
        <button
          className={`bookmark-btn${isBookmarked ? ' bookmarked' : ''}`}
          onClick={(e) => {
            e.stopPropagation()
            onBookmark(article)
          }}
          title={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
        >
          {isBookmarked ? '🔖' : '🔖'}
        </button>
      </div>
    </div>
  )
}
