import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiUsers, FiChevronRight, FiSearch, FiFilter, FiMoreVertical,
    FiArrowLeft, FiCalendar, FiClock, FiCheckCircle,
    FiAlertCircle, FiDownload, FiCreditCard, FiTrash2, FiEdit3
} from 'react-icons/fi';
import './FeeManagement.css';

// --- Mock Data ---
const BATCHES_DATA = [
    { id: 1, name: 'Full Stack Cohort 1', course: 'Full Stack Development', year: '2025-26', students: 45, collected: 75 },
    { id: 2, name: 'Data Science Batch A', course: 'Data Science', year: '2025-26', students: 32, collected: 40 },
    { id: 3, name: 'React Native Special', course: 'Mobile App Dev', year: '2025', students: 28, collected: 90 },
    { id: 4, name: 'Backend Masters', course: 'Backend Engineering', year: '2026', students: 50, collected: 15 },
    { id: 5, name: 'UI/UX Design Batch B', course: 'Product Design', year: '2025', students: 22, collected: 60 },
];

const STUDENTS_DATA = [
    { id: 101, name: 'Aarav Patel', roll: 'FS-001', status: 'Paid', due: 0, total: 45000, paid: 45000, lastPay: '2025-01-15' },
    { id: 102, name: 'Diya Sharma', roll: 'FS-002', status: 'Pending', due: 15000, total: 45000, paid: 30000, lastPay: '2024-12-10' },
    { id: 103, name: 'Rohan Gupta', roll: 'FS-003', status: 'Ovderdue', due: 45000, total: 45000, paid: 0, lastPay: '-' },
    { id: 104, name: 'Sanya Singh', roll: 'FS-004', status: 'Partial', due: 5000, total: 45000, paid: 40000, lastPay: '2025-01-05' },
    { id: 105, name: 'Kabir Khan', roll: 'FS-005', status: 'Paid', due: 0, total: 45000, paid: 45000, lastPay: '2025-01-12' },
];

const FeeBatches = () => {
    const [view, setView] = useState('grid'); // grid, list, detail
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);

    const handleBatchClick = (batch) => {
        setSelectedBatch(batch);
        setView('list');
    };

    const handleStudentClick = (student) => {
        setSelectedStudent(student);
        setView('detail');
    };

    const handleBack = () => {
        if (view === 'detail') setView('list');
        else if (view === 'list') {
            setSelectedBatch(null);
            setView('grid');
        }
    };

    // --- Views ---

    const BatchGrid = () => (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="form-grid"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}
        >
            {BATCHES_DATA.map(batch => (
                <div
                    key={batch.id}
                    className="glass-card batch-card"
                    onClick={() => handleBatchClick(batch)}
                    style={{ cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                        <div className="batch-icon-placeholder">
                            <FiUsers size={20} color="white" />
                        </div>
                        <div className={`status-badge ${batch.collected >= 80 ? 'paid' : batch.collected >= 40 ? 'pending' : 'overdue'}`}>
                            {batch.collected}% Collected
                        </div>
                    </div>

                    <h3 style={{ margin: '0 0 4px 0', fontSize: 16 }}>{batch.name}</h3>
                    <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)' }}>{batch.course}</p>

                    <div style={{ marginTop: 20, display: 'flex', gap: 16, fontSize: 13, color: 'var(--text-secondary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <FiCalendar size={14} /> {batch.year}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <FiUsers size={14} /> {batch.students} Students
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ marginTop: 16, height: 4, background: '#e2e8f0', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ width: `${batch.collected}%`, background: 'var(--primary-gradient)', height: '100%' }}></div>
                    </div>
                </div>
            ))}
        </motion.div>
    );

    const StudentListView = () => (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
        >
            {/* Header / Toolbar */}
            <div className="glass-card" style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <button className="btn-icon" onClick={handleBack}><FiArrowLeft /></button>
                    <div>
                        <h3 style={{ margin: 0, fontSize: 18 }}>{selectedBatch.name}</h3>
                        <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{selectedBatch.course} • {selectedBatch.year}</div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.5)', padding: '6px 12px', borderRadius: 8, border: '1px solid var(--glass-border)' }}>
                        <FiSearch color="var(--text-secondary)" />
                        <input placeholder="Search student..." style={{ background: 'transparent', border: 'none', marginLeft: 8, outline: 'none', fontSize: 13 }} />
                    </div>
                    <button className="btn-icon"><FiFilter /></button>
                    <button className="btn-primary" style={{ fontSize: 13 }}>Allocate Fee</button>
                </div>
            </div>

            {/* List */}
            <div className="glass-card table-container">
                <table className="premium-table">
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            <th>Roll No</th>
                            <th>Status</th>
                            <th>Total Fee</th>
                            <th>Paid</th>
                            <th>Due</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {STUDENTS_DATA.map(student => (
                            <tr key={student.id} onClick={() => handleStudentClick(student)} style={{ cursor: 'pointer' }}>
                                <td style={{ fontWeight: 600 }}>{student.name}</td>
                                <td style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{student.roll}</td>
                                <td>
                                    <span className={`status-badge ${student.status.toLowerCase() === 'paid' ? 'paid' : student.status.toLowerCase() === 'pending' ? 'pending' : 'overdue'}`}>
                                        {student.status}
                                    </span>
                                </td>
                                <td>₹{student.total.toLocaleString()}</td>
                                <td style={{ color: '#059669' }}>₹{student.paid.toLocaleString()}</td>
                                <td style={{ color: student.due > 0 ? '#dc2626' : 'var(--text-secondary)', fontWeight: student.due > 0 ? 700 : 400 }}>
                                    {student.due > 0 ? `₹${student.due.toLocaleString()}` : '-'}
                                </td>
                                <td>
                                    <button className="btn-icon" style={{ width: 28, height: 28 }}><FiChevronRight /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );

    const StudentDetailView = () => (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}
        >
            {/* Main Info */}
            <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <button className="btn-icon" onClick={handleBack}><FiArrowLeft /></button>
                        <div>
                            <h2 style={{ margin: 0, fontSize: 20 }}>{selectedStudent.name}</h2>
                            <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{selectedStudent.roll} • {selectedBatch.course}</div>
                        </div>
                    </div>
                    <div className={`status-badge ${selectedStudent.status.toLowerCase() == 'paid' ? 'paid' : 'pending'}`} style={{ fontSize: 14, padding: '6px 16px' }}>
                        {selectedStudent.status} Account
                    </div>
                </div>

                <div style={{ padding: 24 }}>
                    <h4 style={{ marginTop: 0 }}>Fee Breakdown</h4>
                    <div className="invoice-preview" style={{ boxShadow: 'none', border: '1px solid #e2e8f0', padding: 24 }}>
                        <div className="invoice-row">
                            <span>Tuition Fee (Year 1)</span>
                            <span>₹40,000</span>
                        </div>
                        <div className="invoice-row">
                            <span>Registration</span>
                            <span>₹5,000</span>
                        </div>
                        <div className="invoice-row" style={{ color: '#059669' }}>
                            <span>Scholarship Discount</span>
                            <span>- ₹2,000</span>
                        </div>
                        <div className="invoice-total">
                            <span>Net Payable</span>
                            <span>₹43,000</span>
                        </div>
                    </div>

                    <h4 style={{ marginBottom: 12 }}>Payment History</h4>
                    <table className="premium-table" style={{ fontSize: 13 }}>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Mode</th>
                                <th>Ref ID</th>
                                <th>Amount</th>
                                <th>Receipt</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>2025-01-10</td>
                                <td>UPI</td>
                                <td>TXN-883920</td>
                                <td>₹20,000</td>
                                <td><FiDownload style={{ cursor: 'pointer', color: '#6366f1' }} /></td>
                            </tr>
                            <tr>
                                <td>2024-12-15</td>
                                <td>Bank Transfer</td>
                                <td>TXN-112344</td>
                                <td>₹10,000</td>
                                <td><FiDownload style={{ cursor: 'pointer', color: '#6366f1' }} /></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Actions Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div className="glass-card">
                    <h3 style={{ margin: '0 0 16px 0', fontSize: 16 }}>Quick Actions</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <button className="btn-primary" style={{ justifyContent: 'center' }}>
                            <FiCreditCard /> Record Payment
                        </button>
                        <button className="btn-icon" style={{ width: '100%', justifyContent: 'center', gap: 8 }}>
                            <FiDownload /> Download Statement
                        </button>
                        <button className="btn-icon" style={{ width: '100%', justifyContent: 'center', gap: 8, color: '#dc2626', borderColor: '#fecaca' }}>
                            <FiAlertCircle /> Send Reminder
                        </button>
                    </div>
                </div>

                <div className="glass-card">
                    <h3 style={{ margin: '0 0 16px 0', fontSize: 16 }}>Pending Dues</h3>
                    <div style={{ fontSize: 32, fontWeight: 700, color: '#dc2626' }}>
                        ₹{selectedStudent.due.toLocaleString()}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
                        Due by Jan 30, 2026
                    </div>
                </div>
            </div>
        </motion.div>
    );

    return (
        <AnimatePresence mode="wait">
            {view === 'grid' && <BatchGrid key="grid" />}
            {view === 'list' && <StudentListView key="list" />}
            {view === 'detail' && <StudentDetailView key="detail" />}
        </AnimatePresence>
    );
};

export default FeeBatches;
