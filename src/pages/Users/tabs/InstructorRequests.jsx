import React, { useState } from 'react';
import { FiUserCheck } from 'react-icons/fi';

const InstructorRequests = () => {
    const [pendingInstructors, setPendingInstructors] = useState([
        { id: 101, name: "David Miller", email: "david.teach@example.com", experience: "5 Years", specialty: "Web Development", date: "2024-03-22" },
        { id: 102, name: "Lisa Wong", email: "lisa.art@example.com", experience: "3 Years", specialty: "Digital Art", date: "2024-03-21" }
    ]);

    const handleApprove = (id) => {
        setPendingInstructors(pendingInstructors.filter(p => p.id !== id));
        alert("Instructor Approved");
    };

    return (
        <div className="users-table-container">
            {pendingInstructors.length > 0 ? (
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>Instructor Name</th>
                            <th>Specialty</th>
                            <th>Experience</th>
                            <th>Request Date</th>
                            <th style={{ textAlign: 'right' }}>Decision</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingInstructors.map(inst => (
                            <tr key={inst.id}>
                                <td>
                                    <div className="user-profile-cell">
                                        <div className="user-avatar" style={{ background: '#fef3c7', color: '#d97706' }}>
                                            {inst.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="u-name">{inst.name}</div>
                                            <div className="u-email">{inst.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>{inst.specialty}</td>
                                <td>{inst.experience}</td>
                                <td style={{ color: '#64748b', fontSize: 13 }}>{inst.date}</td>
                                <td style={{ textAlign: 'right' }}>
                                    <button className="btn-secondary" style={{ marginRight: 8, fontSize: 12 }} onClick={() => alert('View Details')}>View Profile</button>
                                    <button className="btn-primary" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => handleApprove(inst.id)}>Approve</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>
                    <FiUserCheck size={32} style={{ marginBottom: 16, opacity: 0.5 }} />
                    <p>No pending instructor requests.</p>
                </div>
            )}
        </div>
    );
};

export default InstructorRequests;
