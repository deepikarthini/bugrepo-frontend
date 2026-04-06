import React from 'react';
import { Link } from 'react-router-dom';
import { useBugs } from '../context/BugContext';
import './MyBugs.css';

function MyBugs({ currentUser }) {
  const { getBugsByUser, updateBugStatus } = useBugs();
  const bugs = getBugsByUser(currentUser);

  const handleStatusUpdate = async (bugId, newStatus) => {
    try {
      updateBugStatus(bugId, newStatus);
    } catch (error) {
      console.error('Error updating status:', error);
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

  const getPriorityClass = (priority) => {
    switch(priority) {
      case 'High': return 'priority-high';
      case 'Medium': return 'priority-medium';
      case 'Low': return 'priority-low';
      default: return '';
    }
  };

  const downloadBugReport = (bug) => {
    const reportContent = `
BUG REPORT
==========
ID: ${bug.id}
Title: ${bug.title}
Description: ${bug.description}
Status: ${bug.status}
Priority: ${bug.priority}
Environment: ${bug.environment}
Assigned To: ${bug.assignedTo}

REPRODUCTION STEPS:
${bug.reproductionSteps.map(step => `${step.step}. ${step.description}`).join('\n')}

Created: ${new Date(bug.createdAt).toLocaleString()}
Last Updated: ${new Date(bug.updatedAt).toLocaleString()}
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bug-report-${bug.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="my-bugs">
      <div className="page-header">
        <h1 className="page-title">MY ASSIGNED BUGS</h1>
        <div className="header-actions">
          <button className="btn btn-update">Update Status</button>
          <button className="btn btn-logout">Logout</button>
        </div>
      </div>

      {bugs.length === 0 ? (
        <div className="card">
          <p className="no-bugs">No bugs assigned to you yet.</p>
        </div>
      ) : (
        <div className="card">
          <div className="table-container">
            <table className="bugs-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bugs.map(bug => (
                  <tr key={bug.id}>
                    <td className="bug-id">{bug.id}</td>
                    <td>
                      <Link to={`/bug/${bug.id}`} className="bug-title-link">
                        {bug.title}
                      </Link>
                    </td>
                    <td>
                      <select
                        className={`status-select ${getStatusClass(bug.status)}`}
                        value={bug.status}
                        onChange={(e) => handleStatusUpdate(bug.id, e.target.value)}
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>
                    <td>
                      <span className={`priority-badge ${getPriorityClass(bug.priority)}`}>
                        {bug.priority}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn-download"
                        onClick={() => downloadBugReport(bug)}
                        title="Download Bug Report"
                      >
                        ⬇️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyBugs;
