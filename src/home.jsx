import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import './home.css';

function getLoggedInUser() {
  const user = localStorage.getItem('loggedInUser');
  return user ? JSON.parse(user) : null;
}

function Home() {
  const [user, setUser] = useState(null);
  const { _id } = useParams();
  const [Data1, setData1] = useState([]);
  const [Data2, setData2] = useState([]);
  const [Error, setError] = useState(null);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [Data3, setData3] = useState([]);
  const [Name, setName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const navigate = useNavigate()

  useEffect(() => {
         const user = getLoggedInUser();
         if (!user) {
           navigate('/UserLogin'); // Redirect to login page if no user is logged in
         } else {
           setUser(user); // Set user state if logged in
         }
       }, [navigate]);

  useEffect(() => {
    const fetchData1 = async () => {
      if (!user || !user.Username) return;
      const url1 = `http://localhost:5602/User/Following/${user.Username}`;
      try {
        const response = await fetch(url1);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const responseData4 = await response.json();
        setData1(responseData4);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again later.');
      }
    };
    if (user && user.Username) fetchData1();
  }, [user]);

  useEffect(() => {
    const fetchData2 = async () => {
      if (Data1.length === 0) return;
      const allPosts = [];
      const postPromises = Data1.map(async (follower) => {
        const currentUserId = follower._id;
        const url2 = `http://localhost:5602/Post/PostsUser/${currentUserId}`;
        try {
          const response = await fetch(url2);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const responseData = await response.json();
          allPosts.push(...responseData);
        } catch (error) {
          console.error('Error fetching posts for user:', currentUserId, error);
        }
      });
      await Promise.all(postPromises);
      allPosts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      setData2(allPosts);
      setLoading(false);
    };

    fetchData2();
  }, [Data1]);

  useEffect(() => {
    if (Name) {
      const fetchData3 = async () => {
        const url3 = `http://localhost:5602/Post/PostsUsers/${Name}`;
        try {
          const response3 = await fetch(url3);
          const responseData3 = await response3.json();
          setData3(responseData3);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchData3();
    }
  }, [Name]);

  useEffect(() => {
    const fetchData2 = async () => {
      const url2 = "http://localhost:5602/Topics";
      try {
        const response = await fetch(url2);
        const responseData = await response.json();
        setTopics(responseData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData2();
  }, []);

  const handleSearchChange = (event) => {
    const fullName = event.target.value;
    const firstName = fullName.split(' ')[0]; // Get the first name from the full name
    setName(firstName); // Update the Name state with the search input
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission
    if (Name) {
      setIsModalOpen(true); // Open the modal when the search is submitted
    }
  };

  const handleOpenModal = (type) => {
    setModalType(type); // Set the type to 'followers' or 'following'
    setIsModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  return (
    <div className="home-container">
      <div className="content-section">
        {loading ? (
          <div className="loading-indicator">Loading...</div>
        ) : Error ? (
          <p className="error-message">{Error}</p>
        ) : (
          <>
            <h2 className="section-title">Welcome {user.FirstName}</h2>
            {Data2.length > 0 ? (
              <div className="post-list">
                {Data2.map((post, index) => (
                  <Link to={`/Blogpage/${post._id}`}>
                    <div key={index} className="post-card">
                      <div className="post-body">
                        <div className="post-image-container">
                          <img src={post.IMG} alt="Post" className="post-image" />
                        </div>
                        <div className="post-description">
                          <div className="post-header">
                            <h3 className="post-title">{post.title}</h3>
                            <span className="post-topic">{post.Topic || 'General'}</span>
                          </div>
                          <p>{post.content[0].text || 'No description available.'}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="no-posts">No posts available from followed users.</p>
            )}
          </>
        )}
      </div>

      <div className="sidebar">
        <form onSubmit={handleSearchSubmit}> {/* Add form for search submission */}
          <div className="search-box">
            <input
              type="text"
              className="search-input"
              placeholder="Search User...."
              value={Name}
              onChange={handleSearchChange}
            />
            <span className="search-icon">&#8594;</span>
          </div>
        </form>

        <h3 className="sidebar-title">Browse by Categories</h3>
        <div className="category-grid34">
          {topics.map((topic, index) => (
            <Link to={`/Blog/${topic.Topic}`} key={index} className="category-item">
              <div className="category-box">
                <p>{topic.Topic}</p>
              </div>
            </Link>
          ))}
        </div>

        <h3 className="sidebar-title">Your Following</h3>
        <div className="following-list">
          {Data1.map((user, index) => (
            <Link to={`/User/${user.Username}`} key={index}>
              <div className="user-profile">
                <img className="user-avatar1" src={user.IMG1} alt={`${user.FirstName} ${user.LastName}`} />
                <div className="user-details2">
                  <p>{user.FirstName} {user.LastName}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal" onClick={handleCloseModal}>
              &times;
            </button>
            <h2 className="h289">Search Result for {Name}</h2>
            <ul className="ul3">
              {Data3.map((user, index) => (
                <li key={index} className="user-card">
                  <Link to={`/User/${user.Username}`}>
                    <div className="user-info">
                      <img
                        className="user-img"
                        src={user.IMG1}
                        alt={`${user.FirstName} ${user.LastName}`}
                      />
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
  );
}

export default Home;









