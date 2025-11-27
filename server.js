const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");

const app = express();
//middelware
app.use(cors());
app.use(express.json())



const uri = "mongodb+srv://eventevent:yrQMsUszdNQa51Zw@cluster0.7xap9dx.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const db = client.db('event_hum')
        const details = db.collection('event_details')




        app.get('/details', async (req, res) => {
            const result = await details.find().toArray()
            res.send(result)
        })

        app.delete('/details/:id', async (req, res) => {
            const { id } = req.params
            const filter = { _id: new ObjectId(id) }
            const result = await details.deleteOne(filter)
            res.send(result)
        })

        // Add new event details
        app.post('/details', async (req, res) => {
            const newDetail = req.body;
            try {
                const result = await details.insertOne(newDetail);
                res.status(201).send(result);
            } catch (error) {
                res.status(500).send({ error: 'Failed to add event detail', details: error.message });
            }
        });

        app.get('/details/:id', async (req, res) => {
            const { id } = req.params
            const result = await details.findOne({ _id: new ObjectId(id) })
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Hello Backend!");
});


app.listen(3001, () => {
    console.log("Server running on port 3000");
});