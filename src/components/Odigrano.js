import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Odigrano({ userData }) {
  // State to store tickets fetched from the server
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    // Fetch tickets based on the user's email
    const fetchTickets = async () => {
      try {
        // Send a GET request to fetch tickets for the logged-in user
        const response = await axios.get(`http://localhost:81/tickets/${userData.email}`);
        setTickets(response.data); // Store fetched tickets in state
      } catch (error) {
        // Log any errors if the fetch fails
        console.error('Error fetching tickets:', error);
      }
    };

    // Fetch tickets only if the user has an email
    if (userData.email) {
      fetchTickets(); // Fetch tickets for the user with the given email
    }
  }, [userData.email]); // Re-run the effect if the email changes

  // Function to determine the status of the ticket (Prosao, Pao, or Nepoznat)
  const prosao = (prosao) => {
    if (isNaN(prosao)) {
      return 'Nepoznat'; // If the status is not a number, return 'Nepoznat'
    } else {
      // Return 'Prosao' if the status is true, 'Pao' if false
      return prosao ? 'Prosao' : 'Pao';
    }
  };

  console.log(userData.email); // Debugging log to see the user's email

  return (
    <div className="Odigrano">
      <h2 className="text-center">Istorija odigranih tiketa</h2>
      {tickets.length > 0 ? (
        // Display the ticket table if tickets are available
        <table className="table table-striped" id='Odigrane'>
          <thead>
            <tr>
              <th>Tiket ID</th>
              <th>Ulog</th>
              <th>Moguc dobitak</th>
              <th>Ishod</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              // Render each ticket in the table
              <tr key={ticket.TiketID}>
                <td>{ticket.TiketID}</td>
                <td>{ticket.Ulog}$</td>
                <td>{ticket.MogucDobitak}$</td>
                <td>{prosao(ticket.Prosao)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        // Show a message if no tickets are found
        <p className="text-center">Nema odigranih tiketa.</p>
      )}
    </div>
  );
}

export default Odigrano;
