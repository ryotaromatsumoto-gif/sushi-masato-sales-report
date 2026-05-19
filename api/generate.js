import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { image1, image2, prompt } = req.body;

  if (!image1 || !image2 || !prompt) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const result = await model.generateContent([
      { inlineData: { mimeType: image1.type, data: image1.data } },
      { inlineData: { mimeType: image2.type, data: image2.data } },
      prompt,
    ]);

    const text = result.response.text().trim();
    return res.status(200).json({ result: text });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
