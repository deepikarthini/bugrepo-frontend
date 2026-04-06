import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBugs } from '../context/BugContext';
import './BugDetails.css';

function BugDetails({ currentUser }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getBugById, users, assignBug, updateBugStatus } = useBugs();
  const bug = getBugById(id);
  const [selectedUser, setSelectedUser] = useState('');
  const [isReplaying, setIsReplaying] = useState(false);
  const [currentReplayStep, setCurrentReplayStep] = useState(0);

  useEffect(() => {
    if (bug && bug.assignedTo) {
      // Find the user object by fullName to get their email
      const matchingUser = users.find(u => u.fullName === bug.assignedTo);
      setSelectedUser(matchingUser ? matchingUser.email : '');
    } else {
      setSelectedUser('');
    }
  }, [bug, users]);

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

        <div className="reproduction-section">
          <h3>Reproduction Steps:</h3>
          
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
