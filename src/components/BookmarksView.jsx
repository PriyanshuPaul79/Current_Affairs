import ArticleCard from './ArticleCard'

export default function BookmarksView({ bookmarks, onOpenArticle, onBookmark, isBookmarked, onClear }) {
  return (
    <>
      <div className="bookmarks-header">
        <h2>🔖 Bookmarks</h2>
        {bookmarks.length > 0 && (
          <button className="clear-bookmarks-btn" onClick={onClear}>
            🗑 Clear All
          </button>
        )}
      </div>

      {bookmarks.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🔖</span>
          <p className="empty-title">No bookmarks yet</p>
          <p className="empty-desc">Bookmark articles from the news view to save them here for later reading.</p>
        </div>
      ) : (
        <div className="news-grid">
          {bookmarks.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              onOpen={onOpenArticle}
              onBookmark={onBookmark}
              isBookmarked={isBookmarked(article.id)}
            />
          ))}
        </div>
      )}
    </>
  )
}
