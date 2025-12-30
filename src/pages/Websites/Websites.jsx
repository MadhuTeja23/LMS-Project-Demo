import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layout, Globe, Search, Settings,
  Plus, Edit2, Eye, Trash2, GripVertical,
  Check, ChevronRight, Upload, Link, X, Monitor,
  Facebook, Twitter, Instagram, Youtube, Linkedin, Send, Image as ImageIcon
} from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Websites.css';

// --- Custom Hook for Local Storage ---
const usePersistentState = (key, initialValue) => {
  const [state, setState] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error reading localStorage:", error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }, [key, state]);

  return [state, setState];
};

// --- Components ---

const CreatePageModal = ({ isOpen, onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [type, setType] = useState('Landing Page');

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setSlug('');
      setType('Landing Page');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!title) {
      toast.error("Please enter a page title");
      return;
    }
    onCreate({ title, slug: slug || title.toLowerCase().replace(/\s+/g, '-'), type, status: 'Draft' });
    onClose();
  };

  return (
    <div className="wb-modal-overlay">
      <div className="wb-modal-content">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="text-xl font-bold m-0 text-slate-800">Create New Page</h3>
          <button onClick={onClose} className="btn-icon"><X size={20} /></button>
        </div>

        <div className="mb-4">
          <label className="wb-label">Page Title</label>
          <input
            type="text"
            className="wb-input"
            placeholder="e.g. Summer Sale Landing Page"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="wb-label">URL Slug</label>
          <div className="input-group">
            <input
              type="text"
              className="wb-input"
              placeholder="summer-sale-landing-page"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
          </div>
          <p className="text-xs text-slate-400 mt-1">Leave blank to auto-generate from title.</p>
        </div>

        <div className="mb-4">
          <label className="wb-label">Page Type</label>
          <select
            className="wb-input"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option>Landing Page</option>
            <option>Course Catalog</option>
            <option>About / Info</option>
            <option>Legal / Policy</option>
            <option>Blog Post</option>
          </select>
        </div>

        <div className="d-flex gap-3 justify-content-end mt-4">
          <button onClick={onClose} className="btn-secondary-action">Cancel</button>
          <button onClick={handleSubmit} className="btn-primary-action">Create Page</button>
        </div>
      </div>
    </div>
  );
};

// --- Tabs ---

const AppearanceTab = () => {
  const [activeTheme, setActiveTheme] = usePersistentState('lms_wb_theme', 'theme-1');

  const themes = [
    { id: 'theme-1', name: 'Pulse', color: '#10b981' }, // Green
    { id: 'theme-2', name: 'Nebula', color: '#8b5cf6' }, // Purple
    { id: 'theme-3', name: 'Vellum', color: '#64748b' }, // Grey
    { id: 'theme-4', name: 'Blaze', color: '#f59e0b' },  // Orange
    { id: 'theme-5', name: 'Ocean', color: '#06b6d4' },  // Cyan
  ];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="font-bold text-lg text-slate-800">Theme Library</h4>
          <p className="text-slate-500 text-sm">Select a premium design for your academy.</p>
        </div>
        <button className="btn-secondary-action" onClick={() => toast.info("Visual Editor feature coming soon!")}>Open Visual Editor</button>
      </div>

      <div className="theme-showcase-grid">
        {themes.map(t => (
          <div
            key={t.id}
            className={`theme-card-tall ${activeTheme === t.id ? 'active' : ''}`}
            onClick={() => { setActiveTheme(t.id); toast.success(`Theme "${t.name}" applied!`); }}
          >
            <div className="theme-preview-tall">
              {/* Mock Browser UI */}
              <div className="mock-browser-ui">
                <div className="mock-nav" style={{ background: t.color }}></div>
                <div className="mock-hero" style={{ background: `linear-gradient(180deg, ${t.color}22 0%, white 100%)` }}></div>
                <div className="mock-content-row">
                  <div className="mock-block" style={{ opacity: 0.5 }}></div>
                  <div className="mock-block" style={{ opacity: 0.5 }}></div>
                </div>
                <div className="mock-lines">
                  <div className="mock-line"></div>
                  <div className="mock-line short"></div>
                  <div className="mock-line" style={{ width: '80%' }}></div>
                </div>
              </div>
            </div>
            <div className="theme-footer">
              <span className="theme-name">{t.name}</span>
              {activeTheme === t.id ? (
                <span className="text-xs font-bold text-green-600 d-flex align-items-center gap-1">
                  <div className="active-indicator"></div> Active
                </span>
              ) : (
                <span className="text-xs text-slate-400">Click to apply</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const WebsiteBuilderTab = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [pages, setPages] = usePersistentState('lms_wb_pages', [
    { id: 1, title: 'Home Page', url: '/', type: 'Landing Page', status: 'Published' },
    { id: 2, title: 'All Courses', url: '/courses', type: 'Course Catalog', status: 'Published' },
    { id: 3, title: 'About Us', url: '/about', type: 'About / Info', status: 'Draft' },
  ]);

  const handleCreate = (newPage) => {
    setPages([...pages, { id: Date.now(), ...newPage }]);
    toast.success("Page created successfully!");
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this page?')) {
      setPages(pages.filter(p => p.id !== id));
      toast.info("Page deleted.");
    }
  };

  const toggleStatus = (id) => {
    setPages(pages.map(p =>
      p.id === id ? { ...p, status: p.status === 'Published' ? 'Draft' : 'Published' } : p
    ));
    toast.success("Page status updated");
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="font-bold text-lg text-slate-800">Website Builder & Pages</h4>
          <p className="text-slate-500 text-sm">Manage your site content, landing pages, and structure.</p>
        </div>
        <button className="btn-primary-action" onClick={() => setModalOpen(true)}>
          <Plus size={18} /> Create New Page
        </button>
      </div>

      <div className="wb-card p-0 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-slate-50">
              <tr>
                <th className="py-3 ps-4 text-xs font-bold text-muted uppercase tracking-wider border-0">Page Title</th>
                <th className="py-3 text-xs font-bold text-muted uppercase tracking-wider border-0">URL Slug</th>
                <th className="py-3 text-xs font-bold text-muted uppercase tracking-wider border-0">Type</th>
                <th className="py-3 text-xs font-bold text-muted uppercase tracking-wider border-0">Status</th>
                <th className="py-3 pe-4 text-end text-xs font-bold text-muted uppercase tracking-wider border-0">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pages.map(page => (
                <tr key={page.id}>
                  <td className="ps-4 py-3">
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-indigo-50 text-indigo-600 p-2 rounded-lg d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                        <Layout size={18} />
                      </div>
                      <span className="font-semibold text-slate-800 text-sm">{page.title}</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <code className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-200">{page.url}</code>
                  </td>
                  <td className="py-3">
                    <span className="text-sm text-slate-600">{page.type}</span>
                  </td>
                  <td className="py-3">
                    <button
                      className={`px-2 py-1 rounded-full text-xs font-semibold border-0 ${page.status === 'Published'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                        }`}
                      onClick={() => toggleStatus(page.id)}
                      title="Click to toggle status"
                    >
                      {page.status}
                    </button>
                  </td>
                  <td className="pe-4 py-3 text-end">
                    <div className="d-flex align-items-center justify-content-end gap-2">
                      <button className="btn-icon text-slate-400 hover:text-indigo-600 hover:bg-indigo-50" onClick={() => toast.info(`Previewing ${page.title}`)} title="Preview"><Eye size={18} /></button>
                      <button className="btn-icon text-slate-400 hover:text-indigo-600 hover:bg-indigo-50" onClick={() => toast.info(`Editing ${page.title}`)} title="Edit"><Edit2 size={18} /></button>
                      <button className="btn-icon text-slate-400 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(page.id)} title="Delete"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {pages.length === 0 && (
          <div className="p-5 text-center text-slate-500">
            No pages found. Create one to get started!
          </div>
        )}
      </div>

      <CreatePageModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  );
};

const NavigationTab = () => {
  // --- Header State ---
  const [headerConfig, setHeaderConfig] = usePersistentState('lms_wb_header_config_v2', {
    fixed: 'no',
    height: 80,
    bgColor: '#ffffff',
    textColor: '#000000',
    showSearch: 'yes',
    showCart: 'yes'
  });

  const [headerLinks, setHeaderLinks] = usePersistentState('lms_wb_header_links', [
    { id: 1, text: 'Store', url: '/store', newTab: false, visible: true },
    { id: 2, text: 'Blog', url: '/blog', newTab: false, visible: true },
    { id: 3, text: 'About', url: '/about', newTab: false, visible: true },
  ]);

  // --- Footer State ---
  const [footerLinks, setFooterLinks] = usePersistentState('lms_wb_footer_links', {
    facebook: '',
    twitter: '',
    instagram: '',
    youtube: '',
    linkedin: '',
    telegram: ''
  });

  const [footerConfig, setFooterConfig] = usePersistentState('lms_wb_footer_config_v2', {
    bgColor: '#ffffff',
    textColor: '#000000',
    title: 'Launch your Academy',
    copyright: '© 2025 LMS Academy. All rights reserved.'
  });

  // --- Handlers ---
  const updateHeaderConfig = (key, value) => {
    setHeaderConfig(prev => ({ ...prev, [key]: value }));
  };

  const updateFooterConfig = (key, value) => {
    setFooterConfig(prev => ({ ...prev, [key]: value }));
  };

  const updateHeaderLink = (id, field, value) => {
    setHeaderLinks(prev => prev.map(link => link.id === id ? { ...link, [field]: value } : link));
  };

  const addHeaderLink = () => {
    setHeaderLinks([...headerLinks, { id: Date.now(), text: 'New Link', url: '/', newTab: false, visible: true }]);
  };

  const removeHeaderLink = (id) => {
    setHeaderLinks(headerLinks.filter(l => l.id !== id));
  };

  // --- Render ---
  return (
    <div className="animate-fade-in">
      {/* HEADER SECTION */}
      <div className="mb-5">
        <h4 className="font-bold text-xl mb-4 text-slate-800">Header Preview</h4>
        <div className="header-preview-box" style={{
          height: `${headerConfig.height}px`,
          backgroundColor: headerConfig.bgColor,
          color: headerConfig.textColor
        }}>
          {/* Logo Placeholder */}
          <div className="d-flex align-items-center gap-2">
            <div className="rounded-circle bg-indigo-100 p-2 d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
              <Globe size={20} className="text-indigo-600" />
            </div>
            <div className="font-bold text-lg">LOGO</div>
          </div>

          {/* Nav Links */}
          <div className="d-none d-md-flex gap-4 text-sm font-medium d-none-mobile">
            {headerLinks.filter(l => l.visible).map(l => (
              <span key={l.id} style={{ cursor: 'pointer', opacity: 0.9 }}>{l.text}</span>
            ))}
          </div>

          {/* Right Controls */}
          <div className="d-flex align-items-center gap-3">
            {headerConfig.showSearch === 'yes' && <Search size={20} style={{ cursor: 'pointer' }} />}
            {headerConfig.showCart === 'yes' && <div className="position-relative" style={{ cursor: 'pointer' }}><Layout size={20} /><span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"><span className="visually-hidden">New alerts</span></span></div>}
            <button className="btn-primary-action py-2 px-4 text-sm" onClick={() => toast.info("Login clicked (Preview mode)")} style={{ boxShadow: 'none' }}>Login</button>
          </div>
        </div>
      </div>

      {/* HEADER CONTROLS */}
      <div className="wb-card mb-5">
        <h5 className="font-bold text-lg mb-4">Header Configuration</h5>

        <div className="row g-4 mb-5">
          <div className="col-md-6 col-lg-4">
            <label className="wb-label mb-2 text-muted">Fixed at Top</label>
            <div className="d-flex gap-3">
              <label className="d-flex align-items-center gap-2 cursor-pointer bg-slate-50 px-3 py-2 rounded border hover:border-indigo-300 transition-colors w-100 justify-content-center">
                <input type="radio" className="form-check-input" checked={headerConfig.fixed === 'no'} onChange={() => updateHeaderConfig('fixed', 'no')} /> No
              </label>
              <label className="d-flex align-items-center gap-2 cursor-pointer bg-slate-50 px-3 py-2 rounded border hover:border-indigo-300 transition-colors w-100 justify-content-center">
                <input type="radio" className="form-check-input" checked={headerConfig.fixed === 'yes'} onChange={() => updateHeaderConfig('fixed', 'yes')} /> Yes
              </label>
            </div>
          </div>
          <div className="col-md-6 col-lg-4">
            <label className="wb-label mb-2 text-muted">Height (px)</label>
            <input type="number" className="wb-input" value={headerConfig.height} onChange={(e) => updateHeaderConfig('height', e.target.value)} />
          </div>
          <div className="col-md-6 col-lg-4">
            <label className="wb-label mb-2 text-muted">Background Color</label>
            <div className="d-flex gap-2">
              <input type="color" className="form-control form-control-color" value={headerConfig.bgColor} onChange={(e) => updateHeaderConfig('bgColor', e.target.value)} />
              <input type="text" className="wb-input flex-grow-1" value={headerConfig.bgColor} onChange={(e) => updateHeaderConfig('bgColor', e.target.value)} />
            </div>
          </div>
          <div className="col-md-6 col-lg-4">
            <label className="wb-label mb-2 text-muted">Text Color</label>
            <div className="d-flex gap-2">
              <input type="color" className="form-control form-control-color" value={headerConfig.textColor} onChange={(e) => updateHeaderConfig('textColor', e.target.value)} />
              <input type="text" className="wb-input flex-grow-1" value={headerConfig.textColor} onChange={(e) => updateHeaderConfig('textColor', e.target.value)} />
            </div>
          </div>
          <div className="col-md-6 col-lg-4">
            <label className="wb-label mb-2 text-muted">Show Search Box</label>
            <div className="d-flex gap-3">
              <label className="d-flex align-items-center gap-2 cursor-pointer bg-slate-50 px-3 py-2 rounded border hover:border-indigo-300 transition-colors w-100 justify-content-center">
                <input type="radio" className="form-check-input" checked={headerConfig.showSearch === 'no'} onChange={() => updateHeaderConfig('showSearch', 'no')} /> No
              </label>
              <label className="d-flex align-items-center gap-2 cursor-pointer bg-slate-50 px-3 py-2 rounded border hover:border-indigo-300 transition-colors w-100 justify-content-center">
                <input type="radio" className="form-check-input" checked={headerConfig.showSearch === 'yes'} onChange={() => updateHeaderConfig('showSearch', 'yes')} /> Yes
              </label>
            </div>
          </div>
          <div className="col-md-6 col-lg-4">
            <label className="wb-label mb-2 text-muted">Show Cart</label>
            <div className="d-flex gap-3">
              <label className="d-flex align-items-center gap-2 cursor-pointer bg-slate-50 px-3 py-2 rounded border hover:border-indigo-300 transition-colors w-100 justify-content-center">
                <input type="radio" className="form-check-input" checked={headerConfig.showCart === 'no'} onChange={() => updateHeaderConfig('showCart', 'no')} /> No
              </label>
              <label className="d-flex align-items-center gap-2 cursor-pointer bg-slate-50 px-3 py-2 rounded border hover:border-indigo-300 transition-colors w-100 justify-content-center">
                <input type="radio" className="form-check-input" checked={headerConfig.showCart === 'yes'} onChange={() => updateHeaderConfig('showCart', 'yes')} /> Yes
              </label>
            </div>
          </div>
        </div>

        <hr className="my-5 border-slate-100" />

        {/* Links Table */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="font-bold text-lg m-0">Menu Items</h5>
          <button className="btn-secondary-action text-sm" onClick={addHeaderLink}><Plus size={16} /> Add Link</button>
        </div>

        <div className="table-responsive rounded-lg border border-slate-100">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-xs text-muted uppercase fw-bold border-0 py-3 ps-3">Label</th>
                <th className="text-xs text-muted uppercase fw-bold border-0 py-3">Destination URL</th>
                <th className="text-xs text-muted uppercase fw-bold border-0 py-3 text-center">Open New Tab</th>
                <th className="text-xs text-muted uppercase fw-bold border-0 py-3 text-center">Visible</th>
                <th className="border-0 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {headerLinks.map(link => (
                <tr key={link.id}>
                  <td className="ps-3"><input className="wb-input py-2 text-sm border-slate-200" value={link.text} onChange={(e) => updateHeaderLink(link.id, 'text', e.target.value)} /></td>
                  <td><input className="wb-input py-2 text-sm border-slate-200" value={link.url} onChange={(e) => updateHeaderLink(link.id, 'url', e.target.value)} /></td>
                  <td className="text-center">
                    <div className="d-flex justify-content-center">
                      <div className="form-check form-switch m-0">
                        <input className="form-check-input cursor-pointer" type="checkbox" checked={link.newTab} onChange={(e) => updateHeaderLink(link.id, 'newTab', e.target.checked)} />
                      </div>
                    </div>
                  </td>
                  <td className="text-center">
                    <div className="d-flex justify-content-center">
                      <div className="form-check form-switch m-0">
                        <input className="form-check-input cursor-pointer" type="checkbox" checked={link.visible} onChange={(e) => updateHeaderLink(link.id, 'visible', e.target.checked)} />
                      </div>
                    </div>
                  </td>
                  <td className="text-end pe-3"><button className="btn-icon text-danger hover:bg-red-50" onClick={() => removeHeaderLink(link.id)}><Trash2 size={16} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FOOTER SECTION */}
      <div className="mb-5">
        <h4 className="font-bold text-xl mb-4 text-slate-800">Footer Preview</h4>
        <div className="p-5 rounded-xl text-center transition-colors" style={{ backgroundColor: footerConfig.bgColor, color: footerConfig.textColor }}>
          <h4 className="mb-3 font-bold">{footerConfig.title}</h4>
          <div className="d-flex justify-content-center gap-3 mb-4" style={{ opacity: 0.9 }}>
            {/* Social Icons Preview */}
            {footerLinks.facebook && <div className="p-2 rounded-circle" style={{ backgroundColor: `${footerConfig.textColor}15` }}><Facebook size={18} /></div>}
            {footerLinks.twitter && <div className="p-2 rounded-circle" style={{ backgroundColor: `${footerConfig.textColor}15` }}><Twitter size={18} /></div>}
            {footerLinks.instagram && <div className="p-2 rounded-circle" style={{ backgroundColor: `${footerConfig.textColor}15` }}><Instagram size={18} /></div>}
            {footerLinks.youtube && <div className="p-2 rounded-circle" style={{ backgroundColor: `${footerConfig.textColor}15` }}><Youtube size={18} /></div>}
            {footerLinks.linkedin && <div className="p-2 rounded-circle" style={{ backgroundColor: `${footerConfig.textColor}15` }}><Linkedin size={18} /></div>}
            {footerLinks.telegram && <div className="p-2 rounded-circle" style={{ backgroundColor: `${footerConfig.textColor}15` }}><Send size={18} /></div>}

            {!Object.values(footerLinks).some(v => v) && <span className="text-sm fst-italic opacity-50">Social links will appear here</span>}
          </div>
          <div className="border-top pt-4 mt-4" style={{ borderColor: `${footerConfig.textColor}20` }}>
            <small style={{ opacity: 0.6 }}>{footerConfig.copyright}</small>
          </div>
        </div>
      </div>

      {/* FOOTER CONTROLS */}
      <div className="wb-card">
        <h5 className="font-bold text-lg mb-4">Footer Configuration</h5>

        {/* Visual Settings */}
        <div className="row g-4 mb-5">
          <div className="col-md-6">
            <label className="wb-label mb-2 text-muted">Footer Background</label>
            <div className="d-flex gap-2">
              <input type="color" className="form-control form-control-color" value={footerConfig.bgColor} onChange={(e) => updateFooterConfig('bgColor', e.target.value)} />
              <input type="text" className="wb-input flex-grow-1" value={footerConfig.bgColor} onChange={(e) => updateFooterConfig('bgColor', e.target.value)} />
            </div>
          </div>
          <div className="col-md-6">
            <label className="wb-label mb-2 text-muted">Footer Text Color</label>
            <div className="d-flex gap-2">
              <input type="color" className="form-control form-control-color" value={footerConfig.textColor} onChange={(e) => updateFooterConfig('textColor', e.target.value)} />
              <input type="text" className="wb-input flex-grow-1" value={footerConfig.textColor} onChange={(e) => updateFooterConfig('textColor', e.target.value)} />
            </div>
          </div>
          <div className="col-md-6">
            <label className="wb-label mb-2 text-muted">Footer Title</label>
            <input type="text" className="wb-input" value={footerConfig.title} onChange={(e) => updateFooterConfig('title', e.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="wb-label mb-2 text-muted">Copyright Text</label>
            <input type="text" className="wb-input" value={footerConfig.copyright} onChange={(e) => updateFooterConfig('copyright', e.target.value)} />
          </div>
        </div>

        <hr className="my-5 border-slate-100" />

        <h5 className="font-bold text-lg mb-4">Social Media Links</h5>
        <div className="row g-4">
          {[
            { name: 'Facebook', icon: <Facebook size={18} />, key: 'facebook', color: 'text-blue-600' },
            { name: 'Twitter', icon: <Twitter size={18} />, key: 'twitter', color: 'text-sky-500' },
            { name: 'Instagram', icon: <Instagram size={18} />, key: 'instagram', color: 'text-pink-600' },
            { name: 'YouTube', icon: <Youtube size={18} />, key: 'youtube', color: 'text-red-600' },
            { name: 'LinkedIn', icon: <Linkedin size={18} />, key: 'linkedin', color: 'text-blue-700' },
            { name: 'Telegram', icon: <Send size={18} />, key: 'telegram', color: 'text-sky-400' }
          ].map(social => (
            <div key={social.key} className="col-md-6">
              <label className="wb-label text-muted mb-2 text-xs font-bold uppercase tracking-wider">{social.name}</label>
              <div className="d-flex align-items-center border border-slate-200 rounded-lg bg-white overflow-hidden" style={{ transition: 'all 0.2s' }}>
                <div className={`px-3 py-2 border-end border-slate-100 ${social.color} bg-slate-50 d-flex align-items-center justify-content-center`} style={{ width: '48px', height: '42px' }}>
                  {social.icon}
                </div>
                <input
                  className="flex-grow-1 border-0 px-3 py-2 text-sm text-slate-700 placeholder-slate-400"
                  placeholder={`username`}
                  value={footerLinks[social.key] || ''}
                  onChange={(e) => setFooterLinks({ ...footerLinks, [social.key]: e.target.value })}
                  style={{ outline: 'none', boxShadow: 'none', width: '100%' }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="d-flex justify-content-end mt-5 pt-3 border-top">
          <button className="btn-primary-action px-4 py-2" onClick={() => toast.success("Configuration saved successfully!")}><Check size={18} className="me-2" /> Save Changes</button>
        </div>
      </div>
    </div>
  );
};

const SEOTab = () => {
  const [seoConfig, setSeoConfig] = usePersistentState('lms_wb_seo', {
    title: 'My Learning Academy',
    description: 'Join thousands of students learning effectively.'
  });

  return (
    <div className="row justify-content-center">
      <div className="col-lg-8">
        <div className="wb-card">
          <div className="d-flex align-items-start justify-content-between mb-4">
            <div>
              <h4 className="font-bold text-lg m-0">Global SEO</h4>
              <p className="text-slate-500 text-sm">Configure default meta tags for better visibility.</p>
            </div>
            <div className="bg-indigo-50 p-2 rounded text-indigo-600"><Search size={24} /></div>
          </div>

          <div className="mb-4">
            <label className="wb-label">Meta Title</label>
            <input
              className="wb-input"
              value={seoConfig.title}
              onChange={(e) => setSeoConfig({ ...seoConfig, title: e.target.value })}
            />
          </div>
          <div className="mb-4">
            <label className="wb-label">Meta Description</label>
            <textarea
              className="wb-input"
              rows={3}
              value={seoConfig.description}
              onChange={(e) => setSeoConfig({ ...seoConfig, description: e.target.value })}
            />
          </div>

          <div className="d-flex justify-content-end">
            <button className="btn-primary-action" onClick={() => toast.success("SEO Settings Saved!")}>
              <Check size={16} /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingsTab = () => {
  const [settings, setSettings] = usePersistentState('lms_wb_settings', {
    siteName: 'LMS Academy',
    siteDescription: 'The best place to learn online.',
    logo: null,
    favicon: null,
    enableFootfall: true
  });

  const logoInputRef = useRef(null);
  const faviconInputRef = useRef(null);

  const handleFileUpload = (e, key) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 500000) {
        toast.error("File is too large for this demo (max 500KB)");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettings(prev => ({ ...prev, [key]: reader.result }));
        toast.success(`${key === 'logo' ? 'Logo' : 'Favicon'} updated!`);
      };
      reader.readAsDataURL(file);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-5xl mx-auto"
    >
      <div className="d-flex align-items-center justify-content-between mb-5">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 m-0">Site Settings</h2>
          <p className="text-slate-500 mt-1">Manage your brand identity and global configurations.</p>
        </div>
        <button className="btn-primary-action" onClick={() => toast.success("All settings saved successfully!")}>
          <Check size={18} className="me-2" /> Save Changes
        </button>
      </div>

      <div className="row g-4">
        {/* Left Column: General Info */}
        <div className="col-lg-6">
          <motion.div variants={itemVariants} className="wb-card h-100 mb-4 p-5">
            <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom border-slate-100">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <Settings size={20} />
              </div>
              <h5 className="font-bold text-lg m-0 text-slate-800">Site Configuration</h5>
            </div>

            <div className="mb-4">
              <label className="wb-label mb-2">Site Name</label>
              <input
                type="text"
                className="wb-input w-100 p-3 bg-slate-50 border-slate-200 focus:bg-white transition-all"
                placeholder="e.g. My Awesome Academy"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              />
              <p className="text-xs text-slate-400 mt-2">This name will appear in browser tabs and email notifications.</p>
            </div>

            <div className="mb-4">
              <label className="wb-label mb-2">Site Description</label>
              <textarea
                rows={4}
                className="wb-input w-100 p-3 bg-slate-50 border-slate-200 focus:bg-white transition-all"
                placeholder="Briefly describe your academy..."
                value={settings.siteDescription || ''}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
              />
              <p className="text-xs text-slate-400 mt-2">Used for SEO and social media sharing previews.</p>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Branding */}
        <div className="col-lg-6">
          <motion.div variants={itemVariants} className="wb-card h-100 mb-4 p-5">
            <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom border-slate-100">
              <div className="p-2 bg-pink-50 text-pink-600 rounded-lg">
                <ImageIcon size={20} />
              </div>
              <h5 className="font-bold text-lg m-0 text-slate-800">Brand Identity</h5>
            </div>

            {/* Logo Upload */}
            <div className="mb-4">
              <label className="wb-label mb-2">Primary Logo</label>
              <div
                className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-indigo-400 transition-colors cursor-pointer bg-slate-50"
                onClick={() => logoInputRef.current.click()}
              >
                {settings.logo ? (
                  <div className="position-relative group">
                    <img
                      src={settings.logo}
                      alt="Logo"
                      className="img-fluid mx-auto mb-2"
                      style={{ maxHeight: '80px', objectFit: 'contain' }}
                    />
                    <span className="text-xs text-indigo-600 font-medium bg-white px-2 py-1 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">Click to Replace</span>
                  </div>
                ) : (
                  <div className="py-3">
                    <div className="bg-white p-2 rounded-full shadow-sm d-inline-block mb-2 text-secondary">
                      <Upload size={20} />
                    </div>
                    <p className="text-sm font-medium text-slate-600 m-0">Upload Logo</p>
                    <p className="text-xs text-slate-400 m-0 mt-1">PNG, JPG (Max 500KB)</p>
                  </div>
                )}
                <input ref={logoInputRef} type="file" className="d-none" accept="image/*" onChange={(e) => handleFileUpload(e, 'logo')} />
              </div>
            </div>

            {/* Favicon Upload */}
            <div>
              <label className="wb-label mb-2">Favicon</label>
              <div className="d-flex align-items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="bg-white border border-slate-100 rounded-lg flex-shrink-0 d-flex align-items-center justify-content-center" style={{ width: 48, height: 48 }}>
                  {settings.favicon ? (
                    <img
                      src={settings.favicon}
                      className="object-contain"
                      style={{ width: '32px', height: '32px' }}
                    />
                  ) : (
                    <Globe size={20} className="text-secondary" />
                  )}
                </div>
                <div className="flex-grow-1">
                  <p className="text-sm font-semibold text-slate-700 m-0">Browser Icon</p>
                  <p className="text-xs text-slate-400 m-0">32x32px PNG</p>
                </div>
                <button className="btn btn-sm btn-outline-secondary bg-white border-slate-200 text-slate-600" onClick={() => faviconInputRef.current.click()}>Upload</button>
                <input ref={faviconInputRef} type="file" className="d-none" accept="image/*" onChange={(e) => handleFileUpload(e, 'favicon')} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Full Width: Features */}
        <div className="col-12">
          <motion.div variants={itemVariants} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom border-slate-100">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <Monitor size={20} />
              </div>
              <h5 className="font-bold text-lg m-0 text-slate-800">Feature Settings</h5>
            </div>

            <div className="d-flex align-items-center justify-content-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
              <div>
                <h6 className="font-bold text-slate-800 m-0 mb-1">Enable Social Footfall</h6>
                <p className="text-sm text-slate-500 m-0" style={{ maxWidth: '600px' }}>
                  Display live notifications of learner signups and purchases on your landing pages to increase trust and conversion rates.
                </p>
              </div>
              <div className="form-check form-switch" style={{ fontSize: '1.2rem' }}>
                <input
                  className="form-check-input cursor-pointer"
                  type="checkbox"
                  checked={settings.enableFootfall}
                  onChange={(e) => {
                    setSettings({ ...settings, enableFootfall: e.target.checked });
                    toast.info(`Social Footfall ${e.target.checked ? 'Enabled' : 'Disabled'}`);
                  }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};


const Websites = () => {
  const [activeTab, setActiveTab] = useState('builder'); // Default to builder for immediate interaction

  const tabs = [
    { id: 'appearance', label: 'Appearance', icon: <Monitor size={18} /> },
    { id: 'builder', label: 'Website Builder', icon: <Layout size={18} /> },
    { id: 'navigation', label: 'Navigation', icon: <ChevronRight size={18} /> },
    { id: 'seo', label: 'SEO', icon: <Search size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  return (
    <div className="container-fluid p-0"> {/* Wrapper to contain layout */}
      <div className="website-builder-container">
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />

        <div className="wb-header">
          <h1 className="wb-title">Manage Website</h1>
          <p className="wb-subtitle">Design, customize, and manage your public-facing academy website.</p>
        </div>

        <div className="wb-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`wb-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'appearance' && <AppearanceTab />}
            {activeTab === 'builder' && <WebsiteBuilderTab />}
            {activeTab === 'navigation' && <NavigationTab />}
            {activeTab === 'seo' && <SEOTab />}
            {activeTab === 'settings' && <SettingsTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Websites;