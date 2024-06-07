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
 const newsletterCollection = client.db("fitnessDB").collection("subscribers")
 const pendingCollection = client.db("fitnessDB").collection("pending")
  
//  save user data to the database
app.put('/users', async(req, res) => {
  const user = req.body;
  const query = {email: user?.email}
  
  //  if user already exists in db
  const isExist = await userCollection.findOne(query)
if(isExist)  return res.send(isExist)
  
  // save user for first time
  const options = {upsert: true}
  const updateDoc = {
    $set: {
      ...user,
    }
  }
  
  const result = await userCollection.updateOne(query, updateDoc, options);
  res.send(result);
})


app.post('/pending', async(req,res) => {
  const applier = req.body;
  const result = await pendingCollection.insertOne(applier);
  res.send(result)
})

app.get('/pending', async(req, res) => {
  const result = await pendingCollection.find().toArray();
  res.send(result);
})

// get a user info for useRole hook
app.get('/users/:email', async(req,res) =>{
  const email = req.params.email;
  const result = await userCollection.findOne({email})
  res.send(result);
})

// save newsletter subscribers in mongodb
app.post('/subscribers', async(req,res) => {
  const subscriber = req.body;
  const result = await newsletterCollection.insertOne(subscriber);
  res.send(result)
})

// get data to show newsletter subscribers in dashboard
app.get('/subscribers', async(req, res) => {
  const result = await newsletterCollection.find().toArray();
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