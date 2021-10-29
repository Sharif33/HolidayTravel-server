const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

require('dotenv').config()
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.w273s.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// middleware
app.use(cors());
app.use(express.json());

async function run() {
    try {
        await client.connect();
        const database = client.db('resortManagement');
        const resortCollection = database.collection('resorts');

        // GET Resorts
        app.get('/resorts', async (req, res) => {
            const cursor = resortCollection.find({});
            const resorts = await cursor.toArray();
            res.send(resorts);
        });

        // GET Single Resort
        app.get('/resorts/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific service', id);
            const query = { _id: ObjectId(id) };
            const resort = await resortCollection.findOne(query);
            res.json(resort);
        })

        // POST Resort
        app.post('/resorts', async (req, res) => {
            const resort = req.body;
            console.log('hit the post api', resort);
            const result = await resortCollection.insertOne(resort);
            console.log(result);
            res.json(result)
        });

        // DELETE API
        app.delete('/resorts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await resortCollection.deleteOne(query);
            res.json(result);
        })

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('volunteer Network Server is Runnning')
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});