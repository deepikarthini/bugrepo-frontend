import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBugs } from '../context/BugContext.jsx';
import './BugDetails.css';

function BugDetails({ currentUser }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getBugById, users, assignBug, updateBugStatus, getBugAiInsights, regenerateBugAiInsights, exportBugAiReport } = useBugs();
  const bug = getBugById(id);
  const [selectedUser, setSelectedUser] = useState('');
  const [isReplaying, setIsReplaying] = useState(false);
  const [currentReplayStep, setCurrentReplayStep] = useState(0);
  const [aiInsights, setAiInsights] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  useEffect(() => {
    if (bug && bug.assignedTo) {
      // bug.assignedTo contains the email, so use it directly
      // If it contains fullName, try to find the matching user's email
      const matchingUser = users.find(u => 
        u.email === bug.assignedTo || u.fullName === bug.assignedTo
      );
      setSelectedUser(matchingUser ? matchingUser.email : bug.assignedTo);
    } else {
      setSelectedUser('');
    }
  }, [bug, users]);

  useEffect(() => {
    const loadAiInsights = async () => {
      if (!bug) {
        return;
      }

      try {
        setAiLoading(true);
        setAiError('');
        const insights = await getBugAiInsights(id);
        setAiInsights(insights);
      } catch (error) {
        console.error('Error loading AI insights:', error);
        setAiError('Failed to load AI insights for this bug.');
      } finally {
        setAiLoading(false);
      }
    };

    loadAiInsights();
  }, [bug, id, getBugAiInsights]);

  const handleAssign = async () => {
    try {
      assignBug(id, selectedUser);
      alert('Bug assigned successfully!');
    } catch (error) {
      console.error('Error assigning bug:', error);
      alert('Failed to assign bug.');
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      updateBugStatus(id, newStatus);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const replaySteps = () => {
    if (!bug.reproductionSteps || bug.reproductionSteps.length === 0) return;
    
    setIsReplaying(true);
    setCurrentReplayStep(0);
    
    const interval = setInterval(() => {
      setCurrentReplayStep(prev => {
        if (prev >= bug.reproductionSteps.length - 1) {
          clearInterval(interval);
          setTimeout(() => {
            setIsReplaying(false);
            setCurrentReplayStep(0);
          }, 1000);
          return prev;
        }
        return prev + 1;
      });
    }, 2000);
  };

  const handleExportAiReport = async () => {
    try {
      const reportBlob = await exportBugAiReport(id);
      const url = window.URL.createObjectURL(new Blob([reportBlob], { type: 'text/markdown' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `bug-${id}-ai-report.md`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting AI report:', error);
      alert('Failed to export AI report.');
    }
  };

  const handleRefreshAiInsights = async () => {
    try {
      setAiLoading(true);
      setAiError('');
      const insights = await regenerateBugAiInsights(id);
      setAiInsights(insights);
    } catch (error) {
      console.error('Error refreshing AI insights:', error);
      setAiError('Failed to refresh AI insights.');
    } finally {
      setAiLoading(false);
    }
  };

  const copyPlaywrightScript = async () => {
    if (!aiInsights?.playwrightScript) {
      return;
    }

    try {
      await navigator.clipboard.writeText(aiInsights.playwrightScript);
      alert('Playwright script copied to clipboard.');
    } catch (error) {
      console.error('Error copying script:', error);
      alert('Failed to copy script.');
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'Open': return 'status-open';
      case 'In Progress': return 'status-in-progress';
      case 'Closed': return 'status-closed';
      default: return '';
    }
  };

  if (!bug) {
    return <div className="error">Bug not found</div>;
  }

  return (
    <div className="bug-details">
      <div className="bug-header">
        <div className="bug-header-left">
          <h1>{bug.title}</h1>
          <span className={`status-badge ${getStatusClass(bug.status)}`}>
            {bug.status}
          </span>
        </div>
        <div className="bug-header-right">
          <span className="bug-label">Assigned To</span>
          <div className="assign-dropdown">
            <select 
              value={selectedUser} 
              onChange={(e) => setSelectedUser(e.target.value)}
              className="assign-select"
            >
              <option value="">Unassigned</option>
              {users.map(user => (
                <option key={user.email} value={user.email}>👤 {user.fullName}</option>
              ))}
            </select>
            <button className="btn-assign" onClick={handleAssign}>✓</button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="bug-info">
          <div className="info-item">
            <strong>Environment:</strong> {bug.environment}
          </div>
          <div className="info-item">
            <strong>Description:</strong> {bug.description}
          </div>
          <div className="info-item">
            <strong>Priority:</strong> 
            <span className={`priority-badge priority-${bug.priority.toLowerCase()}`}>
              {bug.priority}
            </span>
          </div>
        </div>

        <div className="ai-section">
          <div className="ai-section-header">
            <h3>AI Insights</h3>
            <div className="ai-section-actions">
              <button className="btn btn-ai-secondary" onClick={handleRefreshAiInsights}>
                Refresh Insights
              </button>
              <button className="btn btn-ai-primary" onClick={handleExportAiReport}>
                Export AI Report
              </button>
            </div>
          </div>

          {aiLoading && <p className="ai-state">Generating AI insights...</p>}
          {aiError && <p className="ai-error">{aiError}</p>}

          {aiInsights && !aiLoading && (
            <div className="ai-grid">
              <div className="ai-card">
                <h4>Summary</h4>
                <p>{aiInsights.summary}</p>
                {aiInsights.generatedAt && (
                  <p className="ai-meta">Generated: {new Date(aiInsights.generatedAt).toLocaleString()}</p>
                )}
              </div>

              <div className="ai-card">
                <h4>Suggested Priority</h4>
                <p className={`priority-badge priority-${aiInsights.suggestedPriority.toLowerCase()}`}>
                  {aiInsights.suggestedPriority}
                </p>
                <ul className="ai-reasoning-list">
                  {aiInsights.reasoning?.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="ai-card ai-card-wide">
                <h4>Root Cause Hint</h4>
                <p>{aiInsights.rootCauseHint}</p>
              </div>

              <div className="ai-card ai-card-wide">
                <h4>Possible Duplicates</h4>
                {aiInsights.duplicateCandidates?.length ? (
                  <div className="duplicate-list">
                    {aiInsights.duplicateCandidates.map(candidate => (
                      <div key={candidate.id} className="duplicate-item">
                        <div>
                          <strong>#{candidate.id} {candidate.title}</strong>
                          <p>{candidate.reason}</p>
                        </div>
                        <span className="duplicate-score">{candidate.similarityScore}%</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No close duplicates found for this bug.</p>
                )}
              </div>

              <div className="ai-card ai-card-wide">
                <div className="ai-card-header-row">
                  <h4>Playwright Script</h4>
                  <button className="btn btn-ai-secondary" onClick={copyPlaywrightScript}>
                    Copy Script
                  </button>
                </div>
                <pre className="playwright-script">{aiInsights.playwrightScript}</pre>
              </div>
            </div>
          )}
        </div>

        <div className="reproduction-section">
          <h3>Reproduction Steps:</h3>
          
          {!bug.reproductionSteps || bug.reproductionSteps.length === 0 ? (
            <p className="no-steps">No reproduction steps recorded for this bug.</p>
          ) : (
            <>
          <div className="steps-list">
            {bug.reproductionSteps.map((step, index) => (
              <div 
                key={index} 
                className={`step-box ${isReplaying && index === currentReplayStep ? 'step-active' : ''} ${isReplaying && index < currentReplayStep ? 'step-completed' : ''}`}
              >
                <div className="step-header">
                  <input 
                    type="checkbox" 
                    checked={isReplaying && index <= currentReplayStep}
                    readOnly
                  />
                  <span className="step-number">{step.step}.</span>
                  <span className="step-text">{step.description}</span>
                </div>
                {step.expected && (
                  <div className="step-results">
                    <div className="result-item">
                      <span className="result-label">Expected:</span>
                      <span>{step.expected}</span>
                    </div>
                    {step.actual && (
                      <div className="result-item">
                        <span className="result-label">Actual:</span>
                        <span>{step.actual}</span>
                      </div>
                    )}
                  </div>
                )}
                {step.screenshot && (
                  <div className="step-screenshot">
                    <img src={step.screenshot} alt={`Step ${step.step}`} />
                  </div>
                )}
              </div>
            ))}
          </div>

          <button 
            className="btn btn-replay" 
            onClick={replaySteps}
            disabled={isReplaying}
          >
            {isReplaying ? '⏸️ Replaying...' : '▶️ Replay Steps'}
          </button>
            </>
          )}
        </div>

        <div className="bug-actions">
          <button 
            className="btn btn-status btn-open"
            onClick={() => handleStatusChange('Open')}
          >
            Mark as Open
          </button>
          <button 
            className="btn btn-status btn-progress"
            onClick={() => handleStatusChange('In Progress')}
          >
            Mark as In Progress
          </button>
          <button 
            className="btn btn-status btn-closed"
            onClick={() => handleStatusChange('Closed')}
          >
            Mark as Closed
          </button>
          <button 
            className="btn btn-back"
            onClick={() => navigate('/')}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default BugDetails;
