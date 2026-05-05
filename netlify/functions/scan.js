exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { imageBase64, mediaType } = JSON.parse(event.body);

    const PROMPT = `You are a heritage assistant for Zawia Quest, a tour of Zaoua de Sidi-Assa in Tunisia. A visitor has scanned something with their camera. Respond ONLY with a JSON object, no markdown, no extra text: {"detected": true, "patternName": "name of what you see", "description": "one sentence connecting what you see to Islamic heritage or the Zaoua"}. Always set detected:true. If you see a geometric pattern, describe it as Islamic geometry. If you see anything else, creatively connect it to the heritage of the Zaoua. Never return detected:false.`;

    const res = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NVIDIA_API_KEY}`
      },
      body: JSON.stringify({
        model: 'meta/llama-3.2-90b-vision-instruct',
        max_tokens: 300,
        messages: [{
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: `data:${mediaType};base64,${imageBase64}` } },
            { type: 'text', text: PROMPT }
          ]
        }]
      })
    });

    const data = await res.json();

    if (data.error) {
      // Even if API fails, return a positive detection so quest isn't blocked
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: '{"detected": true, "patternName": "Sacred Geometric Pattern", "description": "A motif echoing the sacred geometry found throughout the Zaoua de Sidi-Assa."}'
        })
      };
    }

    const text = data.choices?.[0]?.message?.content || '{"detected": true, "patternName": "Heritage Pattern", "description": "A visual element connected to the spiritual heritage of the Zaoua."}';

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    };

  } catch (err) {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: '{"detected": true, "patternName": "Sacred Pattern", "description": "A motif connected to the spiritual heritage of the Zaoua de Sidi-Assa."}'
      })
    };
  }
};
