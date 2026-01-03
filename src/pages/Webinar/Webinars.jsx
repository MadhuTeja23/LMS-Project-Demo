import './Webinars.css'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import LiveCard from './LiveCard'
import UpcomingCard from './UpcomingCard'
import RecordedCard from './RecordedCard'
import { FiArrowLeft, FiLayout, FiCalendar, FiClock, FiAlignLeft, FiUsers, FiImage, FiUploadCloud, FiChevronDown, FiCheckCircle, FiChevronLeft } from 'react-icons/fi'
import WebinarHosts from './components/WebinarHostsV2'
import LearningOutcomes from './components/LearningOutcomes'
import Testimonials from './components/Testimonials'

const Webinars = () => {
    const navigate = useNavigate()
    const [title, setTitle] = useState('')
    const [dateTime, setDateTime] = useState('')
    const [durationHours, setDurationHours] = useState(0)
    const [durationMinutes, setDurationMinutes] = useState(0)
    const [notes, setNotes] = useState('')
    const [showSuccess, setShowSuccess] = useState(false)
    const getRandomCover = () => {
        const covers = [
            'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1000', // Study/Notebook
            'https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?auto=format&fit=crop&q=80&w=1000', // Computer/Tech
            'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1000', // Office/Desk
            'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=1000', // Coding/Developer
            'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1000'  // Meeting/Collaboration
        ];
        return covers[Math.floor(Math.random() * covers.length)];
    };

    const [cover, setCover] = useState(getRandomCover())
    const [isDefaultCover, setIsDefaultCover] = useState(true)
    const [memberLimit, setMemberLimit] = useState(100)
    const [type, setType] = useState('upcoming')

    // ... (rest of code) ...

    const onCoverChange = (e) => {
        const f = e.target.files && e.target.files[0]
        if (f) {
            setCover(URL.createObjectURL(f))
            setIsDefaultCover(false)
        }
    }

    // New Fields
    const [notifyLearners, setNotifyLearners] = useState(false)
    const [isPaid, setIsPaid] = useState(false)
    const [currency, setCurrency] = useState('INR')
    const [listPrice, setListPrice] = useState('')
    const [finalPrice, setFinalPrice] = useState('')
    const [showAdvanced, setShowAdvanced] = useState(false)

    // New Features
    const [batchLimitEnabled, setBatchLimitEnabled] = useState(false)
    const [hosts, setHosts] = useState([])
    const [outcomes, setOutcomes] = useState([])
    const [testimonials, setTestimonials] = useState([])


    const [items, setItems] = useState([])
    const [filter, setFilter] = useState('all')

    const location = useLocation()

    useEffect(() => {
        loadItems()
    }, [])

    useEffect(() => {
        // pick up ?filter=live/upcoming/recorded if provided
        try {
            const params = new URLSearchParams(location.search)
            const f = params.get('filter') || params.get('type')
            if (f && ['live', 'upcoming', 'recorded', 'all'].includes(f)) setFilter(f)
        } catch (err) { /* ignore */ }
    }, [location.search])

    const loadItems = () => {
        try {
            const keys = Object.keys(sessionStorage).filter(k => k.startsWith('webinar-'))
            const now = new Date()
            const data = keys.map(k => {
                const raw = sessionStorage.getItem(k)
                if (!raw) return null
                let parsed = JSON.parse(raw)

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
                return parsed
            }).filter(Boolean)
            // sort by dateTime if available
            data.sort((a, b) => (a.dateTime || '') > (b.dateTime || '') ? 1 : -1)
            setItems(data)
        } catch (err) { console.error(err) }
    }

    const handlePublish = (e) => {
        e && e.preventDefault()
        if (!title || !dateTime) {
            alert('Please fill in all required fields')
            return
        }
        const limit = parseInt(memberLimit, 10) || 0
        if (batchLimitEnabled && limit <= 0) { alert('Member limit must be a positive number when enabled'); return }

        const now = new Date();
        const start = new Date(dateTime || Date.now());
        const totalDuration = (parseInt(durationHours, 10) || 0) * 60 + (parseInt(durationMinutes, 10) || 0);
        const durationMs = (totalDuration || 30) * 60 * 1000;
        const end = new Date(start.getTime() + durationMs);

        let autoType = 'upcoming';
        if (now >= start && now <= end) {
            autoType = 'live';
        } else if (now > end) {
            autoType = 'recorded';
        } else {
            autoType = 'upcoming';
        }

        const newItem = {
            id: Date.now(),
            title: title || 'Untitled Webinar',
            dateTime,
            duration: `${durationHours || 0}h ${durationMinutes || 0}m`,
            notes: notes || 'No description provided',
            cover: cover,
            memberLimit: batchLimitEnabled ? memberLimit : null,
            attendedCount: 0, // Keep this from original
            type: autoType,
            hosts,
            outcomes,
            testimonials,
            notifyLearners,
            isPaid,
            currency: isPaid ? currency : null,
            listPrice: isPaid ? listPrice : null,
            finalPrice: isPaid ? finalPrice : null
        }

        try {
            sessionStorage.setItem(`webinar-${newItem.id}`, JSON.stringify(newItem));
            window.dispatchEvent(new Event('webinar-added'));
        } catch (err) { console.error(err) }

        setShowSuccess(true)
    }

    const handleNavigateToDashboard = () => {
        navigate(`/webinar`)
    }

    const visible = items.filter(i => filter === 'all' ? true : (i.type === filter))

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.8 }
    };

    return (
        <div className="create-page">
            <header className="create-header">
                <div className="left">
                    <button className="link-back" onClick={() => navigate(-1)}>
                        <FiArrowLeft size={20} />
                    </button>
                    <h2 style={{ color: '#ffffff' }}>Create a webinar</h2>
                </div>
                <div className="right">
                    <button className="btn btn-success" onClick={handlePublish} style={{ padding: '10px 20px', fontWeight: 600 }}>
                        <FiUploadCloud size={18} style={{ marginRight: 8 }} />
                        Publish
                    </button>
                </div>
            </header>

            <motion.div
                className="create-container"
                onSubmit={handlePublish}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <div className="create-left-column">
                    <div className="form-sections">
                        <label className="field">
                            <div className="label">Webinar title *</div>
                            <div className="input-wrapper">
                                <FiLayout className="input-icon" />
                                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Mastering React 2024" required />
                            </div>
                        </label>

                        <label className="field two">
                            <div className="label">Webinar date *</div>
                            <div className="input-wrapper">
                                <FiCalendar className="input-icon" />
                                <input type="datetime-local" value={dateTime} onChange={(e) => setDateTime(e.target.value)} />
                            </div>
                        </label>

                        <label className="field two">
                            <div className="label">Webinar duration *</div>
                            <div className="input-wrapper" style={{ border: 'none', padding: 0, background: 'transparent' }}>
                                <div className="duration-row">
                                    <div className="duration-input-group">
                                        <input
                                            type="number"
                                            min="0"
                                            value={durationHours}
                                            onChange={(e) => setDurationHours(e.target.value)}
                                            placeholder="0"
                                        />
                                        <span className="input-label">Hours</span>
                                    </div>
                                    <div className="duration-input-group">
                                        <input
                                            type="number"
                                            min="0"
                                            max="59"
                                            value={durationMinutes}
                                            onChange={(e) => setDurationMinutes(e.target.value)}
                                            placeholder="0"
                                        />
                                        <span className="input-label">Minutes</span>
                                    </div>
                                </div>
                            </div>
                        </label>

                        <label className="field">
                            <div className="label">Webinar description</div>
                            <div className="input-wrapper textarea-wrapper">
                                <FiAlignLeft className="input-icon" style={{ top: 18 }} />
                                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Describe what attendees will learn..." />
                            </div>
                        </label>

                        {/* Batch Limit Toggle & Input */}
                        <div style={{ gridColumn: 'span 2', marginTop: 12 }}>
                            <div className="toggle-wrapper">
                                <span className="toggle-label">Enable Batch Limit</span>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={batchLimitEnabled}
                                        onChange={(e) => setBatchLimitEnabled(e.target.checked)}
                                    />
                                    <span className="slider"></span>
                                </label>
                            </div>

                            <AnimatePresence>
                                {batchLimitEnabled && (
                                    <motion.div
                                        className="field"
                                        style={{ marginBottom: 24 }}
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                    >
                                        <div className="label">Max participants</div>
                                        <div className="input-wrapper">
                                            <FiUsers className="input-icon" />
                                            <input
                                                type="number"
                                                min="1"
                                                value={memberLimit}
                                                onChange={(e) => setMemberLimit(e.target.value)}
                                                placeholder="Enter limit"
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* New Toggles */}
                        <div style={{ gridColumn: 'span 2', marginTop: 12 }}>
                            <div className="toggle-wrapper">
                                <span className="toggle-label">Notify learners via email</span>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={notifyLearners}
                                        onChange={(e) => setNotifyLearners(e.target.checked)}
                                    />
                                    <span className="slider"></span>
                                </label>
                            </div>

                            <div className="toggle-wrapper">
                                <span className="toggle-label">Paid webinar</span>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={isPaid}
                                        onChange={(e) => setIsPaid(e.target.checked)}
                                    />
                                    <span className="slider"></span>
                                </label>
                            </div>

                            <AnimatePresence>
                                {isPaid && (
                                    <motion.div
                                        className="pricing-section"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                    >
                                        <span className="payment-warning">
                                            Note: Connect your payment gateway to receive funds
                                        </span>

                                        <div className="pricing-row">
                                            <label className="field" style={{ gridColumn: 'span 1', marginBottom: 0 }}>
                                                <div className="label">List price</div>
                                                <div className="currency-input-group">
                                                    <select
                                                        className="currency-select"
                                                        value={currency}
                                                        onChange={(e) => setCurrency(e.target.value)}
                                                    >
                                                        <option value="INR">₹</option>
                                                        <option value="USD">$</option>
                                                        <option value="EUR">€</option>
                                                    </select>
                                                    <input
                                                        type="number"
                                                        placeholder="0"
                                                        value={listPrice}
                                                        onChange={(e) => setListPrice(e.target.value)}
                                                    />
                                                </div>
                                            </label>

                                            <label className="field" style={{ gridColumn: 'span 1', marginBottom: 0 }}>
                                                <div className="label">Final payable price</div>
                                                <div className="currency-input-group">
                                                    <select
                                                        className="currency-select"
                                                        value={currency}
                                                        onChange={(e) => setCurrency(e.target.value)}
                                                        disabled
                                                    >
                                                        <option value="INR">₹</option>
                                                        <option value="USD">$</option>
                                                        <option value="EUR">€</option>
                                                    </select>
                                                    <input
                                                        type="number"
                                                        placeholder="Price"
                                                        value={finalPrice}
                                                        onChange={(e) => setFinalPrice(e.target.value)}
                                                    />
                                                </div>
                                            </label>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Feature Sections */}
                        <div style={{ gridColumn: 'span 2' }}>
                            <WebinarHosts hosts={hosts} setHosts={setHosts} />
                            <LearningOutcomes outcomes={outcomes} setOutcomes={setOutcomes} />
                            <Testimonials testimonials={testimonials} setTestimonials={setTestimonials} />
                        </div>
                    </div>

                </div>

                <motion.aside
                    className="create-sidebar"
                    style={{ alignSelf: 'start', position: 'sticky', top: '20px' }}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <div className="upload-box">
                        <div style={{ marginBottom: '16px', fontWeight: 700, fontSize: '14px', color: '#1e293b', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Webinar Preview Card</div>

                        <label className="upload-preview clickable-upload">
                            <input type="file" accept="image/*" onChange={onCoverChange} />

                            <img
                                src={cover}
                                alt="cover"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                                }}
                            />

                            {/* Overlay Title for Default Cover */}
                            {isDefaultCover && (
                                <div style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    padding: '24px',
                                    background: 'linear-gradient(to top, rgba(15,23,42,0.9) 0%, rgba(15,23,42,0.4) 60%, transparent 100%)',
                                    color: 'white',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-end',
                                    minHeight: '60%',
                                    textAlign: 'left'
                                }}>
                                    <span style={{
                                        fontSize: '11px',
                                        fontWeight: 700,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.1em',
                                        color: '#818cf8',
                                        marginBottom: '8px'
                                    }}>
                                        {isPaid ? 'Premium Webinar' : 'Free Webinar'}
                                    </span>
                                    <h3 style={{
                                        margin: 0,
                                        fontSize: '20px',
                                        fontWeight: 800,
                                        lineHeight: 1.3,
                                        textShadow: '0 4px 8px rgba(0,0,0,0.3)',
                                        fontFamily: 'Plus Jakarta Sans, sans-serif'
                                    }}>
                                        {title || 'Your Awesome Webinar Title'}
                                    </h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', opacity: 0.9, marginTop: '12px', fontWeight: 500 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <FiCalendar size={14} />
                                            {new Date(dateTime || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </div>
                                        <span>•</span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <FiClock size={14} />
                                            {(parseInt(durationHours) || 0) > 0 ? `${durationHours}h ` : ''}{durationMinutes || 0}m
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Hover Overlay */}
                            <div className="upload-hover-overlay" style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'rgba(0,0,0,0.4)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                opacity: 0,
                                transition: 'all 0.3s ease',
                                flexDirection: 'column',
                                gap: '12px'
                            }}>
                                <div style={{ background: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: '50%', backdropFilter: 'blur(4px)' }}>
                                    <FiUploadCloud size={24} />
                                </div>
                                <span style={{ fontSize: '14px', fontWeight: 600 }}>Change Cover Image</span>
                            </div>
                        </label>

                        <button
                            type="button"
                            className="btn"
                            style={{
                                width: '100%',
                                marginTop: '20px',
                                background: '#f8fafc',
                                color: '#475569',
                                border: '2px dashed #cbd5e1',
                                padding: '12px',
                                borderRadius: '12px',
                                fontWeight: 700,
                                fontSize: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                transition: 'all 0.2s'
                            }}
                            onClick={() => document.querySelector('.clickable-upload input').click()}
                            onMouseOver={(e) => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.color = '#6366f1'; }}
                            onMouseOut={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.color = '#475569'; }}
                        >
                            <FiImage /> Upload Custom Image
                        </button>
                    </div>
                </motion.aside>
            </motion.div>

            <section style={{ padding: '18px 28px' }}>

                <motion.div
                    className="webinar-cards"
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                >

                    {visible.map(item => (
                        <motion.div key={item.id} className="webinar-grid-item" variants={itemVariants}>
                            {item.type === 'live' && <LiveCard item={item} />}
                            {item.type === 'upcoming' && <UpcomingCard item={item} />}
                            {item.type === 'recorded' && <RecordedCard item={item} />}
                        </motion.div>
                    ))}
                </motion.div>
            </section>


            {/* Success Modal */}
            <AnimatePresence>
                {showSuccess && (
                    <div className="modal-overlay" style={{ background: 'rgba(15, 23, 42, 0.8)' }}>
                        <motion.div
                            className="modal"
                            style={{ textAlign: 'center', width: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                        >
                            <div style={{
                                width: '80px',
                                height: '80px',
                                background: '#dcfce7',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#16a34a',
                                fontSize: '40px'
                            }}>
                                <FiCheckCircle />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#1e293b', margin: '0 0 8px 0' }}>Congrats!</h3>
                                <p style={{ color: '#64748b', margin: 0 }}>Your webinar has been successfully published.</p>
                            </div>
                            <button
                                className="btn publish"
                                style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '16px' }}
                                onClick={handleNavigateToDashboard}
                            >
                                Go to Dashboard
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Webinars