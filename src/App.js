import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React, { useState } from 'react';
import Navbar from './Layout/Navbar';
import Footer from './Layout/Footer';
import Landing from './Layout/Landing';
import Register from './components/auth/Register';
import Login from './components/Login';
import LandingChoice from './components/LandingChoice';
import AdminNavbar from './components/navbars/AdminNavbar';
import UserNavbar from './components/navbars/UserNavbar';
import ModeratorNavbar from './components/navbars/ModeratorNavbar';
import Sport from './components/Sport';
import NapraviTiket from './components/NapraviTiket.js';
import Ticket from './components/Ticket.js';
import AdminDashboard from './components/AdminDashboard.js';
import AdminDashboardUsers from './components/AdminDashboardUsers.js';
import AdminDashboardUtakmice from './components/AdminDashboardUtakmice.js';
import ModeratorDashboard from './components/ModeratorDashboard.js';
import Odigrano from './components/Odigrano.js';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
  // State for managing user role, user data, and balance
  const [userRole, setUserRole] = useState(null);
  const [userData, setUserData] = useState({});
  const [balance, setBalance] = useState(0);

  // Update the user balance globally
  const updateUserBalance = (newBalance) => {
    setBalance(newBalance);
  };

  // Determine which Navbar to display based on user role
  let NavbarComponent;
  switch (userRole) {
    case 'moderator':
      NavbarComponent = ModeratorNavbar;
      break;
    case 'admin':
      NavbarComponent = AdminNavbar;
      break;
    case 'user':
      NavbarComponent = UserNavbar;
      break;
    default:
      NavbarComponent = Navbar;
      break;
  }

  // Handle user logout by resetting state and navigating to the home page
const handleLogout = (navigate) => {
    // Reset user data to default values
    setUserRole(null);
    setUserData({});
    setBalance(0);  

    // Navigate to home page and replace current history entry
    navigate('/', { replace: true });

    // Set timeout to ensure navigation completes before manipulating history stack
    setTimeout(() => {
        // Replace history entry with home page to clear previous history
        navigate('/', { replace: true });

        // Push a new state for the home page to override any previous entries
        window.history.pushState(null, '', '/');

        // Disable the back button by preventing backward navigation
        window.onpopstate = function () {
            window.history.go(1); // Forces forward navigation to prevent going back
        };
    }, 100);
};

  // Handle user data and balance updates
  const handleUserData = (userInfo) => {
    setUserData(userInfo);
    if (userInfo.balance !== undefined) {
      setBalance(userInfo.balance); // Update balance if provided
    }
  };

  return (
    <Router>
      {/* Render the appropriate Navbar based on the user role */}
      <NavbarComponent userData={userData} onLogout={handleLogout} balance={balance} />
      
      {/* Define the different routes and their corresponding components */}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setUserRole={setUserRole} setUserData={handleUserData} />} />
        <Route path="/landingChoice" element={<LandingChoice />} />
        <Route path="/sport" element={<Sport />} />
        <Route path="/tiket" element={<NapraviTiket balance={balance} updateUserBalance={updateUserBalance} />} />
        <Route path="/ticket" element={<Ticket />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/AdminDashboardUsers" element={<AdminDashboardUsers />} />
        <Route path="/AdminDashboardUtakmice" element={<AdminDashboardUtakmice />} />
        <Route path="/ModeratorDashboard" element={<ModeratorDashboard />} />
        <Route path="/odigrano" element={<Odigrano userData={userData} />} />
      </Routes>

      {/* Footer component */}
      <Footer />
    </Router>
  );
}

export default App;

