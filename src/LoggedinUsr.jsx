import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link, Navigate, useNavigate } from 'react-router-dom';
import './LoggedinUsr.css'; // Import your CSS for styling
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon component
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
function getLoggedInUser() {
  const user = localStorage.getItem('loggedInUser');
  return user ? JSON.parse(user) : null;
}

function LoggedinUsr() {
  const [user, setUser] = useState(null);
  const { _id } = useParams(); // Extract dynamic URL parameter (_id)
  const [data1, setData1] = useState(null);
  const [data2, setData2] = useState([]); // State for the fetched data
  const [error, setError] = useState(null); // Error state for handling errors
  const [loading, setLoading] = useState(true); // Loading state
  const location = useLocation();
  const [data3, setData3] = useState([]); // Following data
  const [data4, setData4] = useState([]); // Followers data
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false); // To manage modal visibility
  const [modalType, setModalType] = useState(''); // To determine whether to show followers or following

  useEffect(() => {
    const user = getLoggedInUser();
    if (!user) {
      navigate('/UserLogin'); // Redirect to login page if no user is logged in
    } else {
      setUser(user); // Set user state if logged in
    }
  }, [navigate]);

  // Fetch user details
  useEffect(() => {
    const fetchData1 = async () => {
      const url1 = `http://localhost:5602/User/UsrId/${_id}`;
      try {
        const response = await fetch(url1);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const responseData = await response.json();
        setData1(responseData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again later.');
        setLoading(false);
      }
    };
    fetchData1();
  }, [_id, location.pathname]);

  // Fetch posts by the user
  useEffect(() => {
    const fetchData2 = async () => {
      const url2 = `http://localhost:5602/Post/PostsUser/${_id}`;
      try {
        const response = await fetch(url2);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const responseData = await response.json();
        setData2(responseData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again later.');
        setLoading(false);
      }
    };
    fetchData2();
  }, [_id, location.pathname]);

  // Fetch Following list
  useEffect(() => {
    const fetchData3 = async () => {
      const url3 = `http://localhost:5602/User/Following/${data1?.Username}`;
      try {
        const response = await fetch(url3);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const responseData3 = await response.json();
        setData3(responseData3);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again later.');
      }
    };
    if (data1?.Username) fetchData3();
  }, [data1?.Username]);

  // Fetch Followers list
  useEffect(() => {
    const fetchData4 = async () => {
      const url4 = `http://localhost:5602/User/Followers/${data1?.Username}`;
      try {
        const response = await fetch(url4);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const responseData4 = await response.json();
        setData4(responseData4);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again later.');
      }
    };
    if (data1?.Username) fetchData4();
  }, [data1?.Username]);

  // Show loading message while waiting for data
  if (loading) {
    return <div className="loading-message">Loading...</div>;
  }

  // Display error message if there's an error
  if (error) {
    return <div className="error-message">{error}</div>;
  }

  // Handle opening and closing the modal
  const handleOpenModal = (type) => {
    setModalType(type); // Set type to 'followers' or 'following'
    setIsModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  // Delete post function
  const handleDeletePost = (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      // Make the delete API call
      fetch(`http://localhost:5602/Post/Posts/${postId}`, {
        method: 'DELETE',
      })
      .then((response) => {
        if (response.ok) {
          // After successful deletion, remove the post from the state
          setData2(data2.filter(post => post._id !== postId));
          alert('Post deleted successfully!');
        } else {
          alert('Failed to delete post. Please try again.');
        }
      })
      .catch((error) => {
        console.error('Error deleting post:', error);
        alert('An error occurred while deleting the post.');
      });
    }
  };

  const defaultProfileImage = "https://t3.ftcdn.net/jpg/00/64/67/80/360_F_64678017_zUpiZFjj04cnLri7oADnyMH0XBYyQghG.jpg";
  const defaultbackgroundImage = "https://thingscareerrelated.com/wp-content/uploads/2021/10/default-background-image.png?w=862";

  return (
    <div className='Home-Container'>
      <div className="user-page-container1">
        <div className="user-content-wrapper2">
          {/* Profile Header */}
          <div className="user-profile-header">
            <div
              className="cover-image"
              style={{ backgroundImage: `url(${data1.IMG2 || defaultbackgroundImage})` }}
            ></div>
            <div className="profile-image-container">
              <img src={data1.IMG1 || defaultProfileImage} alt={data1.Name} className="profile-image" />
            </div>
          </div>

          {/* User Info Section */}
          <div className="user-info-section3">
            <div className="user-details-container4">
              <h1 className="user-title4">
                {data1.FirstName} {data1.LastName}
              </h1>
              <div className="followers-following">
                <span onClick={() => handleOpenModal('followers')}>
                  <strong>Followers:</strong> {data1.Followers.length}
                </span>
                <span onClick={() => handleOpenModal('following')}>
                  <strong>Following:</strong> {data1.Following.length}
                </span>
                <Link to={`/UserLoggedin/UserProfile/Settings/${data1._id}`}>
                  <span>
                    <button className="editpfbtn">Edit Profile</button>
                  </span>
                </Link>
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
                        backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.7)), url(${post.IMG})`,
                      }}
                    >
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
                  {/* Delete Post Button */}
                  <button
                    className="delete-post-btn"
                    onClick={() => handleDeletePost(post._id)}
                  >
          <FontAwesomeIcon icon={faTrashCan} />
                  </button>
                </div>
              ))}
              {/* Add New Blog Card */}
              <div className="user-blog-card add-new-card">
                <Link to={`/postingpage/${_id}`} className="add-new-card-link">
                  <div className="add-new-card-content">
                    <div className="add-new-icon">
                      <span>+</span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Modal for Followers / Following */}
          {isModalOpen && (
            <div className="modal-overlay">
              <div className="modal-content">
                <button className="close-modal" onClick={handleCloseModal}>
                  &times;
                </button>
                <h2 className='h289'>{modalType === 'followers' ? 'Followers' : 'Following'}</h2>
                <ul className="ul3">
                  {(modalType === 'followers' ? data4 : data3).map((user, index) => (
                    <li key={index} className="user-card">
                      <Link to={`/User/${user.Username}`}>
                        <div className="user-info">
                          <img className="user-img" src={user.IMG1} alt={`${user.FirstName} ${user.LastName}`} />
                          <div className="user-details">
                            <p className="user-name2">{user.FirstName} {user.LastName}</p>
                            <p className="user-username1">@{user.Username}</p>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default LoggedinUsr;

