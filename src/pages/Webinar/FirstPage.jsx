import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import LiveCard from './LiveCard'
import UpcomingCard from './UpcomingCard'
import RecordedCard from './RecordedCard'
import { FiSearch, FiPlus } from 'react-icons/fi'

const FirstPage = () => {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const location = useLocation()

  // Initialize filter from URL if present, else default to 'all'
  const getInitialFilter = () => {
    const params = new URLSearchParams(location.search)
    const f = params.get('filter')
    if (f && ['live', 'upcoming', 'recorded'].includes(f)) return f
    return 'all'
  }

  const [activeFilter, setActiveFilter] = useState(getInitialFilter())
  const [searchTerm, setSearchTerm] = useState('')
  const [counts, setCounts] = useState({ live: 0, upcoming: 0, recorded: 0 })
  const [loadError, setLoadError] = useState(null)

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const f = params.get('filter')
    if (f && ['live', 'upcoming', 'recorded'].includes(f)) {
      setActiveFilter(f)
    }
  }, [location.search])

  const loadData = () => {
    try {
      setLoadError(null)
      const keys = Object.keys(sessionStorage).filter(k => k.startsWith('webinar-'))
      const loadedItems = []
      const now = new Date()

      keys.forEach(k => {
        try {
          const raw = sessionStorage.getItem(k)
          if (!raw) return
          let parsed = JSON.parse(raw)
          if (parsed) {
            // Re-eval status
            if (parsed.dateTime && parsed.duration) {
              const start = new Date(parsed.dateTime)
              const durationMs = (parseInt(parsed.duration, 10) || 30) * 60 * 1000
              const end = new Date(start.getTime() + durationMs)
              let newType = 'upcoming'
              if (now >= start && now <= end) newType = 'live'
              else if (now > end) newType = 'recorded'

              if (parsed.type !== newType) {
                parsed.type = newType
                sessionStorage.setItem(k, JSON.stringify(parsed))
              }
            }
            loadedItems.push(parsed)
          }
        } catch (e) {
          console.warn('FirstPage: skipping invalid webinar key', k, e)
        }
      })

      // Sort by date/time
      loadedItems.sort((a, b) => (a.dateTime || '') > (b.dateTime || '') ? 1 : -1)
      setItems(loadedItems)

      const grouped = { live: 0, upcoming: 0, recorded: 0 }
      loadedItems.forEach(d => {
        const t = d.type || 'upcoming'
        if (grouped[t] !== undefined) grouped[t]++
      })

      setCounts(grouped)

    } catch (err) {
      setLoadError(err.message || String(err))
    }
  }

  useEffect(() => {
    loadData()
    const handler = () => loadData()
    window.addEventListener('webinar-added', handler)
    return () => window.removeEventListener('webinar-added', handler)
  }, [location.pathname])

  const hasAny = items.length > 0;

  const filteredItems = items.filter(item => {
    const matchesSearch = (item.title || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'all' || item.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="container-fluid py-4">

      {/* Empty State */}
      {!hasAny && (
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="card shadow-sm border-0 text-center">
              <div className="card-body p-5">
                <h2 className="text-primary fw-bold mb-3">Webinar Management </h2>
                <div className="text-muted mb-4">
                  <p className="mb-2">
                    🚀 Host free webinars to expand your lead pool or find your best leads with paid webinars.
                  </p>
                  <p className="mb-2">
                    ✨ Create and publish new webinars to get started.
                  </p>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate('/webinar/webinars?create=1')}
                >
                  <FiPlus className="me-2" /> Schedule a Webinar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header & Dashboard */}
      {hasAny && (
        <>
          <div className="row g-3 mb-4">
            <div className="col-12 col-md-5">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search webinars..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
                <span className="input-group-text">
                  <FiSearch />
                </span>
              </div>
            </div>
            <div className="col-12 col-md-3">
              <select
                className="form-select"
                value={activeFilter}
                onChange={e => setActiveFilter(e.target.value)}
              >
                <option value="all">All Webinars</option>
                <option value="live">Live ({counts.live})</option>
                <option value="upcoming">Upcoming ({counts.upcoming})</option>
                <option value="recorded">Recorded ({counts.recorded})</option>
              </select>
            </div>
            <div className="col-12 col-md-4 text-md-end">
              <button
                className="btn btn-success w-100 w-md-auto"
                onClick={() => navigate('/webinar/webinars?create=1')}
              >
                <FiPlus className="me-2" /> Schedule Webinar
              </button>
            </div>
          </div>

          {loadError && (
            <div className="alert alert-danger">{loadError}</div>
          )}

          <div className="row g-4">
            {filteredItems.length === 0 ? (
              <div className="col-12 text-center py-5">
                <div className="text-muted">🔍 No webinars found matching your criteria.</div>
              </div>
            ) : (
              filteredItems.map(item => (
                <div key={item.id} className="col-12 col-sm-6 col-lg-4">
                  <div className="h-100">
                    {item.type === 'live' && <LiveCard item={item} />}
                    {item.type === 'upcoming' && <UpcomingCard item={item} />}
                    {item.type === 'recorded' && <RecordedCard item={item} />}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default FirstPage
