import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ExamPaperView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [exam, setExam] = useState(null);

    useEffect(() => {
        const exams = JSON.parse(localStorage.getItem("exams")) || [];
        // Soft compare because id might be number or string
        const foundExam = exams.find(e => String(e.id) === String(id));
        setExam(foundExam);
    }, [id]);

    if (!exam) {
        return (
            <div className="container py-5 text-center">
                <h3 className="text-muted">Loading Exam Paper...</h3>
                <button className="btn btn-secondary mt-3" onClick={() => navigate('/exam/dashboard')}>
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="container py-5" style={{ fontFamily: "'Inter', sans-serif" }}>

            {/* Paper Container - styled to look like the referenced worksheet */}
            <div className="bg-white shadow-lg p-5 mx-auto" style={{ maxWidth: '850px', minHeight: '1000px', borderTop: '5px solid #287a9f' }}>

                {/* Header matching image style */}
                <div className="mb-5">
                    <h1 className="fw-bold mb-3" style={{ color: "#1f4e5f", fontSize: "2rem" }}>
                        {exam.title}
                    </h1>
                    <div className="d-flex align-items-center text-secondary small text-uppercase ls-1">
                        <span className="me-3 fw-bold">{exam.course}</span>
                        <span className="me-3">|</span>
                        <span className="me-3">{exam.questions.length} Questions</span>
                        <span className="me-3">|</span>
                        <span>{exam.duration} Mins</span>
                    </div>
                </div>

                {/* Questions Loop */}
                <div className="questions-section">
                    {exam.questions.map((q, index) => (
                        <div key={index} className="mb-4">
                            <div className="d-flex align-items-baseline">
                                <span className="fw-bold me-2" style={{ color: "#333", minWidth: "25px" }}>{index + 1}.</span>
                                <div className="flex-grow-1">
                                    <h6 className="fw-bold mb-2 text-dark" style={{ lineHeight: "1.5" }}>
                                        {q.question}
                                    </h6>

                                    {/* Question Image */}
                                    {q.image && (
                                        <div className="mb-3">
                                            <img
                                                src={q.image}
                                                alt={`Figure for Q${index + 1}`}
                                                className="img-fluid border rounded"
                                                style={{ maxHeight: '200px' }}
                                            />
                                        </div>
                                    )}

                                    {/* Options for Quiz */}
                                    {q.type === 'quiz' && q.options && (
                                        <div className="ps-0 mt-2">
                                            {q.options.map((opt, i) => (
                                                <div key={i} className="form-check mb-2">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name={`q${index}`}
                                                        id={`q${index}_opt${i}`}
                                                        disabled
                                                        style={{ borderColor: "#adb5bd" }}
                                                    />
                                                    <label className="form-check-label text-secondary" htmlFor={`q${index}_opt${i}`}>
                                                        {opt}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Space for Written Answers */}
                                    {(q.type === 'short' || q.type === 'long') && (
                                        <div className="border-bottom border-secondary border-opacity-25 mt-4 mb-2" style={{ height: q.type === 'short' ? '40px' : '100px' }}></div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="text-center border-top pt-4 mt-5">
                    <p className="text-muted small mb-0">
                        Course: {exam.course} &bull; Total Marks: {exam.totalMarks}
                    </p>
                </div>

            </div>

            {/* Action Buttons (Non-printable area) */}
            <div className="text-center mt-4 no-print">
                <button className="btn btn-primary me-2 shadow-sm" onClick={() => window.print()}>
                    <i className="bi bi-printer me-2"></i> Print Paper
                </button>
                <button className="btn btn-outline-secondary" onClick={() => navigate('/exam/dashboard')}>
                    Back to Dashboard
                </button>
            </div>

            <style>
                {`
            @media print {
                .no-print { display: none !important; }
                body { background: white; }
                .shadow-lg { box-shadow: none !important; }
                .container { padding: 0 !important; max-width: 100% !important; }
            }
        `}
            </style>
        </div>
    );
};

export default ExamPaperView;
