import { useState, useEffect } from 'react'

const Navbar = ({ toggleSidebar }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <header
      className="navbar navbar-expand-lg sticky-top bg-white border-bottom px-4"
      style={{ height: '64px', zIndex: 1020 }}
    >
      <div className="d-flex align-items-center justify-content-between w-100">
        <button
          className="btn btn-light border-0 me-3 d-lg-none"
          onClick={toggleSidebar}
          aria-label="Toggle menu"
          type="button"
        >
          <i className="bi bi-list fs-4"></i>
        </button>
        <div className="navbar-brand mb-0 fs-6 text-secondary fw-medium">
          {/* Dynamic Breadcrumbs could go here */}
          Dashboard
        </div>
        <div className="d-flex align-items-center gap-2">
          <button
            className="btn btn-link position-relative p-2"
            title="Notifications"
            type="button"
          >
            <i className="bi bi-bell fs-5"></i>
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
              3
            </span>
          </button>
          <button
            className="btn btn-link p-2"
            title="Profile"
            type="button"
          >
            <i className="bi bi-person-circle fs-4"></i>
          </button>
        </div>
      </div>
    </header >
  )
}

export default Navbar
