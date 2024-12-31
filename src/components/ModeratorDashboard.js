import React from 'react';
import { useNavigate } from 'react-router-dom';

function ModeratorDashboard() {

  const navigate = useNavigate();



  const handleUtakmiceClick = () => {
    navigate('/AdminDashboardUtakmice'); 
  };


  return (
    <div className="ModeratorDashboard">
      <div className="dark-overlay landing-inner text-light d-flex align-items-center justify-content-center" >
        <div className="container text-center">
        <button id='AdminBtns' className="btn btn-primary m-2" onClick={handleUtakmiceClick}>Utakmice</button>
      </div>
      </div>
    </div>
  );
}

export default ModeratorDashboard;
