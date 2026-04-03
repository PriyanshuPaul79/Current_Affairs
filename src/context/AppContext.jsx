import { createContext, useContext, useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { CATEGORIES, PROVIDERS } from '../hooks/useNews'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [currentView, setCurrentView] = useState('news') // news | quiz | bookmarks | history
  const [currentCategory, setCurrentCategory] = useState(CATEGORIES[0])
  const [currentProvider, setCurrentProvider] = useState(PROVIDERS[0])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [apiKeys, setApiKeys] = useLocalStorage('banking_api_keys', {})

  const saveApiKeys = (keys) => {
    setApiKeys(keys)
  }

  const toggleSidebar = () => setSidebarOpen((v) => !v)
  const closeSidebar = () => setSidebarOpen(false)

  return (
    <AppContext.Provider value={{
      currentView, setCurrentView,
      currentCategory, setCurrentCategory,
      currentProvider, setCurrentProvider,
      sidebarOpen, toggleSidebar, closeSidebar,
      selectedArticle, setSelectedArticle,
      apiKeys, saveApiKeys,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used within AppProvider')
  return ctx
}

export { CATEGORIES, PROVIDERS }
