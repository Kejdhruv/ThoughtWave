import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './useredit.css';
import { FiEye, FiEyeOff } from 'react-icons/fi';  // Adding eye icon library

function getLoggedInUser() {
  const user = localStorage.getItem('loggedInUser');
  return user ? JSON.parse(user) : null;
}

function UserProfileEdit() {
  const [User, setUser] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = getLoggedInUser();
    if (!loggedInUser) {
      navigate('/login');
    } else {
      setUser(loggedInUser);
    }
  }, [navigate]);

  const [userData, setUserData] = useState({
    FirstName: '',
    LastName: '',
    Password: '',
    Email: '',
    IMG1: '',
    IMG2: '',
    Contact: '',
    About: '' 
  });

  useEffect(() => {
    if (User) {
      setUserData({
        FirstName: User.FirstName || '',
        LastName: User.LastName || '',
        Password: User.Password || '',
        Email: User.Email || '',
        IMG1: User.IMG1 || 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg',
        IMG2: User.IMG2 || 'https://media.licdn.com/dms/image/v2/D5616AQGI27myPwZtPg/profile-displaybackgroundimage-shrink_200_800/profile-displaybackgroundimage-shrink_200_800/0/1689485960895?e=2147483647&v=beta&t=RTzQDfxtUWGuzrQh3Sus5mUj8sl0GdMIZgj2lwJ-hKk',
        Contact: User.Contact || '',
        About: User.About || ''
      });
    }
  }, [User]);

  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e, imgKey) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData((prev) => ({
          ...prev,
          [imgKey]: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch(`http://localhost:5602/User/UsrId/${User._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (!response.ok) throw new Error('Failed to update user data');

      alert('User profile updated successfully!');
    } catch (error) {
      setError(`Error: ${error.message}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    navigate('/login');
  };

  if (!User) return <p>Loading user data...</p>;

  return (
    <>
      <div className="profile-container">
        <div className="profile-edit-form">
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSubmit} className="user-form">
            <div className="form-sections">
              <div className="photo-section">
              <div className="photo-field">
  <label>Profile Image
    <button
      type="button"
      onClick={() => document.getElementById('profileImageInput').click()}
      className="plus-button"
    >
      +
    </button>
  </label>
  <input
    id="profileImageInput"
    type="file"
    accept="image/*"
    onChange={(e) => handleImageChange(e, 'IMG1')}
    style={{ display: 'none' }}
  />
  {userData.IMG1 && <img src={userData.IMG1} alt="Profile" className="profile-image-small" />}
</div>

<div className="photo-field">
  <label>Background Image
    <button
      type="button"
      onClick={() => document.getElementById('backgroundImageInput').click()}
      className="plus-button"
    >
      +
    </button>
  </label>
  <input
    id="backgroundImageInput"
    type="file"
    accept="image/*"
    onChange={(e) => handleImageChange(e, 'IMG2')}
    style={{ display: 'none' }}
  />
  {userData.IMG2 && <img src={userData.IMG2} alt="Background" className="background-image" />}
</div>
<div className="form-field3">
                  <label>About You</label>
                  <input
                    type="textarea"
                    name="About"
                    placeholder="Write about yourself"
                    value={userData.About}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="info-section">
                <div className="form-field">
                  <label>Email</label>
                  <input
                    type="email"
                    name="Email"
                    placeholder="Email"
                    value={userData.Email}
                    readOnly
                  />
                </div>

                <div className="form-field">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="FirstName"
                    placeholder="First Name"
                    value={userData.FirstName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="LastName"
                    placeholder="Last Name"
                    value={userData.LastName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Contact</label>
                  <input
                    type="text"
                    name="Contact"
                    placeholder="Contact"
                    value={userData.Contact}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Password</label>
                  <div className="password-container">
                    <input
                      type={passwordVisible ? 'text' : 'password'}
                      name="Password"
                      placeholder="Password"
                      value={userData.Password}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      onClick={handlePasswordVisibility}
                      className="password-visibility-toggle"
                    >
                      {passwordVisible ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="form-header">
              <button className="submit-button" onClick={handleSubmit}>
                &#10003; Edit Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default UserProfileEdit;




