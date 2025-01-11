const { MongoClient, ObjectId } = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'Collection3'; 
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

async function dbConnect2(Username) {
    try {
        await client.connect(); 

        const db = client.db(dbName);
        const collection = db.collection('Users'); 

 
        const data = await collection.find({Username}).toArray();
        
        return data;
    } catch (err) {
        console.error("Error fetching User data:", err);
        throw err;
    }
}

module.exports =  dbConnect2 ;