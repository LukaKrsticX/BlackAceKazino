import React from 'react';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  // Initialize the navigate function from react-router-dom for navigation
  const navigate = useNavigate();

  // Handler to navigate to the Users dashboard
  const handleUsersClick = () => {
    navigate('/AdminDashboardUsers'); // Navigate to the users dashboard
  };

  // Handler to navigate to the Utakmice dashboard
  const handleUtakmiceClick = () => {
    navigate('/AdminDashboardUtakmice'); // Navigate to the utakmice dashboard
  };

  return (
    <div className="AdminDashboard">
      {/* Background overlay and center alignment */}
      <div className="dark-overlay landing-inner text-light d-flex align-items-center justify-content-center">
        <div className="container text-center">
          {/* Button to navigate to Users Dashboard */}
          <button id='AdminBtns' className="btn btn-primary m-2" onClick={handleUsersClick}>Users</button>
          {/* Button to navigate to Utakmice Dashboard */}
          <button id='AdminBtns' className="btn btn-primary m-2" onClick={handleUtakmiceClick}>Utakmice</button>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
