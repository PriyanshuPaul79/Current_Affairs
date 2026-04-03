import { useState } from 'react'
import { AppProvider, useAppContext } from './context/AppContext'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import NewsView from './components/NewsView'
import ArticleModal from './components/ArticleModal'
import QuizMode from './components/QuizMode'
import BookmarksView from './components/BookmarksView'
import HistoryView from './components/HistoryView'
import { useNews } from './hooks/useNews'
import { useBookmarks } from './hooks/useBookmarks'
import { useHistory } from './hooks/useHistory'

function Dashboard() {
  const {
    currentView, setCurrentView,
    currentCategory, setCurrentCategory,
    currentProvider,
    sidebarOpen, closeSidebar,
    apiKeys,
  } = useAppContext()

  const { articles, loading, error, fetchNews, restoreArticles } = useNews()
  const { bookmarks, toggleBookmark, isBookmarked, clearBookmarks } = useBookmarks()
  const { groupedHistory, addToHistory, clearHistory } = useHistory()

  const [modalArticle, setModalArticle] = useState(null)
  const [modalArticles, setModalArticles] = useState([])

  const handleFetch = async () => {
    const results = await fetchNews(currentCategory, currentProvider, apiKeys)
    if (results.length > 0) {
      addToHistory(currentCategory, currentProvider, results)
    }
  }

  const openArticle = (article, articleList) => {
    setModalArticle(article)
    setModalArticles(articleList || articles)
  }

  const closeModal = (nextArticle) => {
    if (nextArticle) {
      setModalArticle(nextArticle)
    } else {
      setModalArticle(null)
      setModalArticles([])
    }
  }

  const handleRestoreHistory = (entry) => {
    setCurrentCategory(entry.category)
    restoreArticles(entry.articles)
    setCurrentView('news')
  }

  const handleOpenBookmarkArticle = (article) => {
    openArticle(article, bookmarks)
  }

  return (
    <div className="app-layout">
      <Sidebar />

      {sidebarOpen && (
        <div className="sidebar-overlay show" onClick={closeSidebar} />
      )}

      <div className="main-content">
        <Topbar onFetch={handleFetch} loading={loading} />

        <main className="content-area">
          {currentView === 'news' && (
            <NewsView
              articles={articles}
              loading={loading}
              error={error}
              onOpenArticle={(article) => openArticle(article, articles)}
              onBookmark={toggleBookmark}
              isBookmarked={isBookmarked}
              category={currentCategory}
            />
          )}

          {currentView === 'quiz' && (
            <QuizMode articles={articles} />
          )}

          {currentView === 'bookmarks' && (
            <BookmarksView
              bookmarks={bookmarks}
              onOpenArticle={handleOpenBookmarkArticle}
              onBookmark={toggleBookmark}
              isBookmarked={isBookmarked}
              onClear={clearBookmarks}
            />
          )}

          {currentView === 'history' && (
            <HistoryView
              groupedHistory={groupedHistory}
              onClear={clearHistory}
              onRestore={handleRestoreHistory}
            />
          )}
        </main>
      </div>

      {modalArticle && (
        <ArticleModal
          article={modalArticle}
          articles={modalArticles}
          onClose={closeModal}
          onBookmark={toggleBookmark}
          isBookmarked={isBookmarked}
        />
      )}
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Dashboard />
    </AppProvider>
  )
}
