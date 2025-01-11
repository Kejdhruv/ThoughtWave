import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './postingpage.css';
function getLoggedInUser() {
  const user = localStorage.getItem('loggedInUser');
  return user ? JSON.parse(user) : null;
}
function Postingpage() {
  const [user , setUser] = useState(null)
  const { _id } = useParams(); 
  const [Topics , setTopics] = useState([]); // Make sure _id is extracted from URL params as a string
  const [Post, setPost] = useState({
    title: "",
    Topic: "",
    content: [],
    IMG: "",  // Base64 image string
    UID: _id,  // UID passed as string
    createdAt: new Date().toISOString(),  
    Like: [] ,
  });

  const navigate = useNavigate()
  
    useEffect(() => {
           const user = getLoggedInUser();
           if (!user) {
             navigate('/UserLogin'); // Redirect to login page if no user is logged in
           } else {
             setUser(user); // Set user state if logged in
           }
         }, [navigate]);
  const [newContent, setNewContent] = useState({ subheading: "", text: "" });
  const [error, setError] = useState('');
  const [image, setImage] = useState(null);  // For Image upload
 

  const handlePost = (e) => {
    const { name, value } = e.target;
    setPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleContent = (e) => {
    const { name, value } = e.target;
    setNewContent((prev) => ({ ...prev, [name]: value }));
  };

  const addContent = () => {
    if (newContent.subheading && newContent.text.trim().length > 0) {
      setPost((prev) => ({
        ...prev,
        content: [...prev.content, newContent],
      }));
      setNewContent({ subheading: "", text: "" });
    } else {
      setError('Please fill in the content fields correctly.');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setImage(reader.result);  // Set Base64 string as image
            console.log("Image Base64:", reader.result);  // Log the image
        };
        reader.readAsDataURL(file);
    }
  };

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

  useEffect(() => {
    // When the image changes, update the Post state
    if (image) {
        setPost((prev) => ({ ...prev, IMG: image }));
    }
  }, [image]);  // Trigger whenever 'image' changes

  const handlePostComplete = async (e) => {
    e.preventDefault();
    const responseData = [Post]; // Prepare data to send to server

    // Ensure image is set before submission
    console.log("Final Post with Image:", Post);  // Log Post before sending it

    try {
        const response = await fetch('http://localhost:5602/Post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(responseData),  // Send the post data with Base64 image
        });

        if (!response.ok) {
            throw new Error('Failed to post blog');
        }

        alert('Blog posted successfully');
        navigate('/Blogs');  // Redirect after successful submission
    } catch (error) {
        setError(error.message);
    }
  };

  return (
    <div className="post-form-container">
      <div className="post-form">
        <h1 className="heading">Create your Blog</h1>
        <form onSubmit={handlePostComplete} className='postform'>
          {error && <p className="error-message">{error}</p>}

          <input
            type="text"
            name="title"
            placeholder="Title of the Blog"
            onChange={handlePost}
            required
            className="input-field"
          />
       <select
  name="Topic"
  onChange={handlePost}
  required
  className="input-field dropdown"
  value={Post.Topic}
>
  <option value="" disabled>Select Topic</option>
  {Topics.map((topic) => (
    <option key={topic._id} value={topic.Topic}>
      {topic.Topic}
    </option>
  ))}
</select>

          <div className="content-section">
            <h3 className="heading2">Content </h3>
            <input
              type="text"
              name="subheading"
              placeholder="Subheading"
              value={newContent.subheading}
              onChange={handleContent}
              required
              className="input-field"
            />
            <textarea
              name="text"
              placeholder="Your Words"
              value={newContent.text}
              onChange={handleContent}
              required
              className="textarea-field"
            />
            <button type="button" onClick={addContent} className="add-button">
              Upload the Content 
            </button>
          </div>

          {/* Image Upload Section */}
          <div className="image-upload-section">
            <button 
              type="button" 
              className="upload-button" 
              onClick={() => document.getElementById('imageInput').click()} >
              Upload Image
            </button>
            <input
              id="imageInput"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="file-input"
              style={{ display: 'none' }} // Hide the default file input
            />
            {image && <p className="image-selected">Image selected</p>}
          </div>

          <button type="submit" className="submit-button">
            Post Your Blog
          </button>
        </form>
      </div>

      <div className="post-preview">
        <h2 className="heading3">Blog Preview</h2>
        <div className="preview-card">
          <p><strong>Title:</strong> {Post.title}</p>
          <p><strong>Topic:</strong> {Post.Topic}</p>
          {Post.IMG && <img src={Post.IMG} alt="Uploaded" className="preview-image" />}
          <h3>Content:</h3>
          <ul className="content-list">
            {Post.content.map((con, index) => (
              <li key={index} className="content-item">
                <h4>{con.subheading}</h4>
                <p>{con.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Postingpage;




