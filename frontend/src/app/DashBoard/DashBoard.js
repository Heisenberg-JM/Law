import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Make sure to import CSS for DatePicker
import './DashBoard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import {toast} from 'react-toastify';


const Header = ({ handleLogout, handleViewProfile, fetchUserBookings, userName, handleBack }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false); // State to manage dropdown visibility

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="header">
      {/* Welcome message, profile icon, and back button */}
      
        <button id="butt" className="close-btn" onClick={handleBack}>
              <h2 className="logo" id="data">
            SHE-GUARDIANS
                </h2>        
        </button>
      <div className="welcome-profile-container">
        <span className="welcome-text">Welcome, {userName}</span>
        <span className="profile-icon" onClick={toggleDropdown}>
          <FontAwesomeIcon icon={faUser} />
        </span>
        {/* Back button */}
        {/* Dropdown menu for logout and view profile */}
        <div className={`dropdown-menu ${dropdownOpen ? 'active' : ''}`}>
          <button onClick={handleLogout}>Logout</button>
          <button onClick={handleViewProfile}>View Profile</button>
          <button onClick={fetchUserBookings}>My Bookings</button>
        </div>
      </div>
    </div>

//     <div className="navbar bg-base-300 rounded-box">
// <div className="flex-1 px-2 lg:flex-none">
//   <a className="text-lg font-bold">SHE GUARDIANS</a>
// </div> 
// <div className="flex justify-end flex-1 px-2">
//   <div className="flex items-stretch">
//     {/* <a className="btn btn-ghost rounded-btn">Button</a> */}
//     <div className="dropdown dropdown-end">
//       <div tabIndex={0} role="button" className="btn btn-ghost rounded-btn">Welcome {userName}<span className="profile-icon" onClick={handleViewProfile}>
//     <FontAwesomeIcon icon={faUser} /></span></div>
//       <ul tabIndex={0} className="menu dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box w-52 mt-4">
//       <li><button onClick={handleLogout}>Logout</button></li>
//     <li><button onClick={handleViewProfile}>View Profile</button></li>
//     <li><button onClick={fetchUserBookings}>My Bookings</button></li>
//       </ul>
//     </div>
//   </div>
// </div>
// </div>
  );
};



const Dashboard = ({ token }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [places, setPlaces] = useState([]);
  const [userBookings, setUserBookings] = useState([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showPlaces, setShowPlaces] = useState(true);
  //const [usrDisplay, setUsrDisplay] = useState(true);
  const [showUsrBooking, setShowUsrBooking] = useState(true);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [phno, setPhno] = useState('');
  const [address, setAddress] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false); // State to manage dropdown visibility
  const [viewProfile, setViewProfile] = useState(false); // State to track whether to view profile or not
  
  
  useEffect(() => {

    const fetchUserData = async () => {
      try {
        const userResponse = await fetch('http://localhost:8080/api/protected', {
          method: 'GET',
          credentials: 'include',
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData.userData);
        } else {
          console.error('Error fetching user data:', userResponse.statusText);
          navigate('/home');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/home');
      }
    };

    if (token) {
      fetchUserData();
    } else {
      navigate('/home');
    }
  }, [token, navigate]); // Fetch user data when token changes


  useEffect(() => {
    
    const fetchPlacesData = async () => {
      try {
        const placesResponse = await fetch('http://localhost:8080/api/places', {
          method: 'GET',
          credentials: 'include',
        });
        if (placesResponse.ok) {
          const placesData = await placesResponse.json();
          setPlaces(placesData);
        } else {
          console.error('Error fetching places:', placesResponse.statusText);
        }
      } catch (error) {
        console.error('Error fetching places:', error);
      }
    };

    if (token) {
      fetchPlacesData();
    }
  }, [token]); // Fetch place data when token changes


  const handleBooking = (place) => {
    setShowBookingForm(true); 
    setShowPlaces(false);
    //setUsrDisplay(false);
    setShowUsrBooking(false);
    setSelectedPlace(place); // Set the selected place
  };

  const submitBooking = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:8080/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user._id,
        placeId: selectedPlace._id,
        phno,
        address,
        startSlot: startDate,
        endSlot: endDate,
      }),
      credentials: 'include',
    });

    const data = await response.json();
    if (response.ok) {
      toast.success('Booking successful, check my bookings to view')
      console.log('Booking successful:', data);
      setUserBookings([...userBookings, data]);
      setShowBookingForm(false);
      setShowPlaces(true); // Hide the booking form after successful booking
      setShowUsrBooking(true);
      
      // Reset form fields
      setStartDate(new Date());
      setEndDate(new Date());
      setPhno('');
      setAddress('');

    } else {
      toast.error(data.message)
      console.error('Error booking:', data);
    }
  };

  const fetchUserBookings = async () => {
    if (!user) return;
    try {
      const userBookingsResponse = await fetch(`http://localhost:8080/api/bookings/user/${user._id}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (userBookingsResponse.ok) {
        const userBookingsData = await userBookingsResponse.json();

        if (userBookingsData.length === 0) {
          // No bookings available
          toast.error('No bookings available for this user.');
          setShowPlaces(false); // Show the places
          setShowBookingForm(false); // Hide the booking form
          setShowUsrBooking(false); // Hide the user bookings
          setViewProfile(false);
        } else {
          // Bookings available
          setUserBookings(userBookingsData);
          setShowPlaces(false); // Hide the places
          setShowBookingForm(false); // Hide the booking form
          setShowUsrBooking(true); // Show the user bookings
          setViewProfile(false);
        }
      } else {
        console.error('Error fetching user bookings:', userBookingsResponse.statusText);
      }
    } catch (error) {
      console.error('Error fetching user bookings:', error);
    }
  };


   // Handle logout
   const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/logout', {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) {
        navigate('/home');
      } else {
        console.error('Logout failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleBack = () => {
    setShowBookingForm(false); 
    setShowPlaces(true);
    setShowUsrBooking(false);
    setViewProfile(false);
  };

  const handleViewProfile = () => {
    setViewProfile(true);
  };

  return (
    <div>
    {/* Render Header component */}
    <Header
      dropdownOpen={dropdownOpen}
      setDropdownOpen={setDropdownOpen}
      handleLogout={handleLogout}
      handleViewProfile={handleViewProfile}
      fetchUserBookings={fetchUserBookings}
      userName={user && user.name}
      handleBack={handleBack}
    />
    <br />

    {/* Conditional rendering based on viewProfile state */}
    {viewProfile ? (
      <div>
        {/* Render user details here */}
        {user && (
          <div>
            <p>Welcome, {user.name}</p>
            <p>Your email is {user.email}</p>
            <p>Your Aadhar number is {user.aadhar}</p>
          </div>
        )}
      </div>
    ) : (
      <div>
  {/* <div className="card w-96 bg-base-100 shadow-xl"> */}
  {showPlaces && <h3 id="place">Available Places</h3>} {/* Move the heading inside the condition */}
  <div className="card-body">
    <ul className="places-list">
      {showPlaces && places.map(place => (
        <li key={place._id}>
          <div>
            <figure><img src={place.Image} alt={place.name} /></figure>
            <h2 className="card-title">{place.name}</h2>
            <p className="dash">Location: {place.location}</p>
            <p className="dash">Contact: {place.contact}</p>
            <p className="dash">Slots: {place.slot}</p>
            {/* <div className="card-actions justify-end"> */}
            <button onClick={() => handleBooking(place)}>Book Now</button>
            {/* </div> */}
          </div>
        </li>
      ))}
    </ul>
  </div>
  {/* </div> */}
  {/* <ul className="places-list">
    {showPlaces && places.map(place => (
      <li key={place._id}>
        <div>
          <h4>{place.name}</h4>
          <p>Location: {place.location}</p>
          <p>Contact: {place.contact}</p>
          <img src={place.Image} alt={place.name} />
          <p>Slots: {place.slot}</p>
          <button onClick={() => handleBooking(place)}>Book Now</button>
        </div>
      </li>
    ))}
  </ul> */}
  {/* <button onClick={fetchUserBookings}>Check My Bookings</button> */}
  {showBookingForm && (
    <div>
      <h3>Booking Form</h3>
      <form onSubmit={submitBooking}>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          minDate={new Date()}
          placeholderText="Select start date"
        /><br />
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          placeholderText="Select end date"
        /><br />
        <input
          type="number"
          placeholder="Phone Number"
          value={phno}
          onChange={(e) => setPhno(e.target.value)}
          required
        /><br />
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <br />
        <button type="submit">Confirm Booking</button>
      </form>
    </div>
  )}
  <ul>
    {showUsrBooking && userBookings && userBookings.map(booking => (
      <li key={booking._id}>
        <div>
          <p>Place: {booking.placeId.name}</p>
          <p>Start Slot: {new Date(booking.startSlot).toLocaleString()}</p>
          <p>End Slot: {new Date(booking.endSlot).toLocaleString()}</p>
          <p>Phone Number: {booking.phno}</p>
          <p>Address: {booking.address}</p>
        </div>
      </li>
    ))}
  </ul>
  </div>
    )}
  </div>
  );
};

export default Dashboard;