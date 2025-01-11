import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link, Navigate } from 'react-router-dom';
import './LoggedinUsr.css'; // Import your CSS for styling

// Function to get logged-in user from localStorage
function getLoggedInUser() {
  const user = localStorage.getItem('loggedInUser');
  return user ? JSON.parse(user) : null;
}

function UserProfile() {
  const [user, setUser] = useState(null);
  const { Username } = useParams();
  const [data1, setData1] = useState(null);
  const [data2, setData2] = useState([]); // User posts
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const location = useLocation();
  const [isFollowing, setIsFollowing] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const loggedInUser = getLoggedInUser();
    if (!loggedInUser) {
      return <Navigate to='/UserLogin' />;
    } else {
      setUser(loggedInUser);
    }
  }, []);

  // Fetch user profile data
  useEffect(() => {
    if (!user) return; // Prevent fetching if no user is set

    const fetchData1 = async () => {
      const url1 = `http://localhost:5602/User/${Username}`;
      try {
        const response = await fetch(url1);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const responseData1 = await response.json();
        setData1(responseData1);
        setLoading(false);
        setIsFollowing(responseData1.Followers.includes(user.Username)); // Check if following
      } catch (error) {
        setError('Failed to load data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchData1();
  }, [Username, user]);

  // Fetch user posts
  useEffect(() => {
    if (!data1) return; // Prevent fetching posts if data1 is not available

    const fetchData2 = async () => {
      const url2 = `http://localhost:5602/Post/PostsUser/${data1._id}`;
      try {
        const response = await fetch(url2);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const responseData2 = await response.json();
        setData2(responseData2);
        setLoading(false);
      } catch (error) {
        setError('Failed to load posts. Please try again later.');
        setLoading(false);
      }
    };

    fetchData2();
  }, [data1]);

  // Redirect if user views their own profile
  if (user && data1 && user._id === data1._id) {
    return <Navigate to={`/LoggedUser/Profile/${user._id}`} />;
  }

  // Follow/Unfollow handler
  const handleFollow = async (e) => {
    e.preventDefault();
    setError('');

    const action = isFollowing ? 'unfollow' : 'follow';
    try {
      // Update profile user's followers
      const response1 = await fetch(`http://localhost:5602/User/UsrFollowUnfollow/${data1._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user.Username, action }),
      });

      if (!response1.ok) throw new Error('Failed to update profile user follow status');

      // Update logged-in user's following list
      const response2 = await fetch(`http://localhost:5602/User/UsrFollowingUnfollowing/${user._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: data1.Username, action }),
      });

      if (!response2.ok) throw new Error('Failed to update logged-in user following status');

      setIsFollowing(action === 'follow'); // Update the following state
      alert(`${action === 'follow' ? 'Followed' : 'Unfollowed'} successfully!`);
    } catch (error) {
      setError(`Error: ${error.message}`);
    }
  };

  // Show loading message
  if (loading) {
    return <div className="loading-message">Loading...</div>;
  }

  // Display error message if there's an error
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  const defaultProfileImage = "https://t3.ftcdn.net/jpg/00/64/67/80/360_F_64678017_zUpiZFjj04cnLri7oADnyMH0XBYyQghG.jpg" ;
  const defaultbackgroundImage = "https://thingscareerrelated.com/wp-content/uploads/2021/10/default-background-image.png?w=862" ;
  // Ensure data is available and is an object before rendering
  return (
    <div className='Home-Container'>
    <div className="user-page-container1">
      <div className="user-content-wrapper2">
        {/* Profile Header */}
        <div className="user-profile-header">
          <div
            className="cover-image"
            style={{ backgroundImage: `url(${data1.IMG2 || defaultbackgroundImage })` }}
          ></div>
          <div className="profile-image-container">
            <img src={data1.IMG1 || defaultProfileImage} alt={data1.Name} className="profile-image" />
          </div>
        </div>

        {/* User Info Section */}
        <div className="user-info-section3">
          <div className="user-details-container4">
            <h1 className="user-title4">{data1.FirstName} {data1.LastName}</h1>
            <div className="followers-following">
              <span><strong>Followers:</strong> {data1.Followers.length}</span>
              <span><strong>Following:</strong> {data1.Following.length}</span>
              <span>
                <button className='editpfbtn' onClick={handleFollow}>
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </button>
              </span>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="user-about-section">
          <h2>About {data1.FirstName}</h2>
          <p>{data1.About}</p>
        </div>

        {/* User Blogs Section */}
        <div className="user-blogs-section">
          <h2>Work by {data1.FirstName}</h2>
          <div className="user-blog-cards">
            {data2.map((post, index) => (
              <div key={index} className="user-blog-card">
                <Link to={`/Blogpage/${post._id}`} className="user-blog-card-link">
                  <div
                    className="user-blog-image"
                    style={{
                      backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.7)), url(${post.IMG})`
                    }} >
                    <div className="user-blog-title-box">
                      <h2>{post.title}</h2>
                    </div>
                    <div className="user-blog-category-box">
                      <p>{post.Topic}</p>
                    </div>
                  </div>
                </Link>
                <Link to={`/Blogpage/${post._id}`} className="arrow-box-icon">
                  <span>&#8599;</span> {/* Right arrow */}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>  </div>
  );
}

export default UserProfile;








