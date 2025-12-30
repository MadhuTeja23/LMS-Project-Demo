import React from 'react';

const AddUserModal = ({ setIsModalOpen }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>Add New User</h3>
                    <button className="close-btn" onClick={() => setIsModalOpen(false)}>&times;</button>
                </div>
                <div className="modal-body">
                    {/* Simplified Form */}
                    <div className="form-group">
                        <label>Full Name</label>
                        <input type="text" placeholder="e.g. John Doe" />
                    </div>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" placeholder="e.g. john@company.com" />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Role</label>
                            <select>
                                <option value="Student">Student</option>
                                <option value="Instructor">Instructor</option>
                                <option value="Admin">Administrator</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Status</label>
                            <select>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                    <button className="btn-submit" onClick={() => { setIsModalOpen(false); alert('User created!'); }}>Create User</button>
                </div>
            </div>
        </div>
    );
};

export default AddUserModal;
