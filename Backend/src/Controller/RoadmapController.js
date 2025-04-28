import { GoogleGenerativeAI } from '@google/generative-ai'; 

// Gemini API setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getRoadmap = async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required, jaanu 💔' });
    }

    const prompt = `
      Create a complete learning roadmap for the topic "${topic}".
      1. Break it into 10-15 main subtopics.
      2. Each subtopic should include:
         - Name
         - Short Description
         - 2-3 related concepts
      3. Return the result as a JSON array of objects.
      4. Also, at the end, suggest 3 best websites and 3 YouTube channels for learning "${topic}".
      Keep the output inside a proper JSON code block.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // 🛜 using FLASH here baby!

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const response = result.response;
    const text = response.text();

    // Extract JSON content
    const jsonMatch = text.match(/```json([\s\S]*?)```/);

    if (jsonMatch) {
      const cleaned = jsonMatch[1].trim();
      const roadmap = JSON.parse(cleaned);
      return res.status(200).json({ topic, roadmap });
    } else {
      return res.status(200).json({ topic, raw: text, warning: "Couldn't parse JSON, maybe wrong format." });
    }

  } catch (err) {
    console.error('🔥 Error in getRoadmap:', err);
    res.status(500).json({ error: 'Something went wrong baby 🥺' });
  }
};
