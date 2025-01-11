import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import './Post.css';

function getLoggedInUser() {
  const user = localStorage.getItem('loggedInUser');
  return user ? JSON.parse(user) : null;
}

function TopicPage() {
  const { Topic } = useParams(); // Destructure to get topic from URL
  const [user, setUser] = useState(null);
  const [data, setData] = useState([]);
  const [topics, setTopics] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const [Data2, setData2] = useState([]);
  const [Name, setName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');

  useEffect(() => {
    const user = getLoggedInUser();
    if (!user) {
      navigate('/UserLogin');
    } else {
      setUser(user);
    }
  }, [navigate]);

  // Fetch blog posts data
  useEffect(() => {
    if (Topic) {
      const fetchData1 = async () => {
        const url1 = `http://localhost:5602/Post/${Topic}`;
        try {
          const response = await fetch(url1);
          const responseData = await response.json();
          const sortedData = responseData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setData(sortedData);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchData1();
    }
  }, [Topic]); // Fetch data only when topic changes

  // Fetch user data based on Name search input
  useEffect(() => {
    if (Name) {
      const fetchData3 = async () => {
        const url3 = `http://localhost:5602/Post/PostsUsers/${Name}`;
        try {
          const response3 = await fetch(url3);
          const responseData3 = await response3.json();
          setData2(responseData3);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchData3();
    }
  }, [Name]);

  // Fetch topics data
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
  }, [Topic]); // Fetch topics whenever topic changes

  // Handle Profile and Home button clicks
  const handleProfileClick = () => {
    if (!user) {
      navigate('/UserLogin');
    } else {
      navigate(`/LoggedUser/Profile/${user._id}`);
    }
  };

  const handleHomeClick = () => {
    if (!user) {
      navigate('/UserLogin');
    } else {
      navigate(`/Homepage/${user._id}`);
    }
  };

  const handleSearchChange = (event) => {
    const fullName = event.target.value;
    const firstName = fullName.split(' ')[0]; // Get the first name from the full name
    setName(firstName);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (Name) {
      setIsModalOpen(true);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('loggedInUser');
    navigate('/UserLogin');
  };

  return (
    <div className="container1">
      {/* Navbar */}
      <div className="navbar1">
        <div className="navbar-search1">
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              className="navbar-search-input1"
              placeholder="&#128269; Search User .."
              value={Name}
              onChange={handleSearchChange}
            />
            <span className="navbar-search-icon1">&#8594;</span>
          </form>
        </div>
        <div className="navbar-links1">
          <button className="navbar-home-link1" onClick={handleHomeClick}>Home</button>
          <button className="navbar-profile-link1" onClick={handleProfileClick}>Profile</button>
          <button className="navbar-profile-link1" onClick={handleSignOut}>Sign Out</button>
        </div>
      </div>

      {/* Blog Posts Section */}
      <div className='section2'>
  <div className="blog-title1">
    <h1>Search Result for {Topic}</h1>
    <div className="blog-title-underline1"></div>
  </div>

  {/* Check if there are no posts in 'data' */}
  {data.length > 0 ? (
    <div className="blog-cards1">
      {data.map((post, index) => (
        <div key={index} className="blog-card1">
          <Link to={`/Blogpage/${post._id}`} className="blog-card-link1">
            <div className="blog-image1" style={{
              backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.7)), url(${post.IMG})`,
            }}>
              <div className="blog-title-box1">
                <h2>{post.title}</h2>
              </div>
              <div className="blog-category-box1">
                <p>{post.Topic}</p>
              </div>
            </div>
          </Link>
          <Link to={`/Blogpage/${post._id}`} className="arrow-box-icon1">
            <span>&#8599;</span>
          </Link>
        </div>
      ))}
    </div>
  ) : (
    <div className="no-posts-message">
      <p>No posts available for this topic.</p> {/* Message when no posts are available */}
    </div>
  )}
</div>


      {/* Modal for search results */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal" onClick={() => setIsModalOpen(false)}>
              &times;
            </button>
            <h2 className='h289'>Search Result for {Name}</h2>
            <ul className="ul3">
              {Data2.map((user, index) => (
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
  );
}

export default TopicPage;
