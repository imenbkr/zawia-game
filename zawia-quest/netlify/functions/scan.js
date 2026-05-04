exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { imageBase64, mediaType } = JSON.parse(event.body);

    const PROMPT = `You are a strict pattern-recognition assistant for Zawia Quest, a heritage tour of Zaoua de Sidi-Assa in Tunisia. A visitor must scan an authentic Islamic geometric pattern to unlock the next quest. Examine the image carefully and respond ONLY with a JSON object, no markdown, no extra text: {"detected": true/false, "patternName": "short name of pattern", "description": "one sentence on its symbolism"}. Set detected:true ONLY if the image clearly shows: zellige tilework, arabesque, Islamic star motif (4, 6, 8, 10 or 12-pointed), geometric tessellation, muqarnas, calligraphy, or ornamental Islamic/Maghrebi architectural decoration. Set detected:false for: plain walls, solid colours, random textures, nature, food, people, generic tiles with no Islamic geometry, or anything that is not a recognisable Islamic decorative pattern. Be strict — a plain brick wall, painted wall, or simple repeated texture is NOT enough.`;

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
      return {
        statusCode: 200,
        body: JSON.stringify({ error: data.error.message || 'NVIDIA API error' })
      };
    }

    const text = data.choices?.[0]?.message?.content || '';
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    };

  } catch (err) {
    return {
      statusCode: 200,
      body: JSON.stringify({ error: err.message })
    };
  }
};
