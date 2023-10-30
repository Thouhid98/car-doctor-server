const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// Middlewares 
app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.28tvm1z.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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

    const servicesCollection = client.db('carDoctor').collection('services');
    const bookingCollection =  client.db('carDoctor').collection('bookings');

    // Jwt Token Related APIS 
    app.post('/jwt', async(req, res)=>{
      const user = req.body;
      console.log(user);
      res.send(user);
    })


    // Service Related APIS 
    app.get('/services', async(req, res)=>{
        const cursor = servicesCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.get('/services/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const options ={
        projection:{title:1, price:1, service_id:1, img:1 }, 
      }
      const result = await servicesCollection.findOne(query, options);
      res.send(result);
    })

    // Booking Apis 
    app.post('/checkout', async(req, res)=>{
      const booking = req.body;
      console.log(booking);
      const result = await bookingCollection.insertOne(booking);
      res.send(result);
    })

    // Fetch Booking data for a User 
    app.get('/bookings', async(req, res)=>{
      console.log(req.query.email);
      let query = {};
      if(req.query?.email){
        query = {email: req.query.email}
      }
      const result = await bookingCollection.find(query).toArray();
      res.send(result);
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







app.get('/', async(req, res)=>{
    res.send('Car Doctor is running');
})
app.listen(port, ()=>{
    console.log(`Car Doctor Is Running on Port ${port}`);
})