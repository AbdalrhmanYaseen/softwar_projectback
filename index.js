// const express = require('express');
// const cors = require('cors');

// const app = express();
// app.use(express.json());
// const textRoutes = require('./routes/text.route');
// const loginRoutes = require('./routes/login');
// const signupRoutes = require('./routes/signup_route');
// const studentTypeRoutes = require('./routes/studentType-route');
// app.use(cors())

// // Connect to MongoD
//   const mongoURI = 'mongodb+srv://aboodjamal684_db_user:Abd123456@abd.lvp2v4i.mongodb.net/?retryWrites=true&w=majority&appName=abd'
//   mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log('MongoDB connected'))
//     .catch(err => console.log("error connecting to mongoDB"));   


// app.use('/api', textRoutes);
// app.use('/api', loginRoutes);
// app.use('/api', signupRoutes);
// app.use('/api', studentTypeRoutes);






// app.listen(3000, () => {
//      console.log('server is running on port 3000')    
// })


 // index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// ===== Middleware =====
app.use(express.json());
app.use(
  cors({
    origin: [
      'https://ruwwad.vercel.app', // الفرونت على Vercel
      'http://localhost:3000',      // للتجربة محلياً
      'http://localhost:5173'       // لو استخدمتي Vite
    ],
    credentials: true
  })
);

// ===== MongoDB Connect =====
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.warn('MONGODB_URI not set — running WITHOUT database.');
} else {
  mongoose
    .connect(MONGODB_URI, {
      maxPoolSize: 10
    })
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch((err) => {
      console.error('❌ MongoDB connection error:', err);
      // لو حابة توقفي السيرفر عند فشل الاتصال:
      // process.exit(1);
    });
}

// ====== routes تبعتك القديمة ======
const textRoutes = require('./routes/text.route');
const loginRoutes = require('./routes/login');
const signupRoutes = require('./routes/signup_route');
const studentTypeRoutes = require('./routes/studentType-route');

app.use('/api', textRoutes);
app.use('/api', loginRoutes);
app.use('/api', signupRoutes);
app.use('/api', studentTypeRoutes);

// ====== MongoDB ======
const mongoURI =
  process.env.MONGO_URI ||
  'mongodb+srv://aboodjamal684_db_user:Abd123456@abd.lvp2v4i.mongodb.net/?retryWrites=true&w=majority&appName=abd';

mongoose
  .connect(mongoURI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => {
    console.log('❌ error connecting to mongoDB', err.message);
    // ما نوقف السيرفر
  });

// ====== test route ======
app.get('/', (req, res) => {
  res.json({ ok: true, msg: 'API is running ✅' });
});

/**
 * 🟣 راوت الـ AI - الآن يستعمل Ollama المحلي
 * POST http://localhost:3000/api/chat
 * body: { "question": "..." }
 */
app.post('/api/chat', async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ error: 'question is required' });
    }

    // بنبعت على ollama اللي شغال عندك على 11434
    const ollamaRes = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'qwen:0.5b',    // الموديل اللي شفناه عندك
        prompt: question,
        stream: false,
      }),
    });

    if (!ollamaRes.ok) {
      const errText = await ollamaRes.text();
      console.error('Ollama error:', errText);
      return res.status(500).json({ error: 'Local model request failed' });
    }

    const data = await ollamaRes.json();
    // Ollama بيرجع response بالنص
    return res.json({
      answer: data.response, // 👈 الفرونت رح يقراها
    });
  } catch (err) {
    console.error('Server error (ollama):', err.message);
    return res.status(500).json({ error: 'Server error (ollama)' });
  }
});

// ====== start server ======
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('server is running on port ' + PORT);
});

