import React from 'react';
import { Outlet } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";
import { FaCalendarAlt, FaChartBar, FaFileAlt, FaBars, FaTimes, FaBook, FaPlusCircle } from "react-icons/fa";

const ExamLayout = () => {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    const isActive = (path) => {
        return location.pathname.startsWith(path);
    };

    const navItems = [
        { path: "/exam/dashboard", label: "Dashboard", icon: <FaChartBar /> },
        { path: "/exam/create-exam", label: "Create Exam", icon: <FaPlusCircle /> },
        { path: "/exam/question-bank", label: "Question Bank", icon: <FaBook /> },
        { path: "/exam/schedule", label: "Schedule", icon: <FaCalendarAlt /> },
        { path: "/exam/reports", label: "Reports", icon: <FaFileAlt /> },
    ];

    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
            <header className="bg-white border-bottom shadow-sm sticky-top" style={{ zIndex: 1020 }}>
                <div className="container-fluid px-4">
                    <div className="d-flex align-items-center justify-content-between h-16" style={{ height: "64px" }}>
                        <div className="d-flex align-items-center gap-4">
                            <span className="fw-bold text-primary fs-4 tracking-tight">Exam Portal</span>
                            <nav className="d-none d-md-flex gap-1">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`px-3 py-2 rounded-pill text-decoration-none d-flex align-items-center gap-2 small fw-medium transition-all ${isActive(item.path)
                                            ? "bg-primary text-white shadow-sm"
                                            : "text-muted hover-bg-light"
                                            }`}
                                        style={{ transition: "all 0.2s ease" }}
                                    >
                                        {item.icon}
                                        {item.label}
                                    </Link>
                                ))}
                            </nav>
                        </div>

                        <div className="d-flex align-items-center gap-3">
                            <div
                                className="d-md-none text-muted p-2"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                style={{ cursor: "pointer" }}
                            >
                                {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="d-md-none bg-white border-top shadow-sm px-4 py-3">
                        <nav className="d-flex flex-column gap-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`px-3 py-2 rounded-3 text-decoration-none d-flex align-items-center gap-2 fw-medium ${isActive(item.path)
                                        ? "bg-primary text-white"
                                        : "text-muted hover-bg-light"
                                        }`}
                                >
                                    {item.icon}
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                )}
            </header>

            <main className="flex-grow-1">
                <Outlet />
            </main>

            <style>
                {`
                    .hover-bg-light:hover {
                        background-color: rgba(0,0,0,0.05);
                        color: #000;
                    }
                `}
            </style>
        </div>
    );
};

export default ExamLayout;
