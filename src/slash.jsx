import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './slash.css';

function Slash() {
    const [data1, setData1] = useState([]); 

    useEffect(() => {
        const fetchData1 = async () => {
            const url1 = "http://localhost:5602/Post";
            try {
                const response = await fetch(url1);
                const responseData = await response.json();
                // Sort the posts by number of likes
                const sortedData = responseData.sort((a, b) => b.Like.length - a.Like.length);
                setData1(sortedData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData1();
    }, []);  

    // Get the top post with the most likes
    const topPost = data1[0] || {};

    return (
        <div className="slash-container">
            {/* Navbar Wrapper */}
            <div className="slash-navbar-wrapper">
                <nav className="slash-navbar">
                    <div className="slash-logo">
                        <h1>ThoughtWave</h1>
                    </div>
                    <div className="slash-nav-links">
                        <Link to="/Blogs" className="slash-nav-link">View Blogs</Link>
                        <Link to="/UserLogin" className="slash-nav-link">Sign In</Link>
                    </div>
                </nav>
            </div>

            {/* Background Image with Blurry Effect */}
            

            {/* Optional Overlay (Darkens the background further) */}
            <div className="slash-overlay"></div>

            {/* Content inside Background */}
            <div className="slash-content">
                {/* Quote and Top Post Section */}
                <div className="slash-main-content">
                    {/* Top Post */}
                    {topPost.IMG && topPost.title && (
                        <div className="slash-top-post">
                             <h2 className="slash-top-post-title">Most Liked Blog </h2>
                            <img src={topPost.IMG} alt={topPost.title} className="slash-top-post-image" />
                            <h2 className="slash-top-post-title">{topPost.title}</h2>
                        </div>
                    )}
                  <div  className="slash-quote-section">
                    {/* Quote Section */}
                    <div >
                        <blockquote>
                            "The only limit to our realization of tomorrow is our doubts of today." - Franklin D. Roosevelt
                        </blockquote>
                    </div>
                    <div className="slash-cta-section">
                    <h3>Join us and start blogging today!</h3>
                    <Link to="/UserRegisteration" className="slash-cta-btn">Create Account</Link>
                </div>
                </div>
                </div>

                {/* Call to Action Section */}
               
            </div>
            
        </div>
    );
}

export default Slash;





