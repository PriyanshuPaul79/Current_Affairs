import { useAppContext, PROVIDERS } from '../context/AppContext'

export default function Topbar({ onFetch, loading }) {
  const { currentCategory, currentProvider, setCurrentProvider, toggleSidebar } = useAppContext()

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="menu-toggle" onClick={toggleSidebar} aria-label="Toggle sidebar">
          ☰
        </button>
        <h2 className="topbar-title">
          <span>{currentCategory}</span>
        </h2>
      </div>

      <div className="topbar-right">
        <span className="date-chip">📅 {today}</span>

        <select
          className="api-selector"
          value={currentProvider}
          onChange={(e) => setCurrentProvider(e.target.value)}
        >
          {PROVIDERS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        <button className="fetch-btn" onClick={onFetch} disabled={loading}>
          {loading
            ? <span className="spin">⟳</span>
            : '⬇'
          }
          <span>{loading ? 'Fetching…' : 'Fetch News'}</span>
        </button>
      </div>
    </header>
  )
}
