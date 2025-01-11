const { MongoClient, ObjectId } = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'Collection3'; 
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

async function dbConnect11(id, newData) {
    try {
        await client.connect(); 

        const db = client.db(dbName);
        const collection = db.collection('Users'); 

        const objectId = new ObjectId(id); // Convert to ObjectId if needed
        const { _id, ...updateData } = newData; // Ensure you're passing the correct _id

        const result = await collection.updateMany(
            { _id: objectId },  // Filter by the ObjectId
            { $set: updateData }
        );

        return {
            matchedCount: result.matchedCount, 
            modifiedCount: result.modifiedCount 
        };
    } catch (err) {
        console.error("Error updating user profile:", err);
        throw err; // Consider throwing a custom error
    } finally {
        await client.close(); 
    }
}

module.exports = dbConnect11;