import React, { useState } from 'react';
import { FiSearch, FiEdit2, FiTrash2 } from 'react-icons/fi';

const UserList = ({ users, setUsers }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            setUsers(users.filter(u => u.id !== id));
        }
    };

    return (
        <>
            <div className="users-controls">
                <div className="search-box">
                    <FiSearch />
                    <input
                        type="text"
                        placeholder="Search by name, email or role..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filter-box">
                    <select>
                        <option>All Roles</option>
                        <option>Student</option>
                        <option>Instructor</option>
                        <option>Admin</option>
                    </select>
                    <select>
                        <option>All Status</option>
                        <option>Active</option>
                        <option>Inactive</option>
                    </select>
                </div>
            </div>

            <div className="users-table-container">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Contact Info</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Joined Date</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase())).map(user => (
                            <tr key={user.id}>
                                <td>
                                    <div className="user-profile-cell">
                                        <div className="user-avatar" style={{ background: '#cbd5e1' }}>
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="u-name">{user.name}</div>
                                            <div className="u-id">ID: #{user.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="u-email">{user.email}</div>
                                </td>
                                <td>
                                    <span className={`role-badge ${user.role.toLowerCase()}`}>{user.role}</span>
                                </td>
                                <td>
                                    <span className={`status-dot ${user.status.toLowerCase()}`}></span> {user.status}
                                </td>
                                <td style={{ color: '#64748b', fontSize: 13 }}>{user.joined}</td>
                                <td style={{ textAlign: 'right' }}>
                                    <button className="icon-btn" title="Edit"><FiEdit2 /></button>
                                    <button className="icon-btn delete" onClick={() => handleDelete(user.id)} title="Delete"><FiTrash2 /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default UserList;
