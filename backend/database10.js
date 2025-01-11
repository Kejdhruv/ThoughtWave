const { MongoClient } = require("mongodb");

const database = 'Collection3';
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

// Keep the connection alive to avoid opening and closing on every request
let db;

async function dbConnect10(newData) {
    try {
        // Connect to the MongoDB server if not already connected
        if (!db) {
            await client.connect();
            db = client.db(database);
        }

        const collection = db.collection('Posts');

        // Ensure the data is an array (if it's a single object, wrap it in an array)
        if (!Array.isArray(newData)) {
            newData = [newData];
        }

        // Insert the data into the collection
        const result = await collection.insertMany(newData);
        
        return {
            insertedCount: result.insertedCount,
            insertedIds: result.insertedIds,
        };

    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        throw new Error('Database insertion failed');
    }
}

module.exports = dbConnect10;
