
const fetch = require('node-fetch');
exports.handler = async function(event, context) {
  try {
    const { message } = JSON.parse(event.body || '{}');
    if(!message) return { statusCode:400, body: JSON.stringify({ error:'no message' }) };
    const OPENAI_KEY = process.env.OPENAI_KEY;
    if(!OPENAI_KEY) return { statusCode:500, body: JSON.stringify({ error:'OpenAI key not set' }) };
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method:'POST',
      headers:{ 'Content-Type':'application/json', 'Authorization': `Bearer ${OPENAI_KEY}` },
      body: JSON.stringify({ model:'gpt-4o-mini', messages:[{role:'user', content: message}], max_tokens:300 })
    });
    const json = await r.json();
    const reply = json.choices?.[0]?.message?.content || 'No reply';
    return { statusCode:200, body: JSON.stringify({ reply }) };
  } catch(err) { return { statusCode:500, body: JSON.stringify({ error: err.message }) }; }
};
