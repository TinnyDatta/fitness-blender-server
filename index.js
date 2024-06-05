const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wlyr1jn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();

  //  collections
  const userCollection = client.db("fitnessDB").collection("users")
  const reviewCollection = client.db("fitnessDB").collection("reviews")
 const trainersCollection = client.db("fitnessDB").collection("trainers")
  
//  save user data to the database
app.post('/users', async(req, res) => {
  const user = req.body;
  // insert email if user doesn't exists
  const query = {email: user.email}
  const existingUser = await userCollection.findOne(query);
  if(existingUser){
    return res.send({message: 'user already exists'})
  }
  const result = await userCollection.insertOne(user);
  res.send(result);
})

  // get data for review
  app.get('/reviews', async(req, res) => {
    const result = await reviewCollection.find().toArray();
    res.send(result);
  })

  // get all trainers from db
  app.get('/trainers', async(req, res) => {
    const result = await trainersCollection.find().toArray();
    res.send(result);
  })

  // get single trainer data for details page
  app.get('/details/:id', async(req, res) => {
    const id = req.params.id;
    const query = {_id: new ObjectId(id)};
    const result = await trainersCollection.findOne(query);
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


app.get('/', (req, res)=> {
    res.send('fitness blender is running')
});

app.listen(port, ()=>{
    console.log(`Fitness blender is running on port ${port}`);
})