import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SDashboard = ({ token }) => {
    const navigate = useNavigate();
    const [staffData, setStaffData] = useState(null);
    const [placeBookings, setPlaceBookings] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResponse = await fetch('http://localhost:8080/api/protected', {
                    method: 'GET',
                    credentials: 'include', // Include credentials to send cookies
                });

                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    setStaffData(userData.userData);

                    // Fetch bookings associated with the staff's assigned place
                    const staffBookingsResponse = await fetch(`http://localhost:8080/api/bookings/place/${userData.userData._id}`, {
                        method: 'GET',
                        credentials: 'include',
                    });

                    if (staffBookingsResponse.ok) {
                        const bookingsData = await staffBookingsResponse.json();
                        setPlaceBookings(bookingsData);
                    } else {
                        console.error('Error fetching staff bookings:', staffBookingsResponse.statusText);
                    }
                } else {
                    navigate('/home');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                navigate('/home');
            }
        };

        if (token) {
            fetchData();
        } else {
            navigate('/home');
        }
    }, [navigate, token]);

    return (
        <div>
            <h2>Dashboard</h2>
            {staffData && (
                <div>
                    <p>Welcome, {staffData.name}</p>
                    <p>Your email is {staffData.email}</p>
                    <p>Your role is {staffData.userType}</p>
                </div>
            )}

            <h3>Your Bookings</h3>
            <div className="overflow-x-auto">
                <table className="table">
                    {/* head */}
                    <thead>
                        <tr>
                            <th>User Name</th>
                            <th>Email</th>
                            <th>Place</th>
                            <th>Aadhar</th>
                            <th>Start Slot</th>
                            <th>End Slot</th>
                            <th>Phone Number</th>
                            <th>Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        {placeBookings.map((booking, index) => (
                            <tr key={index}>
                                <td>{booking.userId.name}</td>
                                <td>{booking.userId.email}</td>
                                <td>{booking.placeId.name}</td>
                                <td>{booking.userId.aadhar}</td>
                                <td>{new Date(booking.startSlot).toLocaleString()}</td>
                                <td>{new Date(booking.endSlot).toLocaleString()}</td>
                                <td>{booking.phno}</td>
                                <td>{booking.address}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default SDashboard;