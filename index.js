const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');

const app = express();
const port =  3001;

app.use( cors(
  {
    origin: process.env.CORS_ORIGIN,
    methods: ["GET"],
    credentials: true,
  }
));

// const uri = "mongodb+srv://singhchandni2003:Chandni123@cluster0.ilzeucj.mongodb.net/samplemflix?retryWrites=true&w=majority&appName=Cluster0";
// const uri = "mongodb+srv://singhchandni2003:Chandni123@cluster0.ilzeucj.mongodb.net/sample_mflix";
const uri=process.env.MONGODB_URI
const client = new MongoClient(uri);
// app.use(cors());
app.use(express.json());
let database, moviesCollection;

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    database = client.db('sample_mflix');
    moviesCollection = database.collection('movies');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

connectToDatabase();

app.get('/', (req, res) => {
  res.status(200).json({ msg: 'server running' });
});



app.get('/movies', async (req, res) => {
  try {
    const query = { title: 'Back to the Future' };
    const movie = await moviesCollection.findOne(query);
    
    if (!movie) {
     
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.json(movie);
  } catch (error) {
  
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to fetch movie' });
    }
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
