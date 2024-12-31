import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Ticket() {
  // Get location data from the router (used for passing state between routes)
  const location = useLocation();

  // Destructure the ticket object from the location state
  const { ticket } = location.state || {}; // Default to empty object if ticket is not found

  // Initialize the navigate function to programmatically navigate between routes
  const navigate = useNavigate();
  
  // If ticket data is not found, show a loading message
  if (!ticket) {
    return <div className='ticketLoading'>
      <div className='ticketLoadingStyle'>
        Loading...
      </div>
    </div>;
  }

  // Function to navigate back to the sports page
  const handleBackToSport = () => {
    navigate('/sport'); // Navigate to the '/sport' route
  };

  return (
    <div className="ticket-page">
      <div className="ticket-overlay">
        <div className="ticket-container">
          <h2>Detalji Tiketa</h2>
          <div>
            <h4>Utakmice:</h4>
            <ul>
              {/* Map over the matches and display each match's details */}
              {ticket.matches.map((match, index) => (
                <li key={index}>
                  <strong>{match.Ucesnik1} vs {match.Ucesnik2}</strong><br />
                  Ishod: {match.Ishod}<br />
                  Kvota: {match.Kvota}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Ulog:</h4>
            <p>{ticket.ulog}</p>
          </div>
          <div>
            <h4>Ukupna kvota:</h4>
            <p>{ticket.ukupnaKvota}</p>
          </div>
          <div>
            <h4>Mogući dobitak:</h4>
            <p>{ticket.moguciDobitak}</p>
          </div>
          {/* Button to navigate back to the sports page */}
          <button className="btn btn-primary" onClick={handleBackToSport} id='BackToSport'>Nazad na sport</button>
        </div>
      </div>
    </div>
  );
}

export default Ticket;
