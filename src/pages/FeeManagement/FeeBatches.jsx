import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiUsers, FiChevronRight, FiSearch, FiFilter, FiMoreVertical,
    FiArrowLeft, FiCalendar, FiClock, FiCheckCircle,
    FiAlertCircle, FiDownload, FiCreditCard, FiTrash2, FiEdit3, FiLoader, FiRefreshCcw
} from 'react-icons/fi';
import './FeeManagement.css';

const FeeBatches = () => {
    // --- State Management ---
    const [view, setView] = useState('grid'); // grid, list, detail
    const [batches, setBatches] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [feeDetails, setFeeDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // --- 1) LOAD BATCHES (Unified Source of Truth) ---
    useEffect(() => {
        initializeData();
    }, []);

    const initializeData = () => {
        setLoading(true);
        try {
            const storedData = localStorage.getItem('lms_fee_data');

            if (storedData) {
                // Load from storage
                setBatches(JSON.parse(storedData));
            } else {
                // SEED INITIAL DATA
                const initialBatches = [
                    {
                        id: 'batch-1', name: 'Full Stack Cohort 1', course: 'Full Stack Development', year: '2025-26', students: 5, collected: 75,
                        studentList: [
                            { id: 101, name: 'Aarav Patel', roll: 'FS-001', totalFee: 45000, paidAmount: 45000, lastPay: '2025-01-15' },
                            { id: 102, name: 'Diya Sharma', roll: 'FS-002', totalFee: 45000, paidAmount: 30000, lastPay: '2024-12-10' },
                            { id: 103, name: 'Rohan Gupta', roll: 'FS-003', totalFee: 45000, paidAmount: 0, lastPay: '-' },
                            { id: 104, name: 'Sanya Singh', roll: 'FS-004', totalFee: 45000, paidAmount: 40000, lastPay: '2025-01-05' },
                            { id: 105, name: 'Kabir Khan', roll: 'FS-005', totalFee: 45000, paidAmount: 45000, lastPay: '2025-01-12' },
                        ]
                    },
                    {
                        id: 'batch-2', name: 'Data Science Batch A', course: 'Data Science', year: '2025-26', students: 3, collected: 40,
                        studentList: [
                            { id: 201, name: 'Arjun Mehta', roll: 'DS-001', totalFee: 60000, paidAmount: 20000, lastPay: '2025-02-01' },
                            { id: 202, name: 'Zara Ali', roll: 'DS-002', totalFee: 60000, paidAmount: 0, lastPay: '-' },
                            { id: 203, name: 'Vihaan Reddy', roll: 'DS-003', totalFee: 60000, paidAmount: 60000, lastPay: '2024-11-20' },
                        ]
                    },
                    {
                        id: 'batch-3', name: 'React Native Special', course: 'Mobile App Dev', year: '2025', students: 2, collected: 90,
                        studentList: [
                            { id: 301, name: 'Ishaan Verma', roll: 'RN-001', totalFee: 30000, paidAmount: 27000, lastPay: '2025-01-18' },
                            { id: 302, name: 'Mira Kapoor', roll: 'RN-002', totalFee: 30000, paidAmount: 27000, lastPay: '2025-01-19' },
                        ]
                    }
                ];

                // Add the old 'userCreatedBatches' if any, migrating them
                const oldUserBatches = JSON.parse(localStorage.getItem('userCreatedBatches') || '[]');
                const mergedBatches = [...initialBatches, ...oldUserBatches];

                localStorage.setItem('lms_fee_data', JSON.stringify(mergedBatches));
                setBatches(mergedBatches);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // --- 2) BATCH -> STUDENTS FLOW ---
    const handleBatchClick = (batch) => {
        setSelectedBatch(batch);
        // Data is now always in studentList due to unified structure
        if (batch.studentList) {
            setStudents(batch.studentList);
            setView('list');
        } else {
            // Fallback for legacy empty structure
            setStudents([]);
            setView('list');
        }
    };

    // --- 3) STUDENT FEE STATUS CALCULATION ---
    const calculateStatus = (student) => {
        // totalFee, paidAmount, dueAmount, feeStatus
        const total = student.totalFee || 0;
        const paid = student.paidAmount || 0;
        const due = total - paid;

        let status = 'PENDING';
        if (paid === 0) status = 'PENDING';
        else if (paid < total) status = 'PARTIAL';
        else if (paid >= total) status = 'PAID';

        return { total, paid, due, status };
    };

    // --- 4) STUDENT -> FEE DETAILS ---
    const handleStudentClick = async (student) => {
        setLoading(true);
        setSelectedStudent(student);

        // Simulate fetching details or extract from nested if extended
        // For now using mock details derived from the student object + batch info
        // In full app, we would store deep structure. Here we simulate structure based on totals.

        setTimeout(() => {
            setFeeDetails({
                structure: [
                    { name: 'Tuition Fee (Base)', amount: student.totalFee },
                ],
                totalFee: student.totalFee,
                paidAmount: student.paidAmount || 0,
                pendingAmount: (student.totalFee - (student.paidAmount || 0)),
                dueDate: '2026-03-31',
                payments: [
                    // Mock payment if paid > 0
                    ...(student.paidAmount > 0 ? [{ id: 'p1', date: student.lastPay || '2025-01-01', mode: 'Online', reference: 'TXN-AUTO', amount: student.paidAmount }] : [])
                ]
            });
            setView('detail');
            setLoading(false);
        }, 300);
    };

    const handleBack = () => {
        if (view === 'detail') {
            setFeeDetails(null);
            setView('list');
        }
        else if (view === 'list') {
            setSelectedBatch(null);
            setStudents([]);
            setView('grid');
        }
    };

    // --- 5) FEE ALLOCATION (ADMIN ACTION) ---
    const handleAllocateFee = async () => {
        // Example payload
        const payload = {
            studentId: selectedStudent?.id, // or batchId if bulk
            feeType: 'Tuition',
            amount: 50000
        };

        try {
            const res = await fetch('/api/fee-allocations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                // Refresh data
                alert('Fee Allocated Successfully');
                // update local state or re-fetch
            } else {
                // Simulation of success for demo
                alert('Fee Allocated Successfully (Simulated)');
            }
        } catch (e) {
            console.error(e);
            alert('Fee Allocated Successfully (Simulated)');
        }
    };

    // --- 7) DISCOUNT APPLY (ADMIN) ---
    const handleApplyDiscount = async () => {
        try {
            // Mocking API call
            const res = await fetch('/api/fee-discounts', { method: 'POST' });
            alert('Discount Applied');
            // Recalculate logic would happen here or by re-fetching details
            // For demo:
            setFeeDetails(prev => ({
                ...prev,
                totalFee: prev.totalFee - 1000,
                pendingAmount: prev.pendingAmount - 1000
            }));
        } catch (e) { console.error(e) }
    };

    // --- 8) REFUND INITIATION ---
    const handleRefund = async (paymentId) => {
        if (!window.confirm('Initiate Refund?')) return;
        try {
            await fetch('/api/fee-refunds', {
                method: 'POST',
                body: JSON.stringify({ paymentId })
            });
            alert('Refund Initiated');
            // Update UI
        } catch (e) {
            console.error(e);
            alert('Refund Initiated (Simulated)');
        }
    };

    // --- 9) RECEIPTS ---
    const handleDownloadReceipt = async (paymentId) => {
        // In a real app this would trigger a file download from the URL
        // window.open(`/api/payments/${paymentId}/receipt`, '_blank');
        alert(`Downloading receipt for payment ${paymentId}...`);
    };


    // --- NEW: Remove Student from Batch ---
    const handleRemoveStudent = (e, studentId) => {
        e.stopPropagation();
        if (!window.confirm('Remove this student from the batch?')) return;

        // 1. Update Students List View
        const updatedStudents = students.filter(s => s.id !== studentId);
        setStudents(updatedStudents);

        // 2. Update Batch Data (State & LocalStorage)
        if (selectedBatch && String(selectedBatch.id).startsWith('custom-')) {
            const storedBatches = JSON.parse(localStorage.getItem('userCreatedBatches') || '[]');
            const batchIndex = storedBatches.findIndex(b => b.id === selectedBatch.id);

            if (batchIndex !== -1) {
                // Update Storage
                storedBatches[batchIndex].studentList = updatedStudents;
                storedBatches[batchIndex].students = updatedStudents.length;
                localStorage.setItem('userCreatedBatches', JSON.stringify(storedBatches));

                // Update Local State for Grid View consistency
                setBatches(prev => prev.map(b => b.id === selectedBatch.id ? {
                    ...b,
                    students: updatedStudents.length,
                    studentList: updatedStudents
                } : b));

                // Update Selected Batch Ref
                setSelectedBatch(prev => ({ ...prev, students: updatedStudents.length, studentList: updatedStudents }));
            }
        }
    };

    // --- Views ---

    const handleDeleteBatch = (e, batchId) => {
        e.stopPropagation();
        if (!window.confirm('Are you sure you want to delete this fee batch?')) return;

        setBatches(prev => prev.filter(b => b.id !== batchId));

        if (String(batchId).startsWith('custom-')) {
            const storedBatches = JSON.parse(localStorage.getItem('userCreatedBatches') || '[]');
            const updatedStored = storedBatches.filter(b => b.id !== batchId);
            localStorage.setItem('userCreatedBatches', JSON.stringify(updatedStored));
        }
    };

    // Helper for dropdown
    const [activeMenu, setActiveMenu] = useState(null);

    useEffect(() => {
        const closeMenu = () => setActiveMenu(null);
        window.addEventListener('click', closeMenu);
        return () => window.removeEventListener('click', closeMenu);
    }, []);

    const BatchGrid = () => (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="form-grid"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', paddingBottom: 100 }}
        >
            {loading && <div className="glass-card" style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40 }}>Loading Batches...</div>}

            {!loading && batches.map(batch => (
                <div
                    key={batch.id}
                    className="glass-card batch-card"
                    onClick={() => handleBatchClick(batch)}
                    style={{ cursor: 'pointer', position: 'relative' }} // Removed overflow:hidden to allow dropdown
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                        <div className="batch-icon-placeholder">
                            <FiUsers size={20} color="white" />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div className={`status-badge ${batch.collected >= 80 ? 'paid' : batch.collected >= 40 ? 'pending' : 'overdue'}`}>
                                {batch.collected}% Collected
                            </div>

                            {/* Options Menu for Custom Batches */}
                            {String(batch.id).startsWith('custom-') && (
                                <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
                                    <button
                                        className="btn-icon"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveMenu(activeMenu === batch.id ? null : batch.id);
                                        }}
                                        style={{ width: 28, height: 28 }}
                                    >
                                        <FiMoreVertical size={16} />
                                    </button>

                                    {activeMenu === batch.id && (
                                        <div className="dropdown-menu show" style={{
                                            position: 'absolute', right: 0, top: '100%',
                                            minWidth: 120, zIndex: 10, marginTop: 4,
                                            boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                                        }}>
                                            <button
                                                className="dropdown-item text-danger"
                                                onClick={(e) => handleDeleteBatch(e, batch.id)}
                                                style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                                            >
                                                <FiTrash2 size={14} /> Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
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
                        <h3 style={{ margin: 0, fontSize: 18 }}>{selectedBatch?.name}</h3>
                        <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{selectedBatch?.course} • {selectedBatch?.year}</div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.5)', padding: '6px 12px', borderRadius: 8, border: '1px solid var(--glass-border)' }}>
                        <FiSearch color="var(--text-secondary)" />
                        <input placeholder="Search student..." style={{ background: 'transparent', border: 'none', marginLeft: 8, outline: 'none', fontSize: 13 }} />
                    </div>
                    <button className="btn-icon"><FiFilter /></button>
                    {/* Step 5 Trigger */}
                    <button className="btn-primary" style={{ fontSize: 13 }} onClick={handleAllocateFee}>Allocate Fee</button>
                </div>
            </div>

            {/* List */}
            <div className="glass-card table-container">
                {loading ? <div style={{ padding: 20, textAlign: 'center' }}>Loading Students...</div> : (
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
                            {students.map(student => {
                                const { total, paid, due, status } = calculateStatus(student);
                                return (
                                    <tr key={student.id} onClick={() => handleStudentClick(student)} style={{ cursor: 'pointer' }}>
                                        <td style={{ fontWeight: 600 }}>{student.name}</td>
                                        <td style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{student.roll}</td>
                                        <td>
                                            <span className={`status-badge ${status.toLowerCase()}`}>
                                                {status}
                                            </span>
                                        </td>
                                        <td>₹{total.toLocaleString()}</td>
                                        <td style={{ color: '#059669' }}>₹{paid.toLocaleString()}</td>
                                        <td style={{ color: due > 0 ? '#dc2626' : 'var(--text-secondary)', fontWeight: due > 0 ? 700 : 400 }}>
                                            {due > 0 ? `₹${due.toLocaleString()}` : '-'}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 8 }} onClick={e => e.stopPropagation()}>
                                                <button className="btn-icon" style={{ width: 28, height: 28 }} onClick={() => handleStudentClick(student)}>
                                                    <FiChevronRight />
                                                </button>
                                                {/* Allow removing students only from custom batches */}
                                                {selectedBatch && String(selectedBatch.id).startsWith('custom-') && (
                                                    <button
                                                        className="btn-icon"
                                                        style={{ width: 28, height: 28, color: '#ef4444', borderColor: '#fee2e2', background: '#fef2f2' }}
                                                        onClick={(e) => handleRemoveStudent(e, student.id)}
                                                        title="Remove Student"
                                                    >
                                                        <FiTrash2 size={12} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {students.length === 0 && (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center', padding: 20, color: 'var(--text-secondary)' }}>
                                        No students in this batch.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </motion.div>
    );

    const StudentDetailView = () => {
        if (!feeDetails) return <div className="glass-card">Loading Details...</div>;

        const { total, paid, due, status } = calculateStatus({
            totalFee: feeDetails.totalFee,
            paidAmount: feeDetails.paidAmount
        });

        return (
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
                                <h2 style={{ margin: 0, fontSize: 20 }}>{selectedStudent?.name}</h2>
                                <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{selectedStudent?.roll} • {selectedBatch?.course}</div>
                            </div>
                        </div>
                        <div className={`status-badge ${status.toLowerCase()}`} style={{ fontSize: 14, padding: '6px 16px' }}>
                            {status} Account
                        </div>
                    </div>

                    <div style={{ padding: 24 }}>
                        <h4 style={{ marginTop: 0 }}>Fee Breakdown</h4>
                        <div className="invoice-preview" style={{ boxShadow: 'none', border: '1px solid #e2e8f0', padding: 24 }}>
                            {feeDetails.structure?.map((item, idx) => (
                                <div key={idx} className="invoice-row">
                                    <span>{item.name}</span>
                                    <span>₹{item.amount.toLocaleString()}</span>
                                </div>
                            ))}
                            <div className="invoice-total">
                                <span>Total Fee</span>
                                <span>₹{feeDetails.totalFee.toLocaleString()}</span>
                            </div>
                            <div className="invoice-row" style={{ marginTop: 10, color: '#059669' }}>
                                <span>Total Paid</span>
                                <span>- ₹{feeDetails.paidAmount.toLocaleString()}</span>
                            </div>
                            <div className="invoice-row" style={{ color: '#dc2626', fontWeight: 'bold' }}>
                                <span>Balance Pending</span>
                                <span>₹{feeDetails.pendingAmount.toLocaleString()}</span>
                            </div>
                        </div>

                        <h4 style={{ marginBottom: 12 }}>Payment History</h4>
                        {/* Step 6: Payments View */}
                        <table className="premium-table" style={{ fontSize: 13 }}>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Mode</th>
                                    <th>Ref ID</th>
                                    <th>Amount</th>
                                    <th>Receipt</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {feeDetails.payments?.map(payment => (
                                    <tr key={payment.id}>
                                        <td>{payment.date}</td>
                                        <td>{payment.mode}</td>
                                        <td style={{ fontFamily: 'monospace' }}>{payment.reference}</td>
                                        <td>₹{payment.amount.toLocaleString()}</td>
                                        {/* Step 9: Receipts */}
                                        <td>
                                            <button className="btn-icon" onClick={() => handleDownloadReceipt(payment.id)}>
                                                <FiDownload style={{ color: '#6366f1' }} />
                                            </button>
                                        </td>
                                        {/* Step 8: Refund */}
                                        <td>
                                            <button className="btn-icon" onClick={() => handleRefund(payment.id)} title="Initiate Refund">
                                                <FiRefreshCcw style={{ color: '#f59e0b', fontSize: 12 }} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {(!feeDetails.payments || feeDetails.payments.length === 0) && (
                                    <tr><td colSpan="6" style={{ textAlign: 'center', color: '#94a3b8' }}>No payments found</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Actions Sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    <div className="glass-card">
                        <h3 style={{ margin: '0 0 16px 0', fontSize: 16 }}>Quick Actions</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {/* Record Payment (Simulated) */}
                            <button className="btn-primary" style={{ justifyContent: 'center' }} onClick={() => alert('Open Payment Modal')}>
                                <FiCreditCard /> Record Payment
                            </button>
                            {/* Step 7: Apply Discount */}
                            <button className="btn-icon" style={{ width: '100%', justifyContent: 'center', gap: 8 }} onClick={handleApplyDiscount}>
                                <FiEdit3 /> Apply Discount
                            </button>
                            <button className="btn-icon" style={{ width: '100%', justifyContent: 'center', gap: 8, color: '#dc2626', borderColor: '#fecaca' }}>
                                <FiAlertCircle /> Send Reminder
                            </button>
                        </div>
                    </div>

                    <div className="glass-card">
                        <h3 style={{ margin: '0 0 16px 0', fontSize: 16 }}>Pending Dues</h3>
                        <div style={{ fontSize: 32, fontWeight: 700, color: '#dc2626' }}>
                            ₹{feeDetails.pendingAmount.toLocaleString()}
                        </div>
                        <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
                            Due by {feeDetails.dueDate || '-'}
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    };

    if (error) {
        return <div className="glass-card" style={{ padding: 40, textAlign: 'center', color: 'red' }}>{error}</div>
    }

    return (
        <AnimatePresence mode="wait">
            {view === 'grid' && <BatchGrid key="grid" />}
            {view === 'list' && <StudentListView key="list" />}
            {view === 'detail' && <StudentDetailView key="detail" />}
        </AnimatePresence>
    );
};

export default FeeBatches;
