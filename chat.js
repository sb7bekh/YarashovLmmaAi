module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { messages } = req.body || {};
    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages kerak' });
    }

    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: "Sen YARASHOV AI — aqlli, do'stona va foydali yordamchisan. Foydalanuvchi qaysi tilda yozsa, o'sha tilda javob ber (o'zbek, rus yoki ingliz). Qisqa, aniq va foydali javoblar ber."
          },
          ...messages
        ],
        max_tokens: 1024,
        temperature: 0.7
      })
    });

    const data = await r.json();
    return res.status(r.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
