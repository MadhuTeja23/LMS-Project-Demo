import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiGrid, FiList, FiDollarSign, FiUsers, FiPieChart, FiTrendingUp,
    FiMoreVertical, FiFilter, FiDownload, FiPlus, FiSearch, FiCalendar,
    FiSettings, FiCreditCard, FiActivity, FiTag, FiAward, FiRefreshCcw,
    FiFileText, FiCheckCircle, FiAlertCircle
} from 'react-icons/fi';
import './FeeManagement.css';

// --- Sub-Components (Inline for single-file demo, but modular in practice) ---

const FeeDashboard = () => {
    const kpiData = [
        { title: "Total Revenue", value: "₹24,50,000", icon: <FiDollarSign />, color: "linear-gradient(135deg, #10b981 0%, #059669 100%)" },
        { title: "Pending Installments", value: "₹4,20,500", icon: <FiAlertCircle />, color: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" },
        { title: "Learners Paid", value: "854", icon: <FiUsers />, color: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)" },
        { title: "Overdue", value: "125", icon: <FiActivity />, color: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)" },
    ];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* KPI Cards */}
            <div className="stats-grid">
                {kpiData.map((kpi, index) => (
                    <motion.div
                        key={index}
                        className="glass-card stat-item"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <div className="stat-header">
                            <div className="stat-icon" style={{ background: kpi.color }}>{kpi.icon}</div>
                            <button className="btn-icon"><FiMoreVertical /></button>
                        </div>
                        <div className="stat-value">{kpi.value}</div>
                        <div className="stat-label">{kpi.title}</div>
                    </motion.div>
                ))}
            </div>

            {/* Charts Section Placeholder */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }}>
                <div className="glass-card" style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    <h3 style={{ alignSelf: 'flex-start', margin: '0 0 20px 0', fontSize: '18px' }}>Monthly Collection Trend</h3>
                    <div style={{ width: '100%', height: '4px', background: '#e2e8f0', borderRadius: '2px', position: 'relative' }}>
                        <motion.div
                            initial={{ width: 0 }} animate={{ width: '70%' }}
                            style={{ position: 'absolute', height: '100%', background: '#6366f1' }}
                        />
                    </div>
                    <p style={{ marginTop: '16px', color: '#94a3b8' }}>Chart visualization goes here</p>
                </div>
                <div className="glass-card" style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    <h3 style={{ alignSelf: 'flex-start', margin: '0 0 20px 0', fontSize: '18px' }}>Payment Modes</h3>
                    <div style={{ width: '150px', height: '150px', borderRadius: '50%', border: '20px solid #f1f5f9', borderTopColor: '#10b981', borderRightColor: '#6366f1' }}></div>
                </div>
            </div>

            {/* Recent Table */}
            <div className="glass-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <h3>Recent Transactions</h3>
                    <button className="btn-icon"><FiFilter /></button>
                </div>
                <div className="table-container">
                    <table className="premium-table">
                        <thead>
                            <tr>
                                <th>Learner / User</th>
                                <th>Order ID</th>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[1, 2, 3, 4, 5].map(i => (
                                <tr key={i}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e2e8f0' }}></div>
                                            <span>John Doe {i}</span>
                                        </div>
                                    </td>
                                    <td>#TXN-7823{i}</td>
                                    <td>Jan {i + 5}, 2026</td>
                                    <td>₹12,000</td>
                                    <td>
                                        <span className={`status-badge ${i % 2 === 0 ? 'paid' : 'pending'}`}>
                                            {i % 2 === 0 ? <FiCheckCircle /> : <FiAlertCircle />}
                                            {i % 2 === 0 ? 'Paid' : 'Pending'}
                                        </span>
                                    </td>
                                    <td><button className="btn-icon"><FiMoreVertical /></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};

// --- Main Layout ---

const FeeManagement = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');

    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: <FiGrid /> },
        { id: 'pricing', label: 'Pricing Plans', icon: <FiList /> },
        { id: 'structures', label: 'Fee Structures', icon: <FiDollarSign /> },
        { id: 'access', label: 'Access & Pricing', icon: <FiUsers /> },
        { id: 'payments', label: 'Payments', icon: <FiCreditCard /> },
        { id: 'discounts', label: 'Coupons & Discounts', icon: <FiAward /> },
        { id: 'refunds', label: 'Refunds', icon: <FiRefreshCcw /> },
        { id: 'receipts', label: 'Invoices', icon: <FiFileText /> },
        { id: 'audit', label: 'Audit Logs', icon: <FiActivity /> },
    ];

    return (
        <div className="fee-container">
            {/* Header */}
            <header className="fee-header">
                <div className="fee-title">
                    <h1>Fee Management</h1>
                    <div className="fee-subtitle">Manage payments, structures, and financial reports</div>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <div className="glass-card" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FiSearch color="#64748b" />
                        <input
                            type="text"
                            placeholder="Search anything..."
                            style={{ border: 'none', background: 'transparent', outline: 'none', minWidth: '200px' }}
                        />
                    </div>
                    <button className="btn-primary" onClick={() => navigate('/fee/create')}>
                        <FiPlus /> Create Fee
                    </button>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#cbd5e1' }}></div>
                </div>
            </header>

            {/* Navigation */}
            <nav className="nav-tabs">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </nav>

            {/* Content Area */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'dashboard' && <FeeDashboard />}
                    {activeTab !== 'dashboard' && (
                        <div className="glass-card" style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                                <FiSettings size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                                <h3>{tabs.find(t => t.id === activeTab)?.label} Module</h3>
                                <p>Coming soon details for this sub-module.</p>
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default FeeManagement;
