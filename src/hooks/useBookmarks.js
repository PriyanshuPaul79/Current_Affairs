import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useLocalStorage('banking_bookmarks', [])

  const addBookmark = useCallback((article) => {
    setBookmarks((prev) => {
      if (prev.find((b) => b.id === article.id)) return prev
      return [{ ...article, bookmarkedAt: new Date().toISOString() }, ...prev]
    })
  }, [setBookmarks])

  const removeBookmark = useCallback((articleId) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== articleId))
  }, [setBookmarks])

  const toggleBookmark = useCallback((article) => {
    const isBookmarked = bookmarks.some((b) => b.id === article.id)
    if (isBookmarked) {
      removeBookmark(article.id)
    } else {
      addBookmark(article)
    }
  }, [bookmarks, addBookmark, removeBookmark])

  const isBookmarked = useCallback((articleId) => {
    return bookmarks.some((b) => b.id === articleId)
  }, [bookmarks])

  const clearBookmarks = useCallback(() => {
    setBookmarks([])
  }, [setBookmarks])

  return { bookmarks, addBookmark, removeBookmark, toggleBookmark, isBookmarked, clearBookmarks }
}
