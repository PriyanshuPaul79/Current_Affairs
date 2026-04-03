import { useEffect, useCallback } from 'react'

function formatDate(dateStr) {
  if (!dateStr) return ''
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      month: 'long', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  } catch {
    return dateStr
  }
}

export default function ArticleModal({ article, articles, onClose, onBookmark, isBookmarked }) {
  const currentIndex = articles.findIndex((a) => a.id === article.id)
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex < articles.length - 1

  const onPrev = useCallback(() => {
    if (hasPrev) onClose(articles[currentIndex - 1])
  }, [hasPrev, onClose, articles, currentIndex])

  const onNext = useCallback(() => {
    if (hasNext) onClose(articles[currentIndex + 1])
  }, [hasNext, onClose, articles, currentIndex])

  // Close on Escape / Arrow keys
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose(null)
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose, onPrev, onNext])

  const bookmarked = isBookmarked(article.id)

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose(null)}>
      <div className="modal-container">
        <div className="modal-header">
          <div className="modal-nav">
            <button className="modal-nav-btn" onClick={onPrev} disabled={!hasPrev} title="Previous (←)">
              ← Prev
            </button>
            <span className="modal-counter">{currentIndex + 1} / {articles.length}</span>
            <button className="modal-nav-btn" onClick={onNext} disabled={!hasNext} title="Next (→)">
              Next →
            </button>
          </div>

          <div className="modal-actions">
            <button
              className={`modal-bookmark-btn${bookmarked ? ' bookmarked' : ''}`}
              onClick={() => onBookmark(article)}
              title={bookmarked ? 'Remove bookmark' : 'Bookmark'}
            >
              {bookmarked ? '🔖 Saved' : '🔖 Save'}
            </button>
            {article.url && (
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="modal-link-btn"
              >
                🔗
              </a>
            )}
            <button className="modal-close" onClick={() => onClose(null)} title="Close (Esc)">
              ✕
            </button>
          </div>
        </div>

        <div className="modal-body">
          <div className="modal-source-row">
            <span className="source-badge">{article.source || article.provider}</span>
            <span className="card-date">{formatDate(article.publishedAt)}</span>
            {article.category && (
              <span className="source-badge" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}>
                {article.category}
              </span>
            )}
          </div>

          <h2 className="modal-title">{article.title}</h2>

          {article.description && (
            <p className="modal-description">{article.description}</p>
          )}

          {article.content && (
            <div className="modal-content-text">{article.content}</div>
          )}
        </div>

        {article.url && (
          <div className="modal-footer">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="modal-open-link"
            >
              🔗 Read Full Article
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
