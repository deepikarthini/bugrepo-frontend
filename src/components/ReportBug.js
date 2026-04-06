import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBugs } from '../context/BugContext';
import './ReportBug.css';

function ReportBug({ currentUser }) {
  const navigate = useNavigate();
  const { users, createBug } = useBugs();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    assignedTo: '',
    environment: '',
  });
  const [reproductionSteps, setReproductionSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [expectedResult, setExpectedResult] = useState('');
  const [actualResult, setActualResult] = useState('');

  useEffect(() => {
    detectEnvironment();
  }, []);

  const detectEnvironment = () => {
    const os = navigator.platform;
    const browser = getBrowserInfo();
    setFormData(prev => ({
      ...prev,
      environment: `${os} / ${browser.name} / v${browser.version}`
    }));
  };

  const getBrowserInfo = () => {
    const ua = navigator.userAgent;
    let browserName = 'Unknown';
    let browserVersion = 'Unknown';

    if (ua.indexOf('Chrome') > -1) {
      browserName = 'Chrome';
      browserVersion = ua.match(/Chrome\/(\d+)/)[1];
    } else if (ua.indexOf('Firefox') > -1) {
      browserName = 'Firefox';
      browserVersion = ua.match(/Firefox\/(\d+)/)[1];
    } else if (ua.indexOf('Safari') > -1) {
      browserName = 'Safari';
      browserVersion = ua.match(/Version\/(\d+)/)[1];
    } else if (ua.indexOf('Edge') > -1) {
      browserName = 'Edge';
      browserVersion = ua.match(/Edge\/(\d+)/)[1];
    }

    return { name: browserName, version: browserVersion };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const startRecording = () => {
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const addStep = () => {
    if (currentStep.trim()) {
      const newStep = {
        step: reproductionSteps.length + 1,
        description: currentStep,
        screenshot: null,
        expected: expectedResult || null,
        actual: actualResult || null
      };
      setReproductionSteps([...reproductionSteps, newStep]);
      setCurrentStep('');
      setExpectedResult('');
      setActualResult('');
    }
  };

  const removeStep = (index) => {
    const updatedSteps = reproductionSteps.filter((_, i) => i !== index);
    // Renumber steps
    const renumberedSteps = updatedSteps.map((step, i) => ({
      ...step,
      step: i + 1
    }));
    setReproductionSteps(renumberedSteps);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const bugData = {
      ...formData,
      reproductionSteps: reproductionSteps
    };

    try {
      const newBug = createBug(bugData);
      alert('Bug reported successfully!');
      navigate(`/bug/${newBug.id}`);
    } catch (error) {
      console.error('Error creating bug:', error);
      alert('Failed to report bug. Please try again.');
    }
  };

  return (
    <div className="report-bug">
      <h1 className="page-title">REPORT A BUG</h1>
      
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Bug Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Login Page Error"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe the bug in detail..."
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="form-group">
              <label>Assign To</label>
              <select
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleInputChange}
              >
                <option value="">Unassigned</option>
                {users.map(user => (
                  <option key={user.email} value={user.email}>{user.fullName}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Environment</label>
            <input
              type="text"
              name="environment"
              value={formData.environment}
              onChange={handleInputChange}
              placeholder="Windows / Chrome / v21.0"
              required
            />
          </div>

          {/* Reproduction Steps Recorder */}
          <div className="reproduction-steps-section">
            <h3>Reproduction Steps:</h3>
            
            <div className="recording-controls">
              {!isRecording ? (
                <button
                  type="button"
                  className="btn btn-record"
                  onClick={startRecording}
                >
                  🎬 Start Recording Steps
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-stop"
                  onClick={stopRecording}
                >
                  ⏹️ Stop Recording
                </button>
              )}
            </div>

            {isRecording && (
              <div className="step-recorder">
                <div className="form-group">
                  <label>Step Description</label>
                  <input
                    type="text"
                    value={currentStep}
                    onChange={(e) => setCurrentStep(e.target.value)}
                    placeholder="e.g., Click 'Login' button (Error displayed)"
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Expected Result (Optional)</label>
                    <input
                      type="text"
                      value={expectedResult}
                      onChange={(e) => setExpectedResult(e.target.value)}
                      placeholder="What should happen?"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Actual Result (Optional)</label>
                    <input
                      type="text"
                      value={actualResult}
                      onChange={(e) => setActualResult(e.target.value)}
                      placeholder="What actually happened?"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-add-step"
                  onClick={addStep}
                >
                  ➕ Add Step
                </button>
              </div>
            )}

            {/* Display recorded steps */}
            {reproductionSteps.length > 0 && (
              <div className="recorded-steps">
                <h4>Recorded Steps:</h4>
                <ol>
                  {reproductionSteps.map((step, index) => (
                    <li key={index} className="step-item">
                      <div className="step-content">
                        <span className="step-description">{step.description}</span>
                        {step.expected && (
                          <div className="step-results">
                            <span className="expected">Expected: {step.expected}</span>
                            {step.actual && <span className="actual">Actual: {step.actual}</span>}
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        className="btn-remove"
                        onClick={() => removeStep(index)}
                      >
                        ❌
                      </button>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-primary submit-btn">
            Submit Bug Report
          </button>
        </form>
      </div>
    </div>
  );
}

export default ReportBug;
