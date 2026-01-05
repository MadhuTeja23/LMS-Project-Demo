import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    FiArrowLeft, FiSave, FiLayers, FiUsers, FiCreditCard,
    FiCalendar, FiCheck, FiDollarSign
} from 'react-icons/fi';
import './FeeManagement.css';

const CreateFee = () => {
    const navigate = useNavigate();

    // Form States
    const [basicDetails, setBasicDetails] = useState({
        name: '',
        type: 'Tuition',
        amount: '',
        description: ''
    });

    const [assignment, setAssignment] = useState({
        course: '',
        batch: '',
        category: 'Normal'
    });

    const [paymentConfig, setPaymentConfig] = useState({
        schedule: 'Monthly',
        dueDate: '',
        lateFeeEnabled: false,
        lateFeeType: 'amount', // 'amount' or 'percentage'
        lateFeeValue: '',
        autoApplyDiscounts: false
    });

    const handleBasicChange = (e) => setBasicDetails({ ...basicDetails, [e.target.name]: e.target.value });
    const handleAssignChange = (e) => setAssignment({ ...assignment, [e.target.name]: e.target.value });
    // const handleConfigChange = (e) => setPaymentConfig({...paymentConfig, [e.target.name]: e.target.value}); // Generalized handler

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ basicDetails, assignment, paymentConfig });
        // Add API call here
        alert('Fee Structure Created Successfully (Demo)');
        navigate('/fee');
    };

    return (
        <motion.div
            className="fee-container"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
        >
            {/* Header */}
            <header className="fee-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button onClick={() => navigate('/fee')} className="btn-icon">
                        <FiArrowLeft />
                    </button>
                    <div className="fee-title">
                        <h1>Create New Fee</h1>
                        <div className="fee-subtitle">Define fee structure, pricing plans, and payment schedules</div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <button onClick={() => navigate('/fee')} style={{
                        background: 'transparent', border: '1px solid #cbd5e1',
                        padding: '10px 24px', borderRadius: '10px', fontWeight: 600, color: '#64748b', cursor: 'pointer'
                    }}>
                        Cancel
                    </button>
                    <button onClick={handleSubmit} className="btn-primary">
                        <FiSave /> Save Fee Structure
                    </button>
                </div>
            </header>

            {/* Main Form Content */}
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

                {/* Section 1: Basic Details */}
                <motion.div
                    className="glass-card form-section"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="section-title">
                        <div className="stat-icon" style={{ width: 32, height: 32, fontSize: 16 }}><FiLayers /></div>
                        Basic Details
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Fee Name *</label>
                            <input
                                type="text"
                                name="name"
                                className="form-input"
                                placeholder="e.g. Annual Tuition Fee 2026"
                                value={basicDetails.name}
                                onChange={handleBasicChange}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Fee Type *</label>
                            <select name="type" className="form-select" value={basicDetails.type} onChange={handleBasicChange}>
                                <option value="Course Fee">Course Fee</option>
                                <option value="Registration">Registration / Enrollment</option>
                                <option value="Certification">Certification Fee</option>
                                <option value="Material">Learning Material / Kit</option>
                                <option value="Subscription">Platform Subscription</option>
                                <option value="Custom">Custom Charge</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Amount (₹) *</label>
                            <div style={{ position: 'relative' }}>
                                <FiDollarSign style={{ position: 'absolute', left: 12, top: 14, color: '#64748b' }} />
                                <input
                                    type="number"
                                    name="amount"
                                    className="form-input"
                                    style={{ paddingLeft: 36 }}
                                    placeholder="0.00"
                                    value={basicDetails.amount}
                                    onChange={handleBasicChange}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="form-group" style={{ marginTop: 24 }}>
                        <label className="form-label">Description (Optional)</label>
                        <textarea
                            name="description"
                            className="form-textarea"
                            placeholder="Add generic notes about this fee..."
                            value={basicDetails.description}
                            onChange={handleBasicChange}
                        ></textarea>
                    </div>
                </motion.div>

                {/* Section 2: Assign Fee To */}
                <motion.div
                    className="glass-card form-section"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="section-title">
                        <div className="stat-icon" style={{ width: 32, height: 32, fontSize: 16 }}><FiUsers /></div>
                        Assign Fee To
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Select Course / Product</label>
                            <select name="course" className="form-select" value={assignment.course} onChange={handleAssignChange}>
                                <option value="">Select Course...</option>
                                <option value="Full Stack Dev">Full Stack Web Development</option>
                                <option value="Data Science">Data Science Bootcamp</option>
                                <option value="UI/UX Design">UI/UX Design Masterclass</option>
                                <option value="Digital Marketing">Digital Marketing Executive</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Select Cohort (Optional)</label>
                            <select name="batch" className="form-select" value={assignment.batch} onChange={handleAssignChange} disabled={!assignment.course}>
                                <option value="">All Cohorts</option>
                                <option value="Jan 2026">Jan 2026 Batch</option>
                                <option value="Feb 2026">Feb 2026 Batch</option>
                                <option value="Weekend">Weekend Special</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">User Segment</label>
                            <select name="category" className="form-select" value={assignment.category} onChange={handleAssignChange}>
                                <option value="all">All Users</option>
                                <option value="General">General / Individual</option>
                                <option value="Corporate">Corporate / B2B</option>
                                <option value="International">International</option>
                                <option value="Staff">Internal Staff</option>
                            </select>
                        </div>
                    </div>
                </motion.div>

                {/* Section 3: Payment Configuration */}
                <motion.div
                    className="glass-card form-section"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="section-title">
                        <div className="stat-icon" style={{ width: 32, height: 32, fontSize: 16 }}><FiCreditCard /></div>
                        Payment Configuration
                    </div>

                    <div className="form-grid" style={{ marginBottom: 32 }}>
                        <div className="form-group">
                            <label className="form-label">Payment Schedule</label>
                            <select
                                className="form-select"
                                value={paymentConfig.schedule}
                                onChange={(e) => setPaymentConfig({ ...paymentConfig, schedule: e.target.value })}
                            >
                                <option value="OneTime">One Time Payment</option>
                                <option value="Monthly">Monthly</option>
                                <option value="Quarterly">Quarterly</option>
                                <option value="Yearly">Yearly</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Due Date</label>
                            <div style={{ position: 'relative' }}>
                                <FiCalendar style={{ position: 'absolute', left: 12, top: 14, color: '#64748b' }} />
                                <input
                                    type="date"
                                    className="form-input"
                                    style={{ paddingLeft: 36 }}
                                    value={paymentConfig.dueDate}
                                    onChange={(e) => setPaymentConfig({ ...paymentConfig, dueDate: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="section-divider"></div>

                    <div className="form-grid">
                        {/* Late Fee Toggle */}
                        <div className="form-group">
                            <label className="form-label" style={{ marginBottom: 12 }}>Late Fee Rules</label>
                            <div
                                className={`toggle-switch ${paymentConfig.lateFeeEnabled ? 'active' : ''}`}
                                onClick={() => setPaymentConfig({ ...paymentConfig, lateFeeEnabled: !paymentConfig.lateFeeEnabled })}
                            >
                                <div className="toggle-track">
                                    <div className="toggle-thumb"></div>
                                </div>
                                <span className="toggle-label">Enable Late Fee</span>
                            </div>
                        </div>

                        {/* Late Fee inputs (conditional) */}
                        {paymentConfig.lateFeeEnabled && (
                            <>
                                <div className="form-group">
                                    <label className="form-label">Late Fee Type</label>
                                    <div style={{ display: 'flex', gap: 12 }}>
                                        <button
                                            className={`nav-tab ${paymentConfig.lateFeeType === 'amount' ? 'active' : ''}`}
                                            style={{ padding: '8px 16px' }}
                                            onClick={() => setPaymentConfig({ ...paymentConfig, lateFeeType: 'amount' })}
                                        >
                                            Flat Amount
                                        </button>
                                        <button
                                            className={`nav-tab ${paymentConfig.lateFeeType === 'percentage' ? 'active' : ''}`}
                                            style={{ padding: '8px 16px' }}
                                            onClick={() => setPaymentConfig({ ...paymentConfig, lateFeeType: 'percentage' })}
                                        >
                                            Percentage %
                                        </button>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Value</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        placeholder="Enter value"
                                        value={paymentConfig.lateFeeValue}
                                        onChange={(e) => setPaymentConfig({ ...paymentConfig, lateFeeValue: e.target.value })}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </motion.div>

                {/* Final Actions for Discount */}
                <motion.div
                    className="glass-card"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                    <div>
                        <h4 style={{ margin: '0 0 4px 0', color: '#1e293b' }}>Automated Discounts</h4>
                        <p style={{ margin: 0, color: '#64748b', fontSize: 14 }}>Automatically apply scholarships if student is eligible.</p>
                    </div>
                    <div
                        className={`toggle-switch ${paymentConfig.autoApplyDiscounts ? 'active' : ''}`}
                        onClick={() => setPaymentConfig({ ...paymentConfig, autoApplyDiscounts: !paymentConfig.autoApplyDiscounts })}
                    >
                        <div className="toggle-track">
                            <div className="toggle-thumb"></div>
                        </div>
                        <span className="toggle-label">{paymentConfig.autoApplyDiscounts ? 'Enabled' : 'Disabled'}</span>
                    </div>
                </motion.div>

                <div style={{ height: 100 }}></div>
            </div>
        </motion.div>
    );
};

export default CreateFee;
