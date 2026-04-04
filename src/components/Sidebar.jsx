import { useState, useEffect, useRef } from 'react'
import { useAppContext, CATEGORIES, PROVIDERS } from '../context/AppContext'

const CATEGORY_ICONS = {
  'Banking Awareness': '🏦',
  'Appointments': '👤',
  'Govt Schemes': '🏛️',
  'Budget & Numbers': '📊',
  'Reports & Indexes': '📈',
}

const VIEW_ICONS = {
  news: '📰',
  quiz: '🧠',
  bookmarks: '🔖',
  history: '🕐',
}

export default function Sidebar() {
  const {
    currentView, setCurrentView,
    currentCategory, setCurrentCategory,
    sidebarOpen, closeSidebar,
    apiKeys, saveApiKeys,
  } = useAppContext()

  const [apiPanelOpen, setApiPanelOpen] = useState(false)
  const [localKeys, setLocalKeys] = useState({ ...apiKeys })
  const [saveMsg, setSaveMsg] = useState('')
  const saveMsgTimerRef = useRef(null)

  const handleCategoryClick = (cat) => {
    setCurrentCategory(cat)
    setCurrentView('news')
    closeSidebar()
  }

  const handleViewClick = (view) => {
    setCurrentView(view)
    closeSidebar()
  }

  const handleSaveKeys = () => {
    saveApiKeys(localKeys)
    setSaveMsg('✅ Keys saved!')
    clearTimeout(saveMsgTimerRef.current)
    saveMsgTimerRef.current = setTimeout(() => setSaveMsg(''), 3000)
  }

  useEffect(() => () => clearTimeout(saveMsgTimerRef.current), [])

  return (
    <aside className={`sidebar${sidebarOpen ? ' open' : ''}`}>
      <div className="sidebar-brand">
        <h1>🏦 Banking PO</h1>
        <p>Current Affairs Dashboard</p>
      </div>

      {/* Categories */}
      <div className="sidebar-section">
        <p className="sidebar-section-label">Categories</p>
        <nav className="sidebar-nav">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`nav-btn${currentCategory === cat && currentView === 'news' ? ' active' : ''}`}
              onClick={() => handleCategoryClick(cat)}
            >
              <span className="icon">{CATEGORY_ICONS[cat] || '📁'}</span>
              {cat}
            </button>
          ))}
        </nav>
      </div>

      <div className="sidebar-divider" />

      {/* Tools */}
      <div className="sidebar-section">
        <p className="sidebar-section-label">Tools</p>
        <nav className="sidebar-nav">
          {[
            { view: 'quiz', label: 'Quiz Mode' },
            { view: 'bookmarks', label: 'Bookmarks' },
            { view: 'history', label: 'History' },
          ].map(({ view, label }) => (
            <button
              key={view}
              className={`nav-btn${currentView === view ? ' active' : ''}`}
              onClick={() => handleViewClick(view)}
            >
              <span className="icon">{VIEW_ICONS[view]}</span>
              {label}
            </button>
          ))}
        </nav>
      </div>

      <div className="sidebar-divider" />

      {/* API Keys */}
      <div className="sidebar-section">
        <button
          className="api-keys-toggle"
          onClick={() => setApiPanelOpen((v) => !v)}
        >
          <span>🔑 API Keys</span>
          <span>{apiPanelOpen ? '▲' : '▼'}</span>
        </button>

        {apiPanelOpen && (
          <div className="api-keys-panel">
            {PROVIDERS.filter((p) => p !== 'Google News RSS').map((provider) => (
              <div key={provider} className="api-key-input-group">
                <label className="api-key-label">{provider}</label>
                <input
                  type="password"
                  className="api-key-input"
                  placeholder={`Enter ${provider} key…`}
                  value={localKeys[provider] || ''}
                  onChange={(e) =>
                    setLocalKeys((prev) => ({ ...prev, [provider]: e.target.value }))
                  }
                />
              </div>
            ))}
            <button className="api-save-btn" onClick={handleSaveKeys}>
              Save Keys
            </button>
            {saveMsg && <p className="api-save-msg">{saveMsg}</p>}
          </div>
        )}
      </div>
    </aside>
  )
}
