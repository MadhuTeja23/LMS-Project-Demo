import React, { useState } from 'react';
import { FiClock, FiAlertCircle } from 'react-icons/fi';

const UserActivityLogs = () => {
    const [activityLogs] = useState([
        { id: 1, user: "Michael Brown", action: "Updated Course Settings", ip: "192.168.1.1", time: "2 mins ago" },
        { id: 2, user: "Sarah Smith", action: "Published New Quiz", ip: "192.168.1.45", time: "1 hour ago" },
        { id: 3, user: "John Doe", action: "Failed Login Attempt", ip: "10.0.0.5", time: "3 hours ago" },
        { id: 4, user: "System", action: "Daily Backup Completed", ip: "Server", time: "5 hours ago" },
    ]);

    return (
        <div className="users-table-container">
            <table className="users-table">
                <thead>
                    <tr>
                        <th>Time</th>
                        <th>User</th>
                        <th>Action</th>
                        <th>IP Address</th>
                    </tr>
                </thead>
                <tbody>
                    {activityLogs.map(log => (
                        <tr key={log.id}>
                            <td style={{ color: '#64748b', fontSize: 13, width: 150 }}><FiClock style={{ marginRight: 6, verticalAlign: 'text-bottom' }} />{log.time}</td>
                            <td style={{ fontWeight: 500 }}>{log.user}</td>
                            <td>
                                {log.action.includes('Failed') ? (
                                    <span style={{ color: '#dc2626' }}><FiAlertCircle style={{ marginRight: 4, verticalAlign: 'text-bottom' }} /> {log.action}</span>
                                ) : (
                                    <span style={{ color: '#0f172a' }}>{log.action}</span>
                                )}
                            </td>
                            <td style={{ fontFamily: 'monospace', color: '#64748b' }}>{log.ip}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserActivityLogs;
