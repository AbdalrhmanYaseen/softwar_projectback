
const express = require('express');
const mongoose = require('mongoose');
var cors = require('cors')
const app = express();
app.use(express.json());
const textRoutes = require('./routes/text.route');
const loginRoutes = require('./routes/login');
const signupRoutes = require('./routes/signup_route');
const studentTypeRoutes = require('./routes/studentType-route');
app.use(cors())

// Connect to MongoD
  const mongoURI = 'mongodb+srv://aboodjamal684_db_user:Abd123456@abd.lvp2v4i.mongodb.net/?retryWrites=true&w=majority&appName=abd'
  mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log("error connecting to mongoDB"));   


app.use('/api', textRoutes);
app.use('/api', loginRoutes);
app.use('/api', signupRoutes);
app.use('/api', studentTypeRoutes);






app.listen(3000, () => {
     console.log('server is running on port 3000')    
})
