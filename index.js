// const express = require('express');
// const cors = require('cors');

// const app = express();
// app.use(express.json());
// app.use(cors());

// const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434';
 
// const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'qwen:0.5b';
 
// app.post('/api/chat', async (req, res) => {
//   try {
//     const { question } = req.body || {};
//     if (!question || !question.trim()) {
//       return res.status(400).json({ error: 'Missing "question".' });
//     }

//     const r = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         model: OLLAMA_MODEL,
//         messages: [{ role: 'user', content: question }],
//         stream: false
//       })
//     });

//     if (!r.ok) {
//       const detail = await r.text().catch(() => '');
//       console.error('Ollama error:', r.status, detail);
//       return res.status(502).json({ error: `Ollama returned ${r.status}` });
//     }

//     const data = await r.json();
//     const answer = data?.message?.content || data?.response || 'No answer.';
//     return res.json({ answer });
//   } catch (e) {
//     console.error('Server exception:', e);
//     return res.status(500).json({ error: 'Server error.' });
//   }
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log('server is running on port', PORT));






 
 const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

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

// ===== Ollama Config (للاستخدام محلياً غالباً) =====
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'qwen:0.5b';

// ===== Routes =====

// root للتأكد بسهولة إن الباك شغال
app.get('/', (req, res) => {
  res.send('RUWWAD backend is running 🚀');
});

// هيلث تشِك (مع حالة الداتابيز)
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection?.readyState; // 1 = connected
  res.json({ ok: true, dbState });
});

// شات مع Ollama (يشتغل محلياً، وفي الإنتاج يرجّع رسالة لو مفيش Ollama)
app.post('/api/chat', async (req, res) => {
  try {
    const { question } = req.body || {};
    if (!question || !question.trim()) {
      return res.status(400).json({ error: 'Missing "question".' });
    }

    // في Render ما في Ollama عادة، فنعطي رد لطيف بدل error قاسي
    if (process.env.NODE_ENV === 'production' && !process.env.OLLAMA_BASE_URL) {
      return res.json({
        answer:
          'Chat backend is not configured in production yet. Please try again later.'
      });
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
    const answer =
      data?.message?.content || data?.response || 'No answer.';
    return res.json({ answer });
  } catch (e) {
    console.error('Server exception:', e);
    return res.status(500).json({ error: 'Server error.' });
  }
});

// ===== Start Server =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('server is running on port', PORT);
});
