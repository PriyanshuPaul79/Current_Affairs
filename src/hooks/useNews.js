import { useState, useCallback } from 'react'

const CORS_PROXY = 'https://api.allorigins.win/raw?url='

const CATEGORY_QUERIES = {
  'Banking Awareness': 'RBI banking monetary policy India finance',
  'Appointments': 'appointment India government RBI SEBI chairman CEO',
  'Govt Schemes': 'government scheme India launch initiative ministry',
  'Budget & Numbers': 'India budget GDP economy finance numbers',
  'Reports & Indexes': 'India report index ranking world bank IMF',
}

function parseRSSFeed(xmlText, category) {
  const xmlParser = new DOMParser()
  const htmlParser = new DOMParser()
  const doc = xmlParser.parseFromString(xmlText, 'application/xml')
  const channelTitle = doc.querySelector('channel > title')?.textContent || 'Google News'
  const items = Array.from(doc.querySelectorAll('item'))
  return items.slice(0, 20).map((item, i) => {
    const rawTitle = item.querySelector('title')?.textContent || 'No Title'
    const rawDesc = item.querySelector('description')?.textContent || ''
    const link = item.querySelector('link')?.textContent || ''
    const pubDate = item.querySelector('pubDate')?.textContent || ''
    const source = item.querySelector('source')?.textContent || channelTitle

    // Use DOMParser to safely extract plain text from HTML content
    const titleDoc = htmlParser.parseFromString(rawTitle, 'text/html')
    const title = titleDoc.body.textContent || rawTitle

    const descDoc = htmlParser.parseFromString(rawDesc, 'text/html')
    const cleanDesc = descDoc.body.textContent || ''

    return {
      id: `rss-${Date.now()}-${i}`,
      title: title.trim(),
      description: cleanDesc.trim().slice(0, 300),
      url: link,
      source: source,
      publishedAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
      category,
      provider: 'Google News RSS',
    }
  })
}

async function fetchGoogleNewsRSS(category) {
  const query = CATEGORY_QUERIES[category] || category
  const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}+banking+india&hl=en-IN&gl=IN&ceid=IN:en`
  const url = `${CORS_PROXY}${encodeURIComponent(rssUrl)}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`RSS fetch failed (HTTP ${res.status})`)
  const text = await res.text()
  return parseRSSFeed(text, category)
}

async function fetchNewsDataIO(category, apiKey) {
  if (!apiKey) throw new Error('NewsData.io API key required')
  const query = CATEGORY_QUERIES[category] || category
  const apiUrl = `https://newsdata.io/api/1/news?apikey=${apiKey}&q=${encodeURIComponent(query)}&country=in&language=en`
  // Route through CORS proxy in case the browser blocks direct requests
  const url = `${CORS_PROXY}${encodeURIComponent(apiUrl)}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`NewsData.io fetch failed (HTTP ${res.status})`)
  const data = await res.json()
  if (data.status !== 'success') throw new Error(data.message || 'NewsData.io error')
  return (data.results || []).slice(0, 20).map((a, i) => ({
    id: `newsdata-${Date.now()}-${i}`,
    title: a.title || 'No Title',
    description: a.description || a.content || '',
    url: a.link || '',
    source: a.source_id || 'NewsData.io',
    publishedAt: a.pubDate ? new Date(a.pubDate).toISOString() : new Date().toISOString(),
    category,
    provider: 'NewsData.io',
  }))
}

async function fetchNewsAPI(category, apiKey) {
  if (!apiKey) throw new Error('NewsAPI key required')
  const query = CATEGORY_QUERIES[category] || category
  // newsapi.org blocks browser requests via CORS — route through proxy
  const apiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&language=en&apiKey=${apiKey}`
  const url = `${CORS_PROXY}${encodeURIComponent(apiUrl)}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`NewsAPI fetch failed (HTTP ${res.status})`)
  const data = await res.json()
  if (data.status !== 'ok') throw new Error(data.message || 'NewsAPI error')
  return (data.articles || []).slice(0, 20).map((a, i) => ({
    id: `newsapi-${Date.now()}-${i}`,
    title: a.title || 'No Title',
    description: a.description || '',
    url: a.url || '',
    source: a.source?.name || 'NewsAPI',
    publishedAt: a.publishedAt || new Date().toISOString(),
    category,
    provider: 'NewsAPI',
    content: a.content || '',
  }))
}

async function fetchWorldNewsAPI(category, apiKey) {
  if (!apiKey) throw new Error('World News API key required')
  const query = CATEGORY_QUERIES[category] || category
  // Route through CORS proxy to avoid browser cross-origin restrictions
  const apiUrl = `https://api.worldnewsapi.com/search-news?text=${encodeURIComponent(query)}&language=en&api-key=${apiKey}`
  const url = `${CORS_PROXY}${encodeURIComponent(apiUrl)}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`World News API fetch failed (HTTP ${res.status})`)
  const data = await res.json()
  return (data.news || []).slice(0, 20).map((a, i) => ({
    id: `worldnews-${Date.now()}-${i}`,
    title: a.title || 'No Title',
    description: a.text?.slice(0, 300) || '',
    url: a.url || '',
    source: a.source || 'World News',
    publishedAt: a.publish_date ? new Date(a.publish_date).toISOString() : new Date().toISOString(),
    category,
    provider: 'World News API',
  }))
}

async function fetchFinlight(category, apiKey) {
  if (!apiKey) throw new Error('Finlight API key required')
  const query = CATEGORY_QUERIES[category] || category
  // Route through CORS proxy to avoid browser cross-origin restrictions
  const apiUrl = `https://api.finlight.me/v1/articles?query=${encodeURIComponent(query)}&apiKey=${apiKey}`
  const url = `${CORS_PROXY}${encodeURIComponent(apiUrl)}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Finlight fetch failed (HTTP ${res.status})`)
  const data = await res.json()
  return (data.articles || []).slice(0, 20).map((a, i) => ({
    id: `finlight-${Date.now()}-${i}`,
    title: a.title || 'No Title',
    description: a.summary || a.description || '',
    url: a.url || '',
    source: a.source || 'Finlight',
    publishedAt: a.publishedAt || new Date().toISOString(),
    category,
    provider: 'Finlight',
  }))
}

const FETCHERS = {
  'Google News RSS': fetchGoogleNewsRSS,
  'NewsData.io': fetchNewsDataIO,
  'NewsAPI': fetchNewsAPI,
  'World News API': fetchWorldNewsAPI,
  'Finlight': fetchFinlight,
}

export function useNews() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchNews = useCallback(async (category, provider, apiKeys) => {
    setLoading(true)
    setError(null)

    const fetcher = FETCHERS[provider]
    if (!fetcher) {
      setError(`Unknown provider: ${provider}`)
      setLoading(false)
      return []
    }

    const apiKey = apiKeys?.[provider] || ''

    // Require API key for non-RSS providers
    if (provider !== 'Google News RSS' && !apiKey) {
      setError(
        `No API key saved for "${provider}". ` +
        `Open the 🔑 API Keys panel in the sidebar to add your key, ` +
        `or switch to "Google News RSS" (no key needed).`
      )
      setLoading(false)
      return []
    }

    try {
      const results = await fetcher(category, apiKey)
      setArticles(results)
      return results
    } catch (primaryErr) {
      const primaryMsg = primaryErr.message || 'Fetch failed'

      // Attempt fallback to Google News RSS when a paid provider fails
      if (provider !== 'Google News RSS') {
        try {
          const rssResults = await fetchGoogleNewsRSS(category)
          setArticles(rssResults)
          setError(`${provider} failed (${primaryMsg}). Showing Google News RSS results as fallback.`)
          return rssResults
        } catch {
          // RSS fallback also failed — fall through to report the original error below
        }
      }

      setError(primaryMsg)
      setArticles([])
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const restoreArticles = useCallback((savedArticles) => {
    setArticles(savedArticles || [])
    setError(null)
  }, [])

  return { articles, loading, error, fetchNews, restoreArticles }
}

export const PROVIDERS = Object.keys(FETCHERS)
export const CATEGORIES = Object.keys(CATEGORY_QUERIES)
