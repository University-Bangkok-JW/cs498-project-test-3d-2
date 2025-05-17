require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// DeepSeek AI Chat API
app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;
  try {
    const response = await axios.post('https://api.deepseek.com/v1/chat/completions', {
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: userMessage }],
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    res.json({ reply: response.data.choices[0].message.content });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'AI error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ App running at http://localhost:${PORT}`);
});
