
const express = require('express');
const mongoose = require('mongoose');
var cors = require('cors')
const app = express();
app.use(express.json());
const textRoutes = require('./routes/text.route');
const loginRoutes = require('./routes/login');
app.use(cors())

// Connect to MongoDB
  const mongoURI = 'mongodb+srv://abood123_db_user:abd12345@abd.g4xkm7a.mongodb.net/softwareproject?retryWrites=true&w=majority&appName=abd'
  mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log("error connecting to mongoDB"));   


app.use('/api', textRoutes);
app.use('/api/login', loginRoutes);






app.listen(3000, () => {
     console.log('server is running on port 3000')    
})
