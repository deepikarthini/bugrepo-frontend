import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBugs } from '../context/BugContext.jsx';
import './Dashboard.css';

function Dashboard() {
  const { bugs, getStats, loading, error, users } = useBugs();
  const stats = getStats();
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState(null); // null means show all
  const bugsPerPage = 10;

  // Filter bugs based on selected status
  const filteredBugs = filterStatus 
    ? bugs.filter(bug => {
        if (filterStatus === 'all') return true;
        return bug.status === filterStatus;
      })
    : bugs;

  // Calculate pagination based on filtered bugs
  const totalPages = Math.ceil(filteredBugs.length / bugsPerPage);
  const indexOfLastBug = currentPage * bugsPerPage;
  const indexOfFirstBug = indexOfLastBug - bugsPerPage;
  const currentBugs = filteredBugs.slice(indexOfFirstBug, indexOfLastBug);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'Open': return 'status-open';
      case 'In Progress': return 'status-in-progress';
      case 'Closed': return 'status-closed';
      default: return '';
    }
  };

  // Helper function to get user's full name from email
  const getAssignedUserName = (assignedTo) => {
    if (!assignedTo) return 'Unassigned';
    const user = users.find(u => u.email === assignedTo || u.fullName === assignedTo);
    return user ? user.fullName : assignedTo;
  };

  return (
    <div className="dashboard">
      <h1 className="page-title">Dashboard</h1>
      
      {/* Statistics Cards */}
      <div className="stats-grid">
        <div 
          className={`stat-card total-bugs clickable ${filterStatus === 'all' ? 'active' : ''}`}
          onClick={() => handleFilterChange('all')}
        >
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Total Bugs</h3>
            <p className="stat-number">{stats.total}</p>
          </div>
        </div>
        
        <div 
          className={`stat-card open-bugs clickable ${filterStatus === 'Open' ? 'active' : ''}`}
          onClick={() => handleFilterChange('Open')}
        >
          <div className="stat-icon">🔴</div>
          <div className="stat-content">
            <h3>Open Bugs</h3>
            <p className="stat-number">{stats.open}</p>
          </div>
        </div>
        
        <div 
          className={`stat-card in-progress-bugs clickable ${filterStatus === 'In Progress' ? 'active' : ''}`}
          onClick={() => handleFilterChange('In Progress')}
        >
          <div className="stat-icon">🔵</div>
          <div className="stat-content">
            <h3>In Progress</h3>
            <p className="stat-number">{stats.inProgress}</p>
          </div>
        </div>
        
        <div 
          className={`stat-card closed-bugs clickable ${filterStatus === 'Closed' ? 'active' : ''}`}
          onClick={() => handleFilterChange('Closed')}
        >
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Closed Bugs</h3>
            <p className="stat-number">{stats.closed}</p>
          </div>
        </div>
      </div>

      {/* Recent Bugs Table */}
      <div className="card">
        <div className="card-header">
          <h2>
            {filterStatus === 'Open' && 'Open Bugs'}
            {filterStatus === 'In Progress' && 'Bugs In Progress'}
            {filterStatus === 'Closed' && 'Closed Bugs'}
            {(filterStatus === 'all' || !filterStatus) && 'Recent Bugs'}
          </h2>
          {filterStatus && (
            <button className="clear-filter-btn" onClick={() => handleFilterChange(null)}>
              Clear Filter
            </button>
          )}
        </div>
        {error && (
          <div className="error-message">
            <p>{error}</p>
            <p>Please make sure your backend API is running on http://localhost:8080</p>
          </div>
        )}
        {loading ? (
          <p className="loading-text">Loading bugs...</p>
        ) : (
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
                {currentBugs.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                      No bugs found
                    </td>
                  </tr>
                ) : (
                  currentBugs.map(bug => (
                    <tr key={bug.id}>
                      <td>{bug.id}</td>
                      <td>{bug.title}</td>
                      <td>
                        <span className={`status-badge ${getStatusClass(bug.status)}`}>
                          {bug.status}
                        </span>
                      </td>
                      <td>{getAssignedUserName(bug.assignedTo)}</td>
                      <td>
                        <Link to={`/bug/${bug.id}`} className="view-link">View Details</Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {bugs.length > 0 && (
              <div className="pagination">
                <button 
                  className="pagination-btn" 
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <div className="pagination-info">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                    <button
                      key={pageNum}
                      className={`page-number ${currentPage === pageNum ? 'active' : ''}`}
                      onClick={() => goToPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>
                <button 
                  className="pagination-btn" 
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
