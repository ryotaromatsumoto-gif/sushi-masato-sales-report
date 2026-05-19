import Anthropic from '@anthropic-ai/sdk';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { image1, image2, prompt } = req.body;

  if (!image1 || !image2 || !prompt) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const message = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: image1.type, data: image1.data } },
          { type: 'image', source: { type: 'base64', media_type: image2.type, data: image2.data } },
          { type: 'text', text: prompt },
        ],
      }],
    });

    const text = message.content[0].text.trim();
    return res.status(200).json({ result: text });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
