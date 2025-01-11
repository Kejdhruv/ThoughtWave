const { MongoClient, ObjectId } = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'Collection3'; 
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

async function dbConnect14(Username) {
    try {
        await client.connect(); 

        const db = client.db(dbName);
        const collection = db.collection('Users'); 

        // Use ObjectId to query by _id by filtering out 
        const data = await collection.find({ Followers: Username }).toArray();
        
        return data;
    } catch (err) {
        console.error("Error fetching hotel data:", err);
        throw err;
    }
}

module.exports =  dbConnect14 ;