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
        const MyOrder = database.collection('orders');


        // GET Resorts
        app.get('/resorts', async (req, res) => {
            const cursor = resortCollection.find({});
            const resorts = await cursor.toArray();
            res.send(resorts);
        });
        // GET orders
        app.get('/orders', async (req, res) => {
            const cursor = MyOrder.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        });

        // GET Single Resort
        app.get('/resorts/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific service', id);
            const query = { _id: ObjectId(id) };
            const resort = await resortCollection.findOne(query);
            res.json(resort);
        })
        /*  //GET orders by email
         app.get('/orders/:email', async (req, res) => {
             const result = await MyOrder.find({
                 email = req.params.email
             }).toArray();
             res.send(result);
         }); */

        // get all order by email
        app.get("/myOrders/:email", (req, res) => {
            console.log(req.params);
            MyOrder
                .find({ email: req.params.email })
                .toArray((err, results) => {
                    res.send(results);
                });
        });

        //DELETE my order
        app.delete('/myOrders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await MyOrder.deleteOne(query);
            res.json(result);
        })

        // POST Resort
        app.post('/resorts', async (req, res) => {
            const resort = req.body;
            console.log('hit the post api', resort);
            const result = await resortCollection.insertOne(resort);
            console.log(result);
            res.json(result)
        });
        // POST orders
        app.post('/orders', async (req, res) => {
            const order = req.body;
            console.log('hit the post api', order);
            const result = await MyOrder.insertOne(order);
            console.log(result);
            res.json(result)
        });

        // DELETE orders from ManageOrders
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await MyOrder.deleteOne(query);
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