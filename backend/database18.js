const { MongoClient, ObjectId } = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'Collection3'; 
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

async function dbConnect18(_id) {
    try {
        await client.connect(); 

        const db = client.db(dbName);
        const collection = db.collection('Posts'); 

        // Use ObjectId to query by _id for deletion
        const result = await collection.deleteOne({ _id: new ObjectId(_id) });

        // Return the result of the deletion (how many documents were deleted)
        return result.deletedCount > 0 ? { success: true, message: 'Post deleted successfully.' } : { success: false, message: 'Post not found.' };
    } catch (err) {
        console.error("Error deleting post:", err);
        throw err;
    } finally {
        // Close the connection after the operation is done
        await client.close();
    }
}

module.exports = dbConnect18;
