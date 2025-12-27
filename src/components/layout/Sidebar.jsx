import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  const [isopen, setIsOpen] = useState(window.innerWidth > 768)
  const [theme, setTheme] = useState(
    localStorage.getItem('theme') || 'dark'
  )

  useEffect(() => {
    const handleResize = () => {
      const shouldBeOpen = window.innerWidth > 768
      setIsOpen(shouldBeOpen)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleToggleSidebar = () => {
    setIsOpen(prev => !prev)
  }

  useEffect(() => {
    if (window.innerWidth <= 768 && isopen) {
      const handleClickOutside = (e) => {
        if (!e.target.closest('.sidebar') && !e.target.closest('.sidebar-toggle-btn')) {
          setIsOpen(false)
        }
      }
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [isopen])

  useEffect(() => {
    document.body.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <>
      {/* Mobile Overlay using Bootstrap backdrop */}
      {isopen && window.innerWidth <= 768 && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
          style={{ zIndex: 1040 }}
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <aside
        className={`sidebar position-fixed top-0 start-0 h-100 d-flex flex-column ${isopen ? 'sidebar-open' : 'sidebar-closed'}`}
        data-sidebar-state={isopen ? 'open' : 'closed'}
        style={{ 
          width: isopen ? '220px' : '70px', 
          zIndex: 1050,
          backgroundColor: 'var(--sidebar-bg)',
          color: theme === 'dark' ? '#ffffff' : 'var(--text-color)',
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden',
          boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* HEADER */}
        <div className="d-flex align-items-center justify-content-between px-3 py-3 border-bottom">
          {isopen && <h6 className="m-0 fw-bold text-nowrap">Dashboard</h6>}
          <button
            className="sidebar-toggle-btn btn btn-link p-2"
            onClick={handleToggleSidebar}
            aria-label="Toggle sidebar"
            type="button"
            style={{
              background: 'transparent',
              border: 'none',
              borderRadius: '6px',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
              color: theme === 'dark' ? '#ffffff' : 'var(--text-color)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--hover-bg)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            <i className={`bi ${isopen ? 'bi-chevron-left' : 'bi-chevron-right'}`} />
          </button>
        </div>

        {/* MENU */}
        <nav className="flex-grow-1 overflow-auto">
          <ul className="nav nav-pills flex-column gap-1 px-2 py-3">
            <SidebarItem to="/" icon="house-door" label="Home" isopen={isopen} />
            <SidebarItem to="/courses" icon="journal-bookmark" label="Courses" isopen={isopen} />
            <SidebarItem to="/users" icon="people" label="Users" isopen={isopen} />
            <SidebarItem to="/exams" icon="pencil-square" label="Exams" isopen={isopen} />
            <SidebarItem to="/webinar" icon="camera-video" label="Webinar" isopen={isopen} />
            <SidebarItem to="/certificates" icon="patch-check" label="Certificates" isopen={isopen} />
            <SidebarItem to="/marketing" icon="bar-chart-line" label="Marketing" isopen={isopen} />
            <SidebarItem to="/affiliatemarketing" icon="link-45deg" label="Affiliate" isopen={isopen} />
            <SidebarItem to="/myapp" icon="phone" label="My App" isopen={isopen} />
            <SidebarItem to="/websites" icon="globe" label="Websites" isopen={isopen} />
            <SidebarItem to="/settings" icon="gear" label="Settings" isopen={isopen} />
          </ul>
        </nav>

        {/* THEME TOGGLE */}
        <div className="px-3 py-3 border-top">
          <button
            className={`btn w-100 d-flex align-items-center justify-content-start gap-2 ${
              theme === 'dark' ? 'text-white' : 'text-dark'
            }`}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            type="button"
          >
            <i className={`bi ${theme === 'dark' ? 'bi-sun' : 'bi-moon'}`} />
            {isopen && (
              <span className="text-nowrap">
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </span>
            )}
          </button>
        </div>
      </aside>
    </>
  )
}

const SidebarItem = ({ to, icon, label, isopen }) => (
  <li className="nav-item">
    <NavLink
      to={to}
      title={!isopen ? label : ''}
      className={({ isActive }) =>
        `nav-link d-flex align-items-center gap-2 ${isActive ? 'active' : ''}`
      }
      style={{
        height: '44px',
        padding: '0 12px',
        borderRadius: '8px',
        textDecoration: 'none',
        position: 'relative',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
      onMouseEnter={(e) => {
        if (!e.currentTarget.classList.contains('active')) {
          e.currentTarget.style.backgroundColor = 'var(--hover-bg)'
        }
        e.currentTarget.style.paddingLeft = '18px'
        e.currentTarget.style.transform = 'translateX(4px)'
      }}
      onMouseLeave={(e) => {
        if (!e.currentTarget.classList.contains('active')) {
          e.currentTarget.style.backgroundColor = 'transparent'
        }
        e.currentTarget.style.paddingLeft = '12px'
        e.currentTarget.style.transform = 'translateX(0)'
      }}
    >
      <i className={`bi bi-${icon}`} style={{ minWidth: '24px', textAlign: 'center', fontSize: '18px' }} />
      {isopen && <span className="text-nowrap">{label}</span>}
    </NavLink>
  </li>
)

export default Sidebar
