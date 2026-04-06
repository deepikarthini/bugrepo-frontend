// Mappings between frontend and backend data models

// Status Mappings
export const STATUS_TO_BACKEND = {
  'Open': 'NEW',
  'In Progress': 'IN_PROGRESS',
  'Assigned': 'ASSIGNED',
  'Resolved': 'RESOLVED',
  'Closed': 'CLOSED'
};

export const STATUS_TO_FRONTEND = {
  'NEW': 'Open',
  'IN_PROGRESS': 'In Progress',
  'ASSIGNED': 'Assigned',
  'RESOLVED': 'Resolved',
  'CLOSED': 'Closed',
  // Also handle if backend sends string values
  'Open': 'Open',
  'In Progress': 'In Progress',
  'Closed': 'Closed'
};

// Priority/Severity Mappings
export const PRIORITY_TO_BACKEND = {
  'Low': 'LOW',
  'Medium': 'MEDIUM',
  'High': 'HIGH',
  'Critical': 'CRITICAL'
};

export const SEVERITY_TO_FRONTEND = {
  'LOW': 'Low',
  'MEDIUM': 'Medium',
  'HIGH': 'High',
  'CRITICAL': 'Critical',
  // Also handle if backend sends string values
  'Low': 'Low',
  'Medium': 'Medium',
  'High': 'High',
  'Critical': 'Critical'
};

// Convert frontend bug to backend format
export const mapBugToBackend = (bug) => {
  return {
    title: bug.title,
    description: bug.description,
    severity: bug.priority ? PRIORITY_TO_BACKEND[bug.priority] : 'MEDIUM',
    environment: bug.environment || 'Unknown',
    reproductionSteps: bug.reproductionSteps || []
  };
};

// Convert backend bug to frontend format
export const mapBugToFrontend = (bug) => {
  // Handle case where backend returns simple format
  if (typeof bug.status === 'string' && typeof bug.environment === 'string') {
    return {
      id: bug.id,
      title: bug.title,
      description: bug.description,
      status: bug.status, // Already in simple format
      priority: bug.priority || 'Medium',
      assignedTo: bug.assignedTo,
      environment: bug.environment,
      reproductionSteps: bug.reproductionSteps || [],
      createdAt: bug.createdAt,
      updatedAt: bug.updatedAt
    };
  }
  
  // Handle case where backend returns complex object format
  return {
    id: bug.id,
    title: bug.title,
    description: bug.description,
    status: STATUS_TO_FRONTEND[bug.status] || bug.status,
    priority: SEVERITY_TO_FRONTEND[bug.severity] || bug.severity,
    assignedTo: bug.assignedTo ? bug.assignedTo.fullName : null,
    environment: bug.environment ? 
      `${bug.environment.osName || ''} / ${bug.environment.browserName || ''} / ${bug.environment.browserVersion || ''}`.trim() : 
      'Unknown Environment',
    reproductionSteps: bug.steps || [],
    createdAt: bug.createdAt,
    updatedAt: bug.updatedAt
  };
};
