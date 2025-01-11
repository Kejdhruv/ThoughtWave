const { MongoClient } = require("mongodb");

const database = 'Collection3';
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url, { useUnifiedTopology: true });  // Use unifiedTopology to manage connections better

let isConnected = false;

async function connectToDb() {
    if (!isConnected) {
        try {
            await client.connect();
            isConnected = true;
            console.log("Successfully connected to MongoDB");
        } catch (err) {
            console.error("Error connecting to MongoDB:", err);
            throw err;
        }
    }
}

async function dbConnect6(UID) {
    await connectToDb();  // Ensure the connection is established before querying

    try {
        const db = client.db(database);
        const collection = db.collection('Posts');
        
        console.log("Querying with UID:", UID);
        
        const data = await collection.find({ UID }).toArray();
        
        console.log("Query Result:", data);
        
        if (data.length === 0) {
            console.log("No more data for UID:", UID);
            return [];  // End recursion if no more data is found
        }

        // Recursive call to fetch next batch of data if needed, here you can decide how to manage recursion
        return data;
        
    } catch (err) {
        console.error("Error querying MongoDB:", err);
        throw err;
    }
}

// Call this function once for initial connection
connectToDb();

module.exports = dbConnect6;

