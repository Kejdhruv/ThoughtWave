const { MongoClient, ObjectId } = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'Collection3'; 
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

async function dbConnect17(id, username, action) {
  try {
    await client.connect();
    const db = client.db(dbName);
    const usersCollection = db.collection('Posts');
    
    const objectId = new ObjectId(id); // Convert to ObjectId if needed

    // Define the update operation
    let updateOperation;
    if (action === 'like') {
      updateOperation = {
        $addToSet: { Like: username } // Adds to the array only if not already present
      };
    } else if (action === 'unlike') {
      updateOperation = {
        $pull: { Like: username } // Removes the username from the array
      };
    }

    // Update the user document based on the action
    const result = await usersCollection.updateOne(
      { _id: objectId },
      updateOperation
    );

    return result; // Return the result of the update operation
  } catch (err) {
    console.error("Error updating user profile:", err);
    throw err; // Consider throwing a custom error
  } finally {
    await client.close();
  }
}

module.exports = dbConnect17;