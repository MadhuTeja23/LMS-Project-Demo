import { useState, useMemo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import QuestionForm from "../components/QuestionForm";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Internal Sub-component for Mixed Type Management
const MixedQuestionManager = ({ onAdd }) => {
  const [activeTab, setActiveTab] = useState("quiz");

  return (
    <div>
      <div className="px-4 pt-4 pb-2">
        <div className="d-grid gap-2 d-md-flex justify-content-center bg-light p-1 rounded-pill border">
          <button
            className={`btn btn-sm rounded-pill px-3 fw-bold transition-all ${activeTab === 'quiz' ? 'btn-white shadow-sm text-primary' : 'text-muted border-0'}`}
            onClick={() => setActiveTab('quiz')}
          >
            Quiz
          </button>
          <button
            className={`btn btn-sm rounded-pill px-3 fw-bold transition-all ${activeTab === 'short' ? 'btn-white shadow-sm text-primary' : 'text-muted border-0'}`}
            onClick={() => setActiveTab('short')}
          >
            Short
          </button>
          <button
            className={`btn btn-sm rounded-pill px-3 fw-bold transition-all ${activeTab === 'long' ? 'btn-white shadow-sm text-primary' : 'text-muted border-0'}`}
            onClick={() => setActiveTab('long')}
          >
            Long
          </button>
        </div>
      </div>

      <div className="animate-fade-in">
        <div key={activeTab}>
          <QuestionForm type={activeTab} onAdd={onAdd} />
        </div>
      </div>
    </div>
  );
};

const CreateExam = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get ID from URL if present
  const isEditMode = !!id;

  const [examType, setExamType] = useState("mixed"); // Default to mixed for flexibility
  const [questions, setQuestions] = useState([]);

  // Form State
  const [examName, setExamName] = useState("");
  const [course, setCourse] = useState("");
  const [totalMarks, setTotalMarks] = useState(100);
  const [duration, setDuration] = useState(60);

  // Advanced Settings State
  const [settings, setSettings] = useState({
    maxAttempts: "1",
    gradingStrategy: "highest",
    cooldownPeriod: "0",
    allowReattemptCondition: "always",
    randomizeQuestions: true
  });

  const updateSettings = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // Load data if in Edit Mode
  useEffect(() => {
    if (isEditMode) {
      const savedExams = JSON.parse(localStorage.getItem("exams") || "[]");
      const examToEdit = savedExams.find(e => e.id.toString() === id);

      if (examToEdit) {
        setExamName(examToEdit.title);
        setCourse(examToEdit.course);
        setExamType(examToEdit.type);
        setTotalMarks(examToEdit.targetMarks || 100);
        setDuration(examToEdit.duration);
        setQuestions(examToEdit.questions || []);

        // Load settings if they exist, otherwise use defaults
        if (examToEdit.settings) {
          setSettings(examToEdit.settings);
        }
      } else {
        toast.error("Exam not found!");
        navigate("/exam/dashboard");
      }
    }
  }, [id, isEditMode, navigate]);

  const currentTotalMarks = useMemo(() => {
    return questions.reduce((acc, q) => acc + (q.marks || 0), 0);
  }, [questions]);

  const addQuestion = (question) => {
    setQuestions((prev) => [...prev, question]);
    toast.success("Question added!", { autoClose: 1000, position: "bottom-right" });
  };

  const handleSave = () => {
    if (!examName || !course) {
      toast.error("Please fill in the Exam Name and Course.");
      return;
    }

    if (questions.length === 0) {
      toast.warn("Please add at least one question.");
      return;
    }

    const examData = {
      id: isEditMode ? parseInt(id) : Date.now(),
      title: examName,
      course: course,
      type: examType,
      totalMarks: currentTotalMarks,
      targetMarks: totalMarks,
      duration: duration,
      questions: questions,
      settings: settings, // Save reattempt policies
      dateCreated: isEditMode ? new Date().toISOString() : new Date().toISOString() // Optionally keep original date if preferred
    };

    // Save to LocalStorage
    const existingExams = JSON.parse(localStorage.getItem("exams")) || [];

    let updatedExams;
    if (isEditMode) {
      updatedExams = existingExams.map(e => e.id.toString() === id ? { ...e, ...examData, dateCreated: e.dateCreated } : e); // Keep original dateCreated on edit
    } else {
      updatedExams = [...existingExams, examData];
    }

    localStorage.setItem("exams", JSON.stringify(updatedExams));

    toast.success(isEditMode ? "Exam updated successfully!" : "Exam created successfully! Redirecting...");

    // Redirect to View Paper
    setTimeout(() => {
      navigate(`/exam/view-paper/${examData.id}`);
    }, 1500);
  };

  return (
    <div className="container-fluid min-vh-100" style={{
      background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      fontFamily: "'Inter', sans-serif",
      paddingTop: "80px"
    }}>
      <ToastContainer />

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">

            {/* Main Card */}
            <div className="card border-0 shadow-lg overflow-hidden" style={{
              borderRadius: "20px",
              background: "rgba(255, 255, 255, 0.85)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.3)"
            }}>

              {/* Header */}
              <div className="card-header bg-transparent border-0 pt-4 pb-2 px-3 px-md-5">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                  <div className="text-center text-md-start">
                    <h2 className="fw-bold mb-1" style={{ color: "#2d3748" }}>{isEditMode ? "Edit Exam" : "Create New Exam"}</h2>
                    <p className="text-muted mb-0">{isEditMode ? "Modify your assessment details below." : "Design a comprehensive assessment for your students."}</p>
                  </div>
                  <div className="text-end">
                    <span className="badge rounded-pill bg-primary px-3 py-2 fs-6 shadow-sm">
                      <i className="bi bi-layers me-2"></i>
                      {questions.length} Questions
                    </span>
                  </div>
                </div>
              </div>

              <div className="card-body px-3 px-md-5 pb-5">

                {/* Configuration Section */}
                <div className="p-4 rounded-4 mb-5" style={{ background: "rgba(255,255,255,0.6)", border: "1px solid rgba(0,0,0,0.05)" }}>
                  <h5 className="fw-bold mb-3 text-secondary text-uppercase small ls-1">Exam Details</h5>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-muted small">Exam Title</label>
                      <input
                        className="form-control form-control-lg border-0 bg-white shadow-sm"
                        value={examName}
                        onChange={(e) => setExamName(e.target.value)}
                        placeholder="e.g. Advanced Java Finals 2024"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-muted small">Course / Subject</label>
                      <input
                        className="form-control form-control-lg border-0 bg-white shadow-sm"
                        value={course}
                        onChange={(e) => setCourse(e.target.value)}
                        placeholder="e.g. CS-301 Data Structures"
                      />
                    </div>
                  </div>

                  <div className="row g-3 mt-2">
                    <div className="col-md-4">
                      <label className="form-label fw-semibold text-muted small">Format</label>
                      <select
                        className="form-select border-0 bg-white shadow-sm"
                        value={examType}
                        onChange={(e) => {
                          setExamType(e.target.value);
                          setQuestions([]); // Optional: reset if type strictness is needed
                        }}
                      >
                        <option value="mixed">Mixed Format (Flexible)</option>
                        <option value="quiz">Multiple Choice Only</option>
                        <option value="short">Short Answer Only</option>
                        <option value="long">Long Answer Only</option>
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-semibold text-muted small">Target Marks</label>
                      <div className="input-group shadow-sm rounded">
                        <input
                          type="number"
                          className="form-control border-0"
                          value={totalMarks}
                          onChange={(e) => setTotalMarks(e.target.value)}
                        />
                        <span className={`input-group-text border-0 ${currentTotalMarks > parseInt(totalMarks) ? 'bg-danger text-white' : 'bg-white text-muted'}`}>
                          Current: {currentTotalMarks}
                        </span>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-semibold text-muted small">Duration (Minutes)</label>
                      <input
                        type="number"
                        className="form-control border-0 bg-white shadow-sm"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Reattempt & Policy Settings */}
                {/* Reattempt & Policy Settings */}
                <div className="rounded-4 mb-5 card border-0 shadow-sm" style={{ background: "rgba(255,255,255,0.85)" }}>
                  <div className="card-header bg-transparent border-bottom-0 pt-4 px-4">
                    <h5 className="fw-bold mb-0 text-secondary text-uppercase small ls-1">
                      <i className="bi bi-gear-wide-connected me-2"></i>Reattempt & Policy Settings
                    </h5>
                  </div>
                  <div className="card-body px-4 pb-4">
                    <div className="row g-4">
                      {/* General Attempts Card */}
                      <div className="col-md-6">
                        <div className="card shadow-sm border-0 h-100 bg-light bg-opacity-50">
                          <div className="card-header bg-transparent border-bottom-0 pt-3 px-3">
                            <h6 className="fw-bold text-primary mb-0">
                              <i className="bi bi-arrow-repeat me-2"></i>Attempt Limits
                            </h6>
                          </div>
                          <div className="card-body px-3 pb-3">
                            <div className="mb-3">
                              <label className="form-label fw-bold small text-uppercase text-muted">Maximum Attempts Allowed</label>
                              <select
                                className="form-select border-0 bg-white shadow-sm"
                                value={settings.maxAttempts}
                                onChange={(e) => updateSettings('maxAttempts', e.target.value)}
                              >
                                <option value="1">No Reattempts (1 Attempt Total)</option>
                                <option value="2">2 Attempts</option>
                                <option value="3">3 Attempts</option>
                                <option value="5">5 Attempts</option>
                                <option value="unlimited">Unlimited Attempts</option>
                              </select>
                              <div className="form-text small">Default limit for new exams unless overridden.</div>
                            </div>

                            <div className="mb-0">
                              <label className="form-label fw-bold small text-uppercase text-muted">Grading Strategy</label>
                              <select
                                className="form-select border-0 bg-white shadow-sm"
                                value={settings.gradingStrategy}
                                onChange={(e) => updateSettings('gradingStrategy', e.target.value)}
                              >
                                <option value="highest">Highest Score (Best of all attempts)</option>
                                <option value="latest">Latest Score (Most recent attempt)</option>
                                <option value="average">Average Score (All attempts)</option>
                              </select>
                              <div className="form-text small">Determines which score appears on the final transcript.</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Restrictions & Timing Card */}
                      <div className="col-md-6">
                        <div className="card shadow-sm border-0 h-100 bg-light bg-opacity-50">
                          <div className="card-header bg-transparent border-bottom-0 pt-3 px-3">
                            <h6 className="fw-bold text-danger mb-0">
                              <i className="bi bi-hourglass-split me-2"></i>Scaling & Restrictions
                            </h6>
                          </div>
                          <div className="card-body px-3 pb-3">
                            <div className="mb-3">
                              <label className="form-label fw-bold small text-uppercase text-muted">Cooldown Period</label>
                              <select
                                className="form-select border-0 bg-white shadow-sm"
                                value={settings.cooldownPeriod}
                                onChange={(e) => updateSettings('cooldownPeriod', e.target.value)}
                              >
                                <option value="0">None (Immediate Reattempt)</option>
                                <option value="30">30 Minutes</option>
                                <option value="60">1 Hour</option>
                                <option value="1440">24 Hours</option>
                                <option value="10080">7 Days</option>
                              </select>
                              <div className="form-text small">Waiting time required between consecutive attempts.</div>
                            </div>

                            <div className="mb-0">
                              <label className="form-label fw-bold small text-uppercase text-muted">Eligibility Condition</label>
                              <select
                                className="form-select border-0 bg-white shadow-sm"
                                value={settings.allowReattemptCondition}
                                onChange={(e) => updateSettings('allowReattemptCondition', e.target.value)}
                              >
                                <option value="always">Always Allow (If attempts remain)</option>
                                <option value="failed_only">Only if Previous Attempt Failed</option>
                                <option value="below_70">Only if Score &lt; 70%</option>
                              </select>
                              <div className="form-text small">Prerequisites for unlocking a reattempt.</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Advanced Settings (Full Width) */}
                      <div className="col-12">
                        <div className="card shadow-sm border-0 bg-light bg-opacity-50">
                          <div className="card-body p-3 d-flex justify-content-between align-items-center flex-wrap gap-3">
                            <div>
                              <h6 className="fw-bold mb-1">Reset Question Pool?</h6>
                              <p className="text-muted small mb-0">Should reattempts receive a new set of randomized questions?</p>
                            </div>
                            <div className="form-check form-switch">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="randomizeQuestions"
                                checked={settings.randomizeQuestions}
                                onChange={(e) => updateSettings('randomizeQuestions', e.target.checked)}
                              />
                              <label className="form-check-label" htmlFor="randomizeQuestions">Randomize Questions</label>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

                <hr className="my-5 border-secondary opacity-10" />

                <div className="row">
                  {/* Left Column: Form */}
                  <div className="col-lg-5">
                    <div className="sticky-top" style={{ top: "100px", zIndex: 1 }}>
                      <h5 className="fw-bold mb-3">Add Question</h5>
                      <div className="card border-0 shadow-sm overflow-hidden" style={{ borderRadius: "15px" }}>
                        <div className="card-body p-0">
                          {/* Logic to show form based on type */}
                          {examType === "mixed" ? (
                            <MixedQuestionManager onAdd={addQuestion} />
                          ) : (
                            <div>
                              <QuestionForm type={examType} onAdd={addQuestion} />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Preview List */}
                  <div className="col-lg-7">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="fw-bold mb-0">Question Paper Preview</h5>
                      {questions.length > 0 && (
                        <button className="btn btn-sm btn-outline-danger" onClick={() => setQuestions([])}>
                          Clear All
                        </button>
                      )}
                    </div>

                    {questions.length === 0 ? (
                      <div className="text-center py-5 border rounded-4 border-dashed" style={{ background: "rgba(255,255,255,0.4)" }}>
                        <i className="bi bi-clipboard-plus text-muted display-4 opacity-25"></i>
                        <p className="text-muted mt-3">No questions added yet.<br />Start building your exam on the left.</p>
                      </div>
                    ) : (
                      <div className="vstack gap-3">
                        {questions.map((q, index) => (
                          <div key={index} className="card border-0 shadow-sm position-relative overflow-hidden group-hover-action">
                            <div className="card-body">
                              <div className="d-flex justify-content-between">
                                <span className="badge bg-light text-dark mb-2 border">Q{index + 1} &bull; {q.type.toUpperCase()}</span>
                                <span className="fw-bold text-primary">{q.marks} Marks</span>
                              </div>
                              <div className="d-flex flex-column flex-sm-row align-items-start gap-3">
                                <div className="flex-grow-1">
                                  <h6 className="card-title fw-bold text-dark">{q.question}</h6>
                                </div>
                                {q.image && (
                                  <div className="flex-shrink-0">
                                    <img src={q.image} alt="Ref" className="img-thumbnail" style={{ height: '100px', maxWidth: '150px', objectFit: 'contain' }} />
                                  </div>
                                )}
                              </div>

                              {q.type === 'quiz' && (
                                <ul className="list-unstyled small text-muted mb-0 ps-2 border-start border-3 border-light">
                                  {q.options.map((opt, i) => (
                                    <li key={i} className={i === parseInt(q.correctOption) ? "text-success fw-bold" : ""}>
                                      {i + 1}. {opt} {i === parseInt(q.correctOption) && <i className="bi bi-check-circle-fill ms-1"></i>}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>

                            <button
                              className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2"
                              onClick={() => setQuestions(questions.filter((_, i) => i !== index))}
                              title="Remove Question"
                            >
                              <i className="bi bi-x-lg"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mt-4 pt-3 border-top">
                      <button
                        className="btn btn-dark btn-lg w-100 fw-bold shadow-lg"
                        onClick={handleSave}
                        style={{ background: "linear-gradient(45deg, #111 0%, #333 100%)", border: "none" }}
                      >
                        <i className={`bi ${isEditMode ? 'bi-check-circle' : 'bi-rocket-takeoff'} me-2`}></i>
                        {isEditMode ? "Update Exam" : "Publish Exam"}
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateExam;
