import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import fudbalSlika from '../img/football.jpg';
import kosarkaSlika from '../img/basketball.jpg';
import odbojkaSlika from '../img/odbojka.jpg';
import { Link } from 'react-router-dom';

function Sport() {

  // State to store the list of sports fetched from the server
  const [sports, setSports] = useState([]);

  useEffect(() => {
    // Fetch sports data when the component mounts
    fetchSports();
  }, []); // Empty dependency array ensures this effect runs only once

  // Fetch the list of sports from the server
  const fetchSports = async () => {
    try {
      // Send GET request to fetch sports
      const response = await axios.get('http://localhost:81/sports');
      setSports(response.data); // Store the fetched sports in state
    } catch (error) {
      // Log any errors that occur during the fetch
      console.error('Error fetching sports:', error);
    }
  };
  
  // Function to render the jumbotron sections for sports in rows of 3
  const renderJumbotrons = () => {
    const jumbotrons = []; // Array to store the jumbotron rows

    // Loop through sports, creating groups of 3 sports at a time
    for (let i = 0; i < sports.length; i += 3) {
      const rowSports = sports.slice(i, i + 3); // Get 3 sports at a time
      const jumbotronRow = (
        <div className="row" key={i}>
          {rowSports.map((sport, index) => (
            <div key={index} className="col-md-4 mb-4">
              {/* Link to ticket creation page for each sport */}
              <Link to={`/tiket?sport=${sport}`} id='linkSport'>
                <div className="jumbotron" id='jumboSport' style={{ 
                  // Set background image for the jumbotron based on sport
                  backgroundImage: `url(${getBackgroundForSport(sport)})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  width: '250px',
                  height: '300px'
                }}>
                  <h1 className="display-4">{sport}</h1>
                  <p className="lead"></p>
                  <hr className="my-4" />
                </div>
              </Link>
            </div>
          ))}
        </div>
      );

      // Add the current jumbotron row to the jumbotrons array
      jumbotrons.push(jumbotronRow);
    }

    return jumbotrons; // Return the array of jumbotron rows
  };

  // Function to get the appropriate background image for each sport
  const getBackgroundForSport = (sport) => {
    switch (sport.toLowerCase()) {
      case 'fudbal':
        return fudbalSlika; // Return football image
      case 'kosarka':
        return kosarkaSlika; // Return basketball image
      case 'odbojka':
        return odbojkaSlika; // Return volleyball image
      default:
        return ''; // Default empty string if sport doesn't match
    }
  };

  return (
    <div className="sport">
      <div className="dark-overlay landing-inner text-light">
        <div className="container">
          <div className="row align-items-center justify-content-center">
            <div className="col-md-8">
              {/* Render jumbotron sections dynamically */}
              {renderJumbotrons()}
            </div>
          </div>
        </div>
      </div>
    </div> 
  );
}

export default Sport;
