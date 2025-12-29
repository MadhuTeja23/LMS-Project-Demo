import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="d-flex flex-column justify-content-center align-items-center bg-light" style={{ minHeight: '80vh' }}>
            <h1 className="display-1 fw-bold text-primary">404</h1>
            <p className="lead text-muted mb-4">Oops! The page you're looking for doesn't exist.</p>
            <Link to="/" className="btn btn-primary px-4 py-2 rounded-pill">
                <i className="bi bi-house-door me-2"></i>Go Home
            </Link>
        </div>
    );
};

export default NotFound;
