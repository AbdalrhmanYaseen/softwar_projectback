
// const express = require('express');
// const mongoose = require('mongoose');
// var cors = require('cors')
// const app = express();
// app.use(express.json());
// const textRoutes = require('./routes/text.route');
// const loginRoutes = require('./routes/login');
// const signupRoutes = require('./routes/signup_route');
// app.use(cors())

// // Connect to MongoDB
//   const mongoURI = 'mongodb+srv://abood123_db_user:abd12345@abd.g4xkm7a.mongodb.net/softwareproject?retryWrites=true&w=majority&appName=abd'
//   mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log('MongoDB connected'))
//     .catch(err => console.log("error connecting to mongoDB"));   


// app.use('/api', textRoutes);
// app.use('/api', loginRoutes);
// app.use('/api', signupRoutes);






// app.listen(3000, () => {
//      console.log('server is running on port 3000')    
// })
 // server.js (CommonJS)
const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434';
// اختاري موديل موجود فعلاً في /api/tags:
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'qwen:0.5b';

// لو بدك توقفي ضجة Mongo مؤقتاً، خليه معطّل حالياً.
// لاحقاً بتفعّليه لما تجهزي MONGODB_URI صحيحة.

// /api/chat: نفس المسار اللي بتستدعيه الواجهة الأمامية
app.post('/api/chat', async (req, res) => {
  try {
    const { question } = req.body || {};
    if (!question || !question.trim()) {
      return res.status(400).json({ error: 'Missing "question".' });
    }

    const r = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages: [{ role: 'user', content: question }],
        stream: false
      })
    });

    if (!r.ok) {
      const detail = await r.text().catch(() => '');
      console.error('Ollama error:', r.status, detail);
      return res.status(502).json({ error: `Ollama returned ${r.status}` });
    }

    const data = await r.json();
    const answer = data?.message?.content || data?.response || 'No answer.';
    return res.json({ answer });
  } catch (e) {
    console.error('Server exception:', e);
    return res.status(500).json({ error: 'Server error.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('server is running on port', PORT));
