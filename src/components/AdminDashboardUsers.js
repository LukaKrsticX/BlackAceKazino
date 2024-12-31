import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminDashboardUsers() {
  // State to store list of users, new user form data, and the user being edited
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    UserName: '',
    Email: '',
    Password: '',
    Balance: 0,
    Admin: false,
    Moderator: false
  });
  const [editingUser, setEditingUser] = useState(null); // Keeps track of the user being edited

  // Fetch users when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch users from the server
  const fetchUsers = () => {
    axios.get('http://localhost:81/get/users') 
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  };

  // Remove a user by their email
  const handleRemoveUser = (userEmail) => {
    fetch(`http://localhost:81/remove/users/${userEmail}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (response.ok) {
        setUsers(users.filter(user => user.Email !== userEmail)); // Remove user from state
      } else {
        console.error('Error removing user');
      }
    })
    .catch(error => console.error('Error removing user:', error));
  };
  
  // Add a new user
  const handleAddUser = (event) => {
    event.preventDefault();
    axios.post('http://localhost:81/create/user', newUser)
      .then(response => {
        fetchUsers(); // Refresh users list
        setNewUser({ UserName: '', Email: '', Password: '', Balance: 0, Admin: false, Moderator: false }); // Clear form
      })
      .catch(error => {
        console.error('Error adding user:', error);
      });
  };

  // Edit an existing user's details
  const handleEditUser = (event) => {
    event.preventDefault();
    axios.put(`http://localhost:81/update/user/${editingUser.Email}`, editingUser)
      .then(response => {
        setUsers(users.map(user => (user.Email === editingUser.Email ? editingUser : user))); // Update user in list
        setEditingUser(null);  // Clear editing state
      })
      .catch(error => {
        console.error('Error updating user:', error);
      });
  };

  return (
    <div className="AdminDashboardUsers">
      <h2>Korisnici:</h2>
      <h3>Dodaj novog korisnika:</h3>
      {/* Form to add a new user */}
      <form onSubmit={handleAddUser}>
        <input className='AdminPolja' type="text" placeholder="Korisničko ime" value={newUser.UserName} onChange={(e) => 
        setNewUser({ ...newUser, UserName: e.target.value })} required/>

        <input className='AdminPolja' type="email" placeholder="E-mail" value={newUser.Email} onChange={(e) => 
        setNewUser({ ...newUser, Email: e.target.value })} required/>

        <input className='AdminPolja' type="text" placeholder="Šifra" value={newUser.Password} onChange={(e) => 
        setNewUser({ ...newUser, Password: e.target.value })} required/>

        <input className='AdminPolja' type="number" placeholder="Balance" value={newUser.Balance} onChange={(e) => 
        setNewUser({ ...newUser, Balance: parseFloat(e.target.value) })}/>

        {/* Admin and Moderator checkboxes */}
        <label>
          <input className='AdminPolja' type="checkbox" checked={newUser.Admin} onChange={(e) => 
          setNewUser({ ...newUser, Admin: e.target.checked })}/> 
          Admin
        </label>
        <label>
          <input className='AdminPolja' type="checkbox" checked={newUser.Moderator} onChange={(e) => 
          setNewUser({ ...newUser, Moderator: e.target.checked })}/> 
          Moderator
        </label>
        <button id ='AdminBtns' type="submit">Dodaj korisnika</button>
      </form>

      {/* List of users */}
      <ul>
        {users.map(user => (
          <li key={user.Email}>
            {user.UserName} ({user.Email}) - Balance: {user.Balance}$ ---
            <button id='AdminBtns' onClick={() => handleRemoveUser(user.Email)}>Remove</button>
            <button id='AdminBtns' onClick={() => setEditingUser(user)}>Edit</button>
          </li>
        ))}
      </ul>

      {/* Edit user form (only shown when editingUser is set) */}
      {editingUser && (
        <div>
          <h3>Edituj korisnika: {editingUser.UserName}</h3>
          <form onSubmit={handleEditUser}>
            <input className='AdminPolja' type="text" placeholder="Korisničko ime" value={editingUser.UserName} onChange={(e) => 
            setEditingUser({ ...editingUser, UserName: e.target.value })} required/>

            <input className='AdminPolja' type="number" placeholder="Balance" value={editingUser.Balance} onChange={(e) => 
            setEditingUser({ ...editingUser, Balance: parseFloat(e.target.value) })} required/>
            
            <label>
              <input className='AdminPolja' type="checkbox" checked={editingUser.Moderator} onChange={(e) => 
              setEditingUser({ ...editingUser, Moderator: e.target.checked })}/> 
              Moderator
            </label>
            <button id='AdminBtns' type="submit">Sačuvaj promene</button>
            <button id='AdminBtns' onClick={() => setEditingUser(null)}>Odustani</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default AdminDashboardUsers;
