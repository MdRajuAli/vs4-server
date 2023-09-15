const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const cors = require('cors')
app.use(cors())

app.use(express.json())

const port = process.env.PORT || 5000



const uri = "mongodb+srv://vs-four:vs-four@cluster0.q8hlybw.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    const vsFourPeople = client.db("vsFourDB").collection("vsFourPeople")


    app.get('/', (req, res) => {
      res.send('vs4 app is running')
    })

    app.get('/allPeople', async (req, res) => {
      const users = await vsFourPeople.find().toArray();
      res.send(users)
    })

    app.get('/editPeople/:id', async (req, res) => {
      const id = req.params.id
      const quary = { _id: new ObjectId(id) }
      const person = await vsFourPeople.findOne(quary)
      res.send(person)
    })

    app.get('/search/:text', async (req, res) => {
      const text = req.params.text

      // const query = req.query.query;

      // Perform the search query
      const results = await vsFourPeople.find({
        $or: [
          { name: { $regex: text, $options: 'i' } }, // Case-insensitive search
          { description: { $regex: text, $options: 'i' } },
        ],
      });
      console.log(results);
      // res.send(data);

    })


    app.post('/addPeople', async (req, res) => {
      const user = req.body
      const result = await vsFourPeople.insertOne(user)
      res.send(result)
    })

    app.patch('/updatePeople/:id', async (req, res) => {
      const user = req.body;
      // console.log(user);
      const id = req.params.id
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true }

      const updatedPeople = {
        $set: {
          name: user.name,
          phone: user.phone,
          passport: user.passport,
          sivilId: user.sivilId,
          nationality: user.nationality,
          occupation: user.occupation,
          visa: user.visa,
          startDate: user.startDate,
          expire: user.expire,
          workingPlace: user.workingPlace
        }
      }
      const result = await vsFourPeople.updateOne(filter, updatedPeople, options)
      res.send(result)
    })

    app.delete('/deletePeople/:id', async (req, res) => {
      const id = req.params.id
      const quary = { _id: new ObjectId(id) }
      const result = await vsFourPeople.deleteOne(quary)
      res.send(result)
    })
















    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);






app.listen(port)