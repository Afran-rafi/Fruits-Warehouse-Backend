const express = require('express')
const app = express()
const port = process.env.PORT || 5000

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
app.use(cors())
app.use(express.json())
require('dotenv').config();


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fnxrf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect()
        const itemsCollection = client.db("Fruits-Warehouse").collection("fruits-items")

        // All fruits items
        app.get('/inventory', async (req, res) => {
            const query = {}
            const cursor = itemsCollection.find(query)
            const items = await cursor.toArray()
            res.send(items)
        })

        // Fruits Details
        app.get('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const item = await itemsCollection.findOne(query);
            res.send(item);
        });

        // Update Fruits quantity
        app.put('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const updateFruits = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updated = {
                $set: {
                    quantity: updateFruits.quantity,
                }
            };
            const result = await itemsCollection.updateOne(filter, updated, options);
            res.send(result);
        })

        // POST(Add Fruits)
        app.post('/inventory', async (req, res) => {
            const newItems = req.body;
            const result = await itemsCollection.insertOne(newItems);
            res.send(result);
        });
    }
    finally {

    }
}

run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('Mission Assignment 11 CRUD Operation!!!')
})

app.listen(port, () => {
    console.log(`BackEnd is Running ${port}`)
})