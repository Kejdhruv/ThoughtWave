import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const [FirstName, setFirstName] = useState('');
  const [LastName, setLastName] = useState('');
  const [Username, setUsername] = useState('');
  const [Email, setEmailid] = useState('');
  const [Password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [Data1, setData1] = useState([]);
  const navigate = useNavigate();

  const handleEmailChange = (event) => setEmailid(event.target.value);
  const handleFirstNameChange = (event) => setFirstName(event.target.value);
  const handleLastNameChange = (event) => setLastName(event.target.value);
  const handleUsernameChange = (event) => setUsername(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5602/User");
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const responseData = await response.json();
        setData1(responseData);
      } catch (error) {
        console.error("Fetch error:", error);
        setError('Error fetching data: ' + error.message);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if username or email already exists in the data1
    const usernameExists = Data1.some(user => user.Username === Username);
    const emailExists = Data1.some(user => user.Email === Email);

    if (usernameExists) {
      setError("Username is already taken. Please choose a different one.");
      return;
    }

    if (emailExists) {
      setError("Email is already registered. Please use a different email.");
      return;
    }

    const newData = {
      FirstName,
      Username,
      Password,
      LastName,
      Email,
      Followers: [],
      Following: [],
      IMG1: "https://img.freepik.com/premium-vector/silver-membership-icon-default-avatar-profile-icon-membership-icon-social-media-user-image-vector-illustration_561158-4215.jpg?semt=ais_hybrid"
    };

    const dataToSend = [newData]; // Maintain your original data format

    try {
      const response = await fetch(`http://localhost:5602/User`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error(`Failed to Register: ${response.statusText}`);
      }

      // Navigate to the login page after successful registration
      navigate("/UserLogin"); // Update to your actual login route

    } catch (error) {
      setError(error.message);
      console.error("Error during registration:", error);
    }
  };

  return (
    <div className="Overall1">
      <div className="Login-Info">
        <div className="login-header">Welcome </div>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group loginbox">
            <input
              type="text"
              id="FirstName"
              required
              value={FirstName}
              className="custom-email input-field"
              onChange={handleFirstNameChange}
              placeholder=" "
            />
            <label htmlFor="FirstName" className="custom-label">First Name</label>
          </div>

          <div className="input-group loginbox">
            <input
              type="text"
              id="LastName"
              required
              value={LastName}
              className="custom-email input-field"
              onChange={handleLastNameChange}
              placeholder=" "
            />
            <label htmlFor="LastName" className="custom-label">Last Name</label>
          </div>

          <div className="input-group loginbox">
            <input
              type="text"
              id="Username"
              required
              value={Username}
              className="custom-email input-field"
              onChange={handleUsernameChange}
              placeholder=""
            />
            <label htmlFor="Username" className="custom-label">Username</label>
          </div>

          <div className="input-group loginbox">
            <input
              type="email"
              id="Email"
              required
              value={Email}
              className="custom-email input-field"
              onChange={handleEmailChange}
              placeholder="  "
            />
            <label htmlFor="Email" className="custom-label">Email</label>
          </div>

          <div className="input-group loginbox">
            <input
              type="password"
              id="Password"
              required
              value={Password}
              className="custom-password input-field"
              onChange={handlePasswordChange}
              placeholder=""
            />
            <label htmlFor="Password" className="custom-label">Password</label>
          </div>

          <button type="submit" className="btxxnnnnn">Register</button>
        </form>
      </div>
    </div>
  );
}

export default Register;
