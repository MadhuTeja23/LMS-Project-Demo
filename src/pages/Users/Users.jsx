import React, { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import './Users.css';

// Sub-modules
import UserList from './tabs/UserList';
import InstructorRequests from './tabs/InstructorRequests';
import UserActivityLogs from './tabs/UserActivityLogs';
import AddUserModal from './components/AddUserModal';

const Users = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Lift state up for shared data if needed, or keeping it local to tabs if independent
  // For now, UserList manages its own mock data since it's isolated in this demo.
  // However, for counts/badges in tabs, we might want some state here.
  // Simulating counts for demo:
  const [userCount] = useState(4);
  const [requestCount] = useState(2);

  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", role: "Student", status: "Active", joined: "2024-01-15" },
    { id: 2, name: "Sarah Smith", email: "sarah@example.com", role: "Instructor", status: "Active", joined: "2024-02-01" },
    { id: 3, name: "Michael Brown", email: "mike@example.com", role: "Admin", status: "Active", joined: "2023-11-20" },
    { id: 4, name: "Emma Wilson", email: "emma@example.com", role: "Student", status: "Inactive", joined: "2024-03-10" },
  ]);

  return (
    <div className="users-page">
      <header className="users-header">
        <div>
          <h1>User Management</h1>
          <p>Manage students, instructors, and system administrators.</p>
        </div>
        <button className="btn-add-user" onClick={() => setIsModalOpen(true)}>
          <FiPlus /> Add New User
        </button>
      </header>

      {/* TAB NAVIGATION */}
      <div className="users-tabs">
        <button className={`u-tab ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>
          All Users <span className="u-badge">{users.length}</span>
        </button>
        <button className={`u-tab ${activeTab === 'approvals' ? 'active' : ''}`} onClick={() => setActiveTab('approvals')}>
          Instructor Requests <span className="u-badge warning">{requestCount}</span>
        </button>
        <button className={`u-tab ${activeTab === 'logs' ? 'active' : ''}`} onClick={() => setActiveTab('logs')}>
          Activity Logs
        </button>
      </div>

      {/* CONTENT AREA */}
      <div className="users-content">
        {activeTab === 'all' && <UserList users={users} setUsers={setUsers} />}
        {activeTab === 'approvals' && <InstructorRequests />}
        {activeTab === 'logs' && <UserActivityLogs />}
      </div>

      {/* ADD USER MODAL */}
      {isModalOpen && <AddUserModal setIsModalOpen={setIsModalOpen} />}
    </div>
  );
};

export default Users;