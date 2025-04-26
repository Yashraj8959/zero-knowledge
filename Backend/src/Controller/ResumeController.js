import { GoogleGenerativeAI } from '@google/generative-ai'; 

console.log('Gemini API Key:', process.env.GEMINI_API_KEY); 

// Setup Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getResumeSuggestions = async (req, res) => {
  try {
    const { skills, education, bio, projects } = req.body;

    if (!skills || !education || !bio || !projects) {
      return res.status(400).json({ error: 'All fields (skills, education, bio, projects) are required, baby 💔' });
    }

    const prompt = `
      You are a professional ATS (Applicant Tracking System) Resume Optimizer. 
      Given the following details:
      
      Skills: ${skills.join(', ')}
      Education: ${education}
      Bio: ${bio}
      Projects: ${projects.join(', ')}

      1. Suggest ATS-friendly improvements for each section.
      2. Highlight weaknesses or missing points.
      3. Return only an array of objects. Each object must include:
         - section (e.g., Skills, Education, Bio, Projects)
         - currentSummary
         - suggestedImprovements (as an array of points)
      4. Also include in last object:
         - weaknesses (as an array of points)
         - missingPoints (as an array of points)
         - suggestions (what to learn for bteer package)
         - resources (websites or courses to learn from)
         - rating (1-10 scale)
         - confidence (1-10 scale)
         - Predict Salary (in INR) based on the skills and education provided.(In India and other countries)
      
      Keep your tone professional but simple and clear.
      Reply strictly in JSON array format inside a proper code block.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });

    const response = result.response;
    const text = response.text();

    // Extract JSON content
    const jsonMatch = text.match(/```json([\s\S]*?)```/);

    if (jsonMatch) {
      const cleaned = jsonMatch[1].trim();
      const suggestions = JSON.parse(cleaned);
      return res.status(200).json({ suggestions });
    } else {
      return res.status(200).json({ raw: text, warning: "Couldn't parse JSON, format issue." });
    }

  } catch (err) {
    console.error('🔥 Error in getResumeSuggestions:', err);
    res.status(500).json({ error: 'Something went wrong, baby 🥺' });
  }
};
