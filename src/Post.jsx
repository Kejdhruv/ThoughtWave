import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import "./Post.css";

function getLoggedInUser() {
  const user = localStorage.getItem('loggedInUser');
  return user ? JSON.parse(user) : null;
}

function Post() {
  const topic = useParams() ; 
  const [user, setUser] = useState(null);
  const [data, setData] = useState([]);
  const [topics, setTopics] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const [Data2, setData2] = useState([]);
  const [Name, setName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(''); // To manage modal visibility

  useEffect(() => {
    const user = getLoggedInUser();
    if (!user) {
      navigate('/UserLogin'); // Redirect to login page if no user is logged in
    } else {
      setUser(user); // Set user state if logged in
    }
  }, [navigate]);
 
  // Fetch blog posts data
  useEffect(() => {
    const fetchData1 = async () => {
      const url1 = `http://localhost:5602/Post`;
      try {
        const response = await fetch(url1);
        const responseData = await response.json();
        // Sort the posts by createdAt in descending order
        const sortedData = responseData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setData(sortedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData1();
  }, [location.pathname]);

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
  }, [location.pathname]);

  // Set the user state based on localStorage
  useEffect(() => {
    const loggedInUser = getLoggedInUser();
    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, []);

  // Handle Profile link click
  const handleProfileClick = () => {
    if (!user) {
      navigate('/UserLogin'); // Navigate to Login if no user is logged in
    } else {
      navigate(`/LoggedUser/Profile/${user._id}`); // Navigate to Profile if the user is logged in
    }
  };

  const handleHomeClick = () => {
    if (!user) {
      navigate('/UserLogin'); // Navigate to Login if no user is logged in
    } else {
      navigate(`/Homepage/${user._id}`); // Navigate to Profile if the user is logged in
    }
  };

  const handleSearchChange = (event) => {
    const fullName = event.target.value;
    const firstName = fullName.split(' ')[0]; // Get the first name from the full name
    setName(firstName); // Update the Name state with the search input
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
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
  const handleSignOut = () => {
    // Clear the logged-in user from localStorage
    localStorage.removeItem('loggedInUser');
  
    // Redirect to UserLogin page
    navigate('/UserLogin');
  };

  return (
    <div className="container1">
      {/* Navbar */}
      <div className="navbar1">
        {/* Search Section */}
        <div className="navbar-search1">
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              className="navbar-search-input1"
              placeholder="&#128269; Search User .."
              value={Name}
              onChange={handleSearchChange} // Handle input change
            />
            <span className="navbar-search-icon1">&#8594;</span> {/* Magnifying glass icon */}
          </form>
        </div>

        {/* Links */}
        <div className="navbar-links1">
          <button className="navbar-home-link1" onClick={handleHomeClick}>Home</button>
          <button className="navbar-profile-link1" onClick={handleProfileClick}>Profile</button>
          <button className="navbar-profile-link1" onClick={handleSignOut}> Sign Out </button> {/* Profile button */}
        </div>
      </div>

      {/* Blog Posts Section */}
      <div className='section2'>
        <div className="blog-title1">
          <h1>WorldWide Blog</h1>
          <div className="blog-title-underline1"></div>
        </div>
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
                <span>&#8599;</span> {/* Right arrow */}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for search results */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal" onClick={handleCloseModal}>
              &times;
            </button>
            <h2 className='h289'>Search Result for {Name}</h2>
            <ul className="ul3">
              {Data2.map((user, index) => (
                <li key={index} className="user-card">
                  <Link to={`/User/${user.Username}`} >
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

export default Post;











