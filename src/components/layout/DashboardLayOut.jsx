import { useEffect, useRef } from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'

const DashboardLayout = () => {
  const contentRef = useRef(null)
  const sidebarRef = useRef(null)
  const chatSupportRef = useRef(null)

  useEffect(() => {
    const updateMargin = () => {
      if (contentRef.current && sidebarRef.current) {
        const sidebar = sidebarRef.current.querySelector('.sidebar')
        if (sidebar) {
          const isOpen = sidebar.classList.contains('sidebar-open')
          const isDesktop = window.innerWidth > 768
          if (isDesktop) {
            contentRef.current.style.marginLeft = isOpen ? '220px' : '70px'
          } else {
            contentRef.current.style.marginLeft = '0'
          }
        }
      }
    }

    updateMargin()
    window.addEventListener('resize', updateMargin)

    // Watch for sidebar class changes
    const observer = new MutationObserver(updateMargin)
    if (sidebarRef.current) {
      const sidebar = sidebarRef.current.querySelector('.sidebar')
      if (sidebar) {
        observer.observe(sidebar, { attributes: true, attributeFilter: ['class'] })
      }
    }

    // Initialize Bootstrap tooltip
    if (chatSupportRef.current && typeof window !== 'undefined' && window.bootstrap) {
      const tooltip = new window.bootstrap.Tooltip(chatSupportRef.current)
      return () => {
        window.removeEventListener('resize', updateMargin)
        observer.disconnect()
        tooltip.dispose()
      }
    }

    return () => {
      window.removeEventListener('resize', updateMargin)
      observer.disconnect()
    }
  }, [])

  return (
    <div className="min-vh-100 position-relative overflow-hidden" style={{ backgroundColor: 'var(--main-bg)' }}>
      <div ref={sidebarRef}>
        <Sidebar />
      </div>
      <div
        ref={contentRef}
        className="flex-grow-1 d-flex flex-column min-w-0"
        style={{
          backgroundColor: 'var(--content-bg)',
          transition: 'margin-left 0.3s ease',
          minHeight: '100vh',
        }}
      >
        <Navbar />
        <main className="flex-grow-1 p-4 p-md-5 overflow-auto" style={{ backgroundColor: 'transparent', minHeight: 'calc(100vh - 64px)' }}>
          <Outlet />
        </main>
      </div>
      <div
        ref={chatSupportRef}
        className="position-fixed rounded-circle d-flex align-items-center justify-content-center text-white shadow-lg"
        style={{
          width: '56px',
          height: '56px',
          bottom: '24px',
          right: '24px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          cursor: 'pointer',
          zIndex: 1000,
          fontSize: '24px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
        data-bs-toggle="tooltip"
        data-bs-placement="top"
        title="Chat Support"
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)'
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.4)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)'
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'
        }}
      >
        <i className="bi bi-chat-dots"></i>
      </div>
    </div>
  )
}

export default DashboardLayout