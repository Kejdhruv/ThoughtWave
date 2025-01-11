const { MongoClient } = require("mongodb");

const database = 'Collection3';
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

async function dbConnect3(Topic) {
    try {
        await client.connect();
        const db = client.db(database);
        const collection = db.collection('Posts');

        
        const data = await collection.find({ Topic }).toArray();
        
        console.log("Query Result:", data); 
        return data;
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        throw err;
    } finally {
        await client.close();
    }
}

module.exports = dbConnect3;