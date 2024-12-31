import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminDashboardUtakmice() {
  // State to manage list of matches
  const [utakmice, setUtakmice] = useState([]);

  // State for the update form
  const [updateForm, setUpdateForm] = useState({
    id: '',
    datumVreme: '',
    Ucesnik1: '',
    Ucesnik2: '',
    Sport: '',
    IshodID: ''
  });

  // State for creating a new match
  const [newUtakmica, setNewUtakmica] = useState({
    datumVreme: '',
    Ucesnik1: '',
    Ucesnik2: '',
    Sport: '',
    IshodID: ''
  });

  // Tracks the ID of the match being edited
  const [editingId, setEditingId] = useState(null);

  // Fetch matches on component load
  useEffect(() => {
    fetchUtakmice();
  }, []);

  // Fetches matches from the server
  const fetchUtakmice = () => {
    axios.get('http://localhost:81/get/utakmice')
      .then(response => {
        setUtakmice(response.data); // Updates state with fetched matches
      })
      .catch(error => {
        console.error('Error fetching utakmice:', error); // Logs error
      });
  };

  // Handles updating an existing match
  const handleUpdateUtakmica = () => {
    axios.put(`http://localhost:81/update/utakmica/${updateForm.id}`, {
      datumVreme: updateForm.datumVreme,
      Ucesnik1: updateForm.Ucesnik1,
      Ucesnik2: updateForm.Ucesnik2,
      Sport: updateForm.Sport,
      IshodID: updateForm.IshodID
    })
      .then(response => {
        console.log('Utakmica updated successfully'); // Logs success
        fetchUtakmice(); // Refreshes the match list
        setUpdateForm({
          id: '',
          datumVreme: '',
          Ucesnik1: '',
          Ucesnik2: '',
          Sport: '',
          IshodID: ''
        });
        setEditingId(null); // Closes the update form
      })
      .catch(error => {
        console.error('Error updating utakmica:', error); // Logs error
      });
  };

  // Handles creating a new match
  const handleCreateUtakmica = (event) => {
    event.preventDefault();
    if (!newUtakmica.datumVreme || !newUtakmica.Ucesnik1 || !newUtakmica.Ucesnik2 || !newUtakmica.Sport) {
      console.error('Please fill out all required fields.'); // Ensures all required fields are filled
      return;
    }

    axios.post('http://localhost:81/create/utakmica', newUtakmica)
      .then(response => {
        console.log('Utakmica created successfully'); // Logs success
        fetchUtakmice(); // Refreshes the match list
        setNewUtakmica({
          datumVreme: '',
          Ucesnik1: '',
          Ucesnik2: '',
          Sport: '',
          IshodID: ''
        });
      })
      .catch(error => {
        console.error('Error creating utakmica:', error); // Logs error
      });
  };

  // Updates the state for the update form
  const handleChangeUpdateForm = (e) => {
    setUpdateForm({ ...updateForm, [e.target.name]: e.target.value });
  };

  // Updates the state for creating a new match
  const handleChangeNewUtakmica = (e) => {
    setNewUtakmica({ ...newUtakmica, [e.target.name]: e.target.value });
  };

  // Opens the update form with pre-filled data for the selected match
  const handleEditClick = (utakmica) => {
    setUpdateForm({
      id: utakmica.UtakmicaID,
      datumVreme: utakmica.datumVreme,
      Ucesnik1: utakmica.Ucesnik1,
      Ucesnik2: utakmica.Ucesnik2,
      Sport: utakmica.Sport,
      IshodID: utakmica.IshodID
    });
    setEditingId(utakmica.UtakmicaID); // Sets the editing ID
  };

  return (
    <div className="AdminDashboardUtakmice">
      <h2>Utakmice:</h2>

      {/* Form for adding a new match */}
      <h3>Dodaj novu utakmicu:</h3>
      <form onSubmit={handleCreateUtakmica}>
        <input className='AdminPolja' type="datetime-local" name="datumVreme" placeholder="Datum i Vreme" value={newUtakmica.datumVreme}
          onChange={handleChangeNewUtakmica} required />
        <input className='AdminPolja' type="text" name="Ucesnik1" placeholder="Učesnik 1" value={newUtakmica.Ucesnik1} 
          onChange={handleChangeNewUtakmica} required />
        <input className='AdminPolja' type="text" name="Ucesnik2" placeholder="Učesnik 2" value={newUtakmica.Ucesnik2}
          onChange={handleChangeNewUtakmica} required />
        <input className='AdminPolja' type="text" name="Sport" placeholder="Sport" value={newUtakmica.Sport}
          onChange={handleChangeNewUtakmica} required />
        <input className='AdminPolja' type="text" name="IshodID" placeholder="Ishod ID (optional)" value={newUtakmica.IshodID}
          onChange={handleChangeNewUtakmica} />
        <button id="AdminBtns" type="submit">Dodaj utakmicu</button>
      </form>

      {/* List of matches */}
      <ul>
        {utakmice.map(utakmica => (
          <li className='utakmiceLi' key={utakmica.UtakmicaID}>
            <div>
              <strong>Datum/Vreme:</strong> {utakmica.datumVreme}<br />
              <strong>Učesnik 1:</strong> {utakmica.Ucesnik1}<br />
              <strong>Učesnik 2:</strong> {utakmica.Ucesnik2}<br />
              <strong>Ishod:</strong> {utakmica.IshodID || 'Neodređen'}<br />
              <strong>Sport:</strong> {utakmica.Sport}<br />
            </div>
            <button id="AdminBtns" onClick={() => handleEditClick(utakmica)}>Edit</button>
          </li>
        ))}
      </ul>

      {/* Form for updating a match */}
      {editingId && (
        <div>
          <h3>Update utakmica:</h3>
          <form onSubmit={(e) => { e.preventDefault(); handleUpdateUtakmica(); }}>
            <input className='AdminPolja' type="text" name="id" placeholder="Utakmica ID" value={updateForm.id}
              onChange={handleChangeUpdateForm} required readOnly />
            <input className='AdminPolja' type="datetime-local" name="datumVreme" placeholder="Datum i Vreme" value={updateForm.datumVreme}
              onChange={handleChangeUpdateForm} required />
            <input className='AdminPolja' type="text" name="Ucesnik1" placeholder="Učesnik 1" value={updateForm.Ucesnik1} 
              onChange={handleChangeUpdateForm} required />
            <input className='AdminPolja' type="text" name="Ucesnik2" placeholder="Učesnik 2" value={updateForm.Ucesnik2}
              onChange={handleChangeUpdateForm} required />
            <input className='AdminPolja' type="text" name="Sport" placeholder="Sport" value={updateForm.Sport} 
              onChange={handleChangeUpdateForm} required />
            <input className='AdminPolja' type="text" name="IshodID" placeholder="Ishod ID (optional)" value={updateForm.IshodID}
              onChange={handleChangeUpdateForm} />
            <button id="AdminBtns" type="submit">Update</button>
            <button id="AdminBtns" onClick={() => setEditingId(null)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default AdminDashboardUtakmice;
