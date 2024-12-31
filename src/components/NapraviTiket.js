import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

function NapraviTiket({ balance: initialBalance, updateUserBalance }) {
  const location = useLocation(); 
  const navigate = useNavigate();

  // Extract sport from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const sport = queryParams.get('sport');

  const [matches, setMatches] = useState([]);  // Store match data
  const [ishodi, setIshodi] = useState([]);  // Store possible outcomes for matches
  const [selections, setSelections] = useState({});  // Store selected outcomes for matches
  const [ulog, setUlog] = useState('');  // Store the bet amount
  const [ukupnaKvota, setUkupnaKvota] = useState(1);  // Store the total odds of the bet
  const [moguciDobitak, setMoguciDobitak] = useState(0);  // Store possible winnings
  const [email, setEmail] = useState('');  // Store user email
  const [balance, setBalance] = useState(initialBalance);  // Store user balance

  // Fetch match and outcome data when sport changes or on component mount
 useEffect(() => {
  fetchMatches(sport);  // Fetch matches for the selected sport
  fetchIshodi();        // Fetch possible outcomes for the matches
  
  // Fetch email from localStorage for logged-in user
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  if (loggedInUser) {
    setEmail(loggedInUser.email);
  }
}, [sport]);

  // Fetch user balance once email is set
  useEffect(() => {
    if (email) { 
      fetchBalance(email);  // Fetch balance of logged-in user
    }
  }, [email]);

  // Update total odds and possible winnings whenever selections or bet amount change
  useEffect(() => {
    updateTotalOddsAndWinnings(selections, ulog);
  }, [ulog, ukupnaKvota, selections]);

  // Fetch matches based on selected sport
  const fetchMatches = async (sport) => {
    const url = `http://localhost:81/matches?sport=${sport}`;
    const ishodUrl = 'http://localhost:81/ishodi';

    try {
      // Fetch matches and outcomes concurrently
      const [matchesResponse, ishodResponse] = await Promise.all([
        axios.get(url),
        axios.get(ishodUrl)
      ]);
      setMatches(matchesResponse.data);  // Set match data
      setIshodi(ishodResponse.data);  // Set possible outcomes
    } catch (error) {
      console.error('Error fetching matches:', error);
    }
  };

  // Function to fetch possible outcomes (ishodi) for matches
const fetchIshodi = async () => {
  const ishodUrl = 'http://localhost:81/ishodi';

  // Log the URL being used for the fetch request
  console.log(`Fetching ishodi from URL: ${ishodUrl}`);

  try {
    // Fetch the outcomes data from the server
    const ishodResponse = await axios.get(ishodUrl);
    console.log('Ishodi data:', ishodResponse.data);

    // Set the fetched data into the state
    setIshodi(ishodResponse.data);
  } catch (error) {
    // Handle any errors during the fetch request
    console.error('Error fetching ishodi:', error);
  }
};

  // Fetch balance of logged-in user
  const fetchBalance = async (email) => {
    try {
      const response = await axios.get(`http://localhost:81/getBalance?email=${email}`);
      setBalance(response.data.balance);  // Set user balance
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  // Update balance on the server
  const updateBalance = async (newBalance) => {
    try {
      await axios.post('http://localhost:81/updateBalance', { email, newBalance });
      setBalance(newBalance);  // Update balance state
      updateUserBalance(newBalance);  // Update balance in parent component
    } catch (error) {
      console.error('Error updating balance:', error);
    }
  };

  // Handle outcome selection change for matches
  const handleSelectionChange = (matchId, value) => {
    setSelections(prevSelections => {
      const newSelections = {
        ...prevSelections,
        [matchId]: value,  // Update selection for match
      };
      updateTotalOddsAndWinnings(newSelections);  // Recalculate odds and winnings
      return newSelections;
    });
  };

  // Update total odds and possible winnings based on current selections
  const updateTotalOddsAndWinnings = (newSelections, newUlog = ulog) => {
    let totalOdds = 1.00;

    // Calculate total odds based on selected outcomes
    for (const match of matches) {
      if (newSelections[match.UtakmicaID]) {
        totalOdds *= parseFloat(newSelections[match.UtakmicaID]);
      }
    }

    setUkupnaKvota(totalOdds.toFixed(2));  // Set total odds

    // Calculate possible winnings based on bet amount and total odds
    if (newUlog && !isNaN(newUlog)) {
      const possibleWinnings = totalOdds * parseFloat(newUlog);
      setMoguciDobitak(possibleWinnings.toFixed(2));  // Set possible winnings
    } else {
      setMoguciDobitak(0);
    }
  };

  // Handle change in bet amount (ulog)
  const handleUlogChange = (e) => {
    const newUlog = e.target.value;
    setUlog(newUlog);  // Set bet amount
    const possibleWinnings = calculatePossibleWinnings(newUlog);  // Calculate possible winnings
    setMoguciDobitak(possibleWinnings);  // Set possible winnings
  };

  // Handle ticket creation
  const handleNapraviTiket = async () => {
    const possibleWinnings = calculatePossibleWinnings(ulog);

    // Ensure bet amount is valid
    if (!ulog) {
      alert('Molimo vas unesite ulog.');
      return;
    }

    // Check if user has enough balance
    if (ulog > balance) {
      alert('Nedovoljno sredstava na računu.');
      return;
    }

    // Filter selected matches based on user's selections
    const selectedMatches = matches.filter((match) => selections[match.UtakmicaID]);

    // Ensure at least one match is selected before proceeding
     if (selectedMatches.length === 0) {
      alert('Molimo vas izaberite barem jedan ishod.');
      return;
    }

    const ticket = {
      matches: selectedMatches.map(match => ({
        UtakmicaID: match.UtakmicaID,
        Ucesnik1: match.Ucesnik1,
        Ucesnik2: match.Ucesnik2,
        Ishod: `${ishodi.find(i => i.Kvota == selections[match.UtakmicaID])?.Ishod || 'Nepoznat'} - Kvota: ${selections[match.UtakmicaID]}`,
        Kvota: selections[match.UtakmicaID]
      })),
      ulog: parseFloat(ulog),
      ukupnaKvota: parseFloat(ukupnaKvota),
      moguciDobitak: parseFloat(possibleWinnings),
    };

    try {
      // Send ticket creation request
      const response = await axios.post('http://localhost:81/ticket', { email, ...ticket });
      alert('Tiket uspešno napravljen.');  // Show success message
      const newBalance = balance - parseFloat(ulog);  // Deduct bet amount from balance
      await updateBalance(newBalance);  // Update user balance
      navigate('/ticket', { state: { ticket } });  // Navigate to ticket page
    } catch (error) {
      console.error('Error creating ticket:', error);
      alert('Došlo je do greške prilikom kreiranja tiketa.');
    }
  };

  // Calculate possible winnings based on total odds and bet amount
  const calculatePossibleWinnings = (newUlog) => {
    if (!isNaN(newUlog)) {
      const totalOdds = parseFloat(ukupnaKvota);
      return (totalOdds * parseFloat(newUlog)).toFixed(2);  // Calculate and return winnings
    } else {
      return '0.00';
    }
  };

  // Render matches in jumbotron style with selections for outcomes
  const renderJumbotrons = () => {
    const jumbotrons = [];

    for (let i = 0; i < matches.length; i += 2) {
      const rowMatches = matches.slice(i, i + 2);
      const jumbotronRow = (
        <div className="row" key={i}>
          {rowMatches.map((match) => (
            <div key={match.UtakmicaID} className="col-md-6 mb-4">
              <div className="jumbotron" style={{ 
                backgroundImage: match.imageUrl ? `url(${match.imageUrl})` : 'none',
                backgroundPosition: 'center',
                color: 'gold',
                padding: '2rem',
                height: '300px' 
              }}>
                <h1 className="display-6" id='utakmice'>{match.Ucesnik1} vs {match.Ucesnik2}</h1>
                <p className="lead" id='utakmiceLead'>Datum: {new Date(match.datumVreme).toLocaleString()}</p>
                <p className="lead" id='utakmiceLead'>Ishod: {match.Ishod || 'Nepoznat'}</p>
                <hr className="my-4" />
                <div>
                  <label htmlFor={`selection-${match.UtakmicaID}`}>Izaberite ishod: </label>
                  <select
                    id={`selection-${match.UtakmicaID}`}
                    value={selections[match.UtakmicaID] || ''}
                    onChange={(e) => handleSelectionChange(match.UtakmicaID, e.target.value)}
                    style={{ backgroundColor: 'black', color: 'gold' }}
                  >
                    <option value="" disabled>Odabir</option>
                    {ishodi.map((ishod) => (
                      <option key={ishod.IshodID} value={ishod.Kvota}>{ishod.Ishod}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      );

      jumbotrons.push(jumbotronRow);
    }

    return jumbotrons;
  };

  // Show loading screen if no sport is selected
  if (!sport) {
    return <div className='sportLoading'>
      <div className='loadingMatches'>
        Loading...
      </div>
    </div>;
  }

  return (
    <div className="napraviTiket">
      <div className="dark-overlay landing-inner text-light">
        <div className="container">
          <div className="row align-items-center justify-content-center">
            <div className="col-md-8">
              {matches.length > 0 ? renderJumbotrons() : <div>Nema utakmica za: {sport}</div>}
            </div>
          </div>
          <div className="row align-items-center justify-content-center mt-4">
            <div className="col-md-8">
              <div className="form-group">
                <label htmlFor="ulog" id='labUlog'>Ulog:</label>
                <input
                  type="number"
                  className="form-control"
                  id="ulog"
                  value={ulog}
                  onChange={handleUlogChange}
                  placeholder="Unesite ulog"
                />
              </div>
              <div className="form-group">
                <label htmlFor="ukupnaKvota">Ukupna kvota:</label>
                <span id="ukupnaKvota">{ukupnaKvota}</span>
              </div>
              <div className="form-group">
                <label htmlFor="moguciDobitak">Mogući dobitak:</label>
                <span id="moguciDobitak">{moguciDobitak}</span>
              </div>
              <button className="btn btn-primary" id='napraviTiket' onClick={handleNapraviTiket} disabled={!selections || ulog <= 0}>Napravi tiket</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NapraviTiket;


