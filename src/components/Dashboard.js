import React from 'react';
import { Link } from 'react-router-dom';
import { useBugs } from '../context/BugContext';
import './Dashboard.css';

function Dashboard() {
  const { bugs, loading, error, getStats } = useBugs();
  const stats = getStats();

  const getStatusClass = (status) => {
    switch(status) {
      case 'Open':
      case 'Assigned': 
        return 'status-open';
      case 'In Progress': 
        return 'status-in-progress';
      case 'Resolved':
      case 'Closed': 
        return 'status-closed';
      default: 
        return '';
    }
  };

  if (loading) {
    return <div className="loading">Loading bugs...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="dashboard">
      <h1 className="page-title">Dashboard</h1>
      
      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card total-bugs">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Total Bugs</h3>
            <p className="stat-number">{stats.total}</p>
          </div>
        </div>
        
        <div className="stat-card open-bugs">
          <div className="stat-icon">🔴</div>
          <div className="stat-content">
            <h3>Open Bugs</h3>
            <p className="stat-number">{stats.open}</p>
          </div>
        </div>
        
        <div className="stat-card in-progress-bugs">
          <div className="stat-icon">🔵</div>
          <div className="stat-content">
            <h3>In Progress</h3>
            <p className="stat-number">{stats.inProgress}</p>
          </div>
        </div>
        
        <div className="stat-card closed-bugs">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Closed Bugs</h3>
            <p className="stat-number">{stats.closed}</p>
          </div>
        </div>
      </div>

      {/* Recent Bugs Table */}
      <div className="card">
        <h2>Recent Bugs</h2>
        <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Assigned To</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bugs.map(bug => (
                  <tr key={bug.id}>
                    <td>{bug.id}</td>
                    <td>{bug.title}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(bug.status)}`}>
                        {bug.status}
                      </span>
                    </td>
                    <td>{bug.assignedTo || 'Unassigned'}</td>
                    <td>
                      <Link to={`/bug/${bug.id}`} className="view-link">View Details</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      </div>
    </div>
  );
}

export default Dashboard;
