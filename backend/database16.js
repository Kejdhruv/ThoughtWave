const { MongoClient } = require("mongodb");

const database = 'Collection3';
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

async function dbConnect16(FirstName) {
    try {
        await client.connect();
        const db = client.db(database);
        const collection = db.collection('Users');

       
        console.log("Querying with HID:", FirstName);
        
        const data = await collection.find({ FirstName }).toArray();
        
        console.log("Query Result:", data); 
        return data;
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        throw err;
    } finally {
        await client.close();
    }
}

module.exports = dbConnect16;