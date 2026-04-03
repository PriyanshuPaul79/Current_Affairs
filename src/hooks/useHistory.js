import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'

export function useHistory() {
  const [history, setHistory] = useLocalStorage('banking_history', [])

  const addToHistory = useCallback((category, provider, articles) => {
    const entry = {
      id: `hist-${Date.now()}`,
      category,
      provider,
      fetchedAt: new Date().toISOString(),
      count: articles.length,
      articles,
    }
    setHistory((prev) => [entry, ...prev].slice(0, 100))
  }, [setHistory])

  const clearHistory = useCallback(() => {
    setHistory([])
  }, [setHistory])

  // Group history by date
  const groupedHistory = history.reduce((groups, entry) => {
    const date = new Date(entry.fetchedAt).toLocaleDateString('en-IN', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    })
    if (!groups[date]) groups[date] = []
    groups[date].push(entry)
    return groups
  }, {})

  return { history, groupedHistory, addToHistory, clearHistory }
}
