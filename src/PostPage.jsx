import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link , useNavigate} from 'react-router-dom';
import './PostPage.css';
import { FaThumbsUp } from 'react-icons/fa';

function getLoggedInUser() {
  const user = localStorage.getItem('loggedInUser');
  return user ? JSON.parse(user) : null;
}

function PostPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null);
  const { _id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const location = useLocation();

  // Set user state from local storage when component mounts
  useEffect(() => {
      const user = getLoggedInUser();
      if (!user) {
        navigate('/UserLogin'); // Redirect to login page if no user is logged in
      } else {
        setUser(user); // Set user state if logged in
      }
    }, [navigate]);

  // Fetch post data when the component mounts or when _id or location.pathname changes
  useEffect(() => {
    const fetchData = async () => {
      const url = `http://localhost:5602/Post/Posts/${_id}`;
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const responseData = await response.json();
        setData(responseData);
        
        // Check if the user has liked this post (based on the Like array)
        if (user && responseData.Like.includes(user.Username)) {
          setIsLiked(true);  // If the user is in the Like array, mark as liked
        } else {
          setIsLiked(false);  // Otherwise, mark as unliked
        }

        setLoading(false);
      } catch (error) {
        setError('Failed to load data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, [_id, location.pathname, user]);

  const handleLike = async (e) => {
    e.preventDefault();
    setError('');

    const action = isLiked ? 'unlike' : 'like';
    try {
      // Update the like status in the database
      const response = await fetch(`http://localhost:5602/Post/LikeUnlike/${_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user.Username, action }),
      });

      if (!response.ok) throw new Error('Failed to update like status');

      // Update the like state locally
      setIsLiked(action === 'like');
      alert(`${action === 'like' ? 'Liked' : 'Unliked'} successfully!`);
    } catch (error) {
      setError(`Error: ${error.message}`);
    }
  };

  if (loading) {
    return <div className="loading-message">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (data && typeof data === 'object') {
    return (
      <div className="Home-Container">
        <div className="blog-page-container1">
          <div className="blog-content-wrapper2">
            <div className="blog-info-section3">
              <div className="blog-image-container1">
                <img src={data.IMG} alt={data.title} className="blog-image1" />
              </div>
              <div className="blog-details-container4">
                <p className="blog-topic6">
                  <h1 className="blog-title4">{data.title}</h1>
                  <strong>Topic: {data.Topic}</strong>
                </p>
                <div className="like-button-container">
                  <button
                    className={`like-button ${isLiked ? 'liked' : ''}`}
                    onClick={handleLike}
                  >
                    <FaThumbsUp className="thumb-icon" />
                  </button> 
                  <p className='LikesNumber'>{data.Like.length}</p>
                </div>
                <p className="blog-author">
                  <Link to={`/User/${data.Username}`}>
                    <strong className="blog-author">By @{data.Username}</strong>
                  </Link>
                </p>
              </div>
            </div>

            <div className="blog-details-section2">
              {data.content ? (
                Array.isArray(data.content) ? (
                  <ul>
                    {data.content.map((post, index) => (
                      <li key={index}>
                        <div>
                          <h3>{post.subheading}</h3>
                          <p>{post.text}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div>
                    <h3>{data.content.subheading}</h3>
                    <p>{data.content.text}</p>
                  </div>
                )
              ) : (
                <p>No content available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <div>Data not available</div>;
}

export default PostPage;



