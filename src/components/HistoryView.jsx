export default function HistoryView({ groupedHistory, onClear, onRestore }) {
  const dates = Object.keys(groupedHistory)

  return (
    <>
      <div className="history-header">
        <h2>🕐 Fetch History</h2>
        {dates.length > 0 && (
          <button className="clear-history-btn" onClick={onClear}>
            🗑 Clear History
          </button>
        )}
      </div>

      {dates.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🕐</span>
          <p className="empty-title">No history yet</p>
          <p className="empty-desc">Every time you fetch news, it will be recorded here for later reference.</p>
        </div>
      ) : (
        dates.map((date) => (
          <div key={date} className="history-day">
            <div className="history-day-header">
              <span className="history-day-label">{date}</span>
              <div className="history-day-line" />
              <span className="history-day-count">{groupedHistory[date].length} fetches</span>
            </div>

            {groupedHistory[date].map((entry) => (
              <HistoryEntry key={entry.id} entry={entry} onRestore={onRestore} />
            ))}
          </div>
        ))
      )}
    </>
  )
}

function HistoryEntry({ entry, onRestore }) {
  const time = new Date(entry.fetchedAt).toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit',
  })

  return (
    <div className="article-card" style={{ marginBottom: '10px' }}>
      <div className="card-source">
        <span className="source-badge">{entry.provider}</span>
        <span className="card-date">{time}</span>
      </div>
      <h3 className="card-title" style={{ fontSize: '0.88rem' }}>
        {entry.category} — {entry.count} articles fetched
      </h3>
      <div className="card-actions">
        <span className="card-date">Fetched at {time}</span>
        <button
          className="bookmark-btn"
          style={{ fontSize: '0.78rem', color: 'var(--accent)' }}
          onClick={() => onRestore(entry)}
          title="Restore these articles"
        >
          ↩ Restore
        </button>
      </div>
    </div>
  )
}
