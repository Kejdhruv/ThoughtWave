const express = require("express");
const cors = require('cors');
const dbConnect1 = require("./database1");
const dbConnect2 = require("./database2");
const dbConnect3 = require("./database3");
const dbConnect4 = require("./database4");
const dbConnect5 = require("./database5");
const dbConnect6 = require("./database6");
const dbConnect7 = require("./database7");
const dbConnect8 = require("./database8");
const dbConnect9 = require("./database9");
const dbConnect10 = require("./database10");
const dbConnect11 = require("./database11");
const dbConnect12 = require("./database12");
const dbConnect13 = require("./database13");
const dbConnect14 = require("./database14");
const dbConnect15 = require("./database15");
const dbConnect16 = require("./database16");
const dbConnect17 = require("./database17");
const dbConnect18 = require("./database18");
const PORT = 5602;

const app = express();
app.use(cors());
app.use(express.json()); 
app.use(express.json({ limit: '20mb' }));  // Increase the limit as per your requirement
app.use(express.urlencoded({ limit: '20mb', extended: true }));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
app.get('/User', async (req, res) => {
    try {
        const data = await dbConnect1() ; 
              res.send(data);
    } catch (err) {
        console.error('Error fetching User data:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/User/:Username', async (req, res) => {
    try {
        const Username = req.params.Username; 
        const data = await dbConnect2(Username); 

        if (data.length > 0) {
            res.json(data[0]); 
        } else {
            res.status(404).send('User not found');
        }
    } catch (err) {
        console.error('Error fetching User data:', err);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/User/UsrId/:_id', async (req, res) => {
    try {
        const id = req.params._id; 
        const data = await dbConnect9(id); 

        if (data.length > 0) {
            res.json(data[0]); 
        } else {
            res.status(404).send('Post not found');
        }
    } catch (err) {
        console.error('Error fetching Post:', err);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/Post/:Topic', async (req, res) => {
    try {
        const Topic = req.params.Topic; 
        const data = await dbConnect3(Topic); 

        if (data.length > 0) {
            res.json(data); 
        } else {
            res.status(404).send('Post not found');
        }
    } catch (err) {
        console.error('Error fetching  data:', err);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/Post', async (req, res) => {
    try {
        const data = await dbConnect4() ; 
              res.send(data);
    } catch (err) {
        console.error('Error fetching User data:', err);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/Post/Posts/:_id', async (req, res) => {
    try {
        const id = req.params._id; 
        const data = await dbConnect5(id); 

        if (data.length > 0) {
            res.json(data[0]); 
        } else {
            res.status(404).send('Post not found');
        }
    } catch (err) {
        console.error('Error fetching Post:', err);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/Post/PostsUser/:UID', async (req, res) => {
    try {
        const UID = req.params.UID; 
        const data = await dbConnect6(UID); 

        res.send(data) ; 
    } catch (err) {
        console.error('Error fetching Post:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/Post/PostsUsers/:FirstName', async (req, res) => {
    try {
        const FirstName = req.params.FirstName; 
        const data = await dbConnect16(FirstName); 

        res.send(data) ; 
    } catch (err) {
        console.error('Error fetching Post:', err);
        res.status(500).send('Internal Server Error');
    }
});
app.post('/User', async (req, res) => {
    try {
        const newData = req.body;
        if (!Array.isArray(newData)) {
            return res.status(400).send('Invalid input: data must be an array');
        }
        const result = await dbConnect7(newData);
        res.status(200).json({
            message: 'Items Added',
            insertedCount: result.insertedCount, 
            insertedIds: result.insertedIds 
        });
    } catch (err) {
        console.error('Error adding user', err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/Topics', async (req, res) => {
    try {
        const data = await dbConnect8() ; 
              res.send(data);
    } catch (err) {
        console.error('Error fetching User data:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/Post', async (req, res) => {
    try {
        const newData = req.body; // Data from the frontend

        // Log the incoming data for debugging
        console.log('Incoming Data:', newData);

        // Check if the data is an array or a single object
        if (Array.isArray(newData)) {
            // Insert multiple posts if the data is an array
            const result = await dbConnect10(newData); // Assuming dbConnect10 handles insertMany
            res.status(200).json({
                message: 'Items Added',
                insertedCount: result.insertedCount,
                insertedIds: result.insertedIds
            });
        } else {
            // Insert a single post if the data is an object
            const result = await dbConnect10([newData]); // Wrap in an array to handle insertMany
            res.status(200).json({
                message: 'Item Added',
                insertedCount: result.insertedCount,
                insertedIds: result.insertedIds
            });
        }
    } catch (err) {
        console.error('Error adding post:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.put('/User/UsrId/:_id', async (req, res) => {
    const id= req.params._id;
    const newData = req.body;

    try {
        const result = await dbConnect11(id, newData);
        
        if (result.matchedCount === 0) {
            return res.status(404).send('User not found');
        }

        res.status(200).json({
            message: 'User profile updated successfully',
            matchedCount: result.matchedCount,
            modifiedCount: result.modifiedCount
        });
    } catch (err) {
        console.error('Error updating guide profile:', err.message);
        res.status(500).send('Internal Server Error');
    }
});


app.put('/User/UsrFollowUnfollow/:_id', async (req, res) => {
    const id= req.params._id;
    const { username, action } = req.body;

    if (!username || !action || !['follow', 'unfollow'].includes(action)) {
        return res.status(400).json({ error: 'Invalid input' });
      }
      try {
        // Find the user being followed/unfollowed by their ID
        const result = await dbConnect12(id, username, action);
    
        if (result.modifiedCount === 1) {
          if (action === 'follow') {
            return res.status(200).json({ message: 'Followed successfully' });
          } else if (action === 'unfollow') {
            return res.status(200).json({ message: 'Unfollowed successfully' });
          }
        } else {
          return res.status(400).json({ error: 'Action could not be performed' });
        }
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    });
    

    app.put('/User/UsrFollowingUnfollowing/:_id', async (req, res) => {
        const id= req.params._id;
        const { username, action } = req.body;
    
        if (!username || !action || !['follow', 'unfollow'].includes(action)) {
            return res.status(400).json({ error: 'Invalid input' });
          }
          try {
            // Find the user being followed/unfollowed by their ID
            const result = await dbConnect13(id, username, action);
        
            if (result.modifiedCount === 1) {
              if (action === 'follow') {
                return res.status(200).json({ message: 'Followed successfully' });
              } else if (action === 'unfollow') {
                return res.status(200).json({ message: 'Unfollowed successfully' });
              }
            } else {
              return res.status(400).json({ error: 'Action could not be performed' });
            }
          } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
          }
        });

        app.get('/User/Following/:Username', async (req, res) => {
            try {
                const Username = req.params.Username; 
                const data = await dbConnect14(Username); 
        
                res.json(data);  
            } catch (err) {
                console.error('Error fetching Post:', err);
                res.status(500).send('Internal Server Error');
            }
        });  

        app.get('/User/Followers/:Username', async (req, res) => {
            try {
                const Username = req.params.Username; 
                const data = await dbConnect15(Username); 
        
                res.json(data);  
            } catch (err) {
                console.error('Error fetching Post:', err);
                res.status(500).send('Internal Server Error');
            }
        });


        app.put('/Post/LikeUnlike/:_id', async (req, res) => {
            const id= req.params._id;
            const { username, action } = req.body;
        
            if (!username || !action || !['like', 'unlike'].includes(action)) {
                return res.status(400).json({ error: 'Invalid input' });
              }
              try {
                // Find the user being followed/unfollowed by their ID
                const result = await dbConnect17(id, username, action);
            
                if (result.modifiedCount === 1) {
                  if (action === 'like') {
                    return res.status(200).json({ message: 'Post Liked' });
                  } else if (action === 'unlike') {
                    return res.status(200).json({ message: 'Post Unliked' });
                  }
                } else {
                  return res.status(400).json({ error: 'Action could not be performed' });
                }
              } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Internal server error' });
              }
            });

            app.delete('/Post/Posts/:_id', async (req, res) => {
                try {
                  const _id = decodeURIComponent(req.params._id);
                  const result = await dbConnect18(_id); 
                  
                  if (result.deletedCount === 0) {
                    return res.status(404).json({ error: 'Item not found' });
                  }
                  res.status(200).json({ message: 'Item deleted' });
                } catch (err) {
                  console.error('Error deleting item:', err);
                  res.status(500).send('Internal Server Error');
                }
              });
              