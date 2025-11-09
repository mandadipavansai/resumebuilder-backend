


const { GoogleGenerativeAI } = require('@google/generative-ai');


let genAI;
try {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log("Successfully initialized Gemini AI client.");
} catch (error) {
    console.error("CRITICAL ERROR: Failed to initialize Gemini AI client. Make sure your GEMINI_API_KEY is set correctly in the .env file.", error.message);
    process.exit(1);
}


const textModel = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash" 
});


const jsonModel = genAI.getGenerativeModel({
    model: "gemini-2.5-flash", 
    generationConfig: {
        responseMimeType: "application/json",
    },
});



const resumeToString = (resumeData) => {
    let resumeText = '';
    if (resumeData.personalDetails) {
        resumeText += `Name: ${resumeData.personalDetails.name || ''}\nTitle: ${resumeData.personalDetails.title || ''}\n`;
    }
    if (resumeData.summary) {
        resumeText += "\n--- Professional Summary ---\n" + resumeData.summary + "\n";
    }
    if (resumeData.experience && resumeData.experience.length > 0) {
        resumeText += "\n--- Work Experience ---\n";
        resumeData.experience.forEach(exp => {
            resumeText += `Role: ${exp.title || ''} at ${exp.subtitle || ''}\n`;
            if (exp.description && exp.description.length > 0) {
                exp.description.forEach(point => resumeText += `- ${point}\n`);
            }
        });
    }
    if (resumeData.projects && resumeData.projects.length > 0) {
        resumeText += "\n--- Projects ---\n";
        resumeData.projects.forEach(proj => {
            resumeText += `Project: ${proj.title || ''}\nTechnologies: ${proj.subtitle || ''}\n`;
            if (proj.description && proj.description.length > 0) {
                proj.description.forEach(point => resumeText += `- ${point}\n`);
            }
        });
    }
    if (resumeData.education && resumeData.education.length > 0) {
        resumeText += "\n--- Education ---\n";
        resumeData.education.forEach(edu => {
            resumeText += `Degree: ${edu.degree || ''} from ${edu.school || ''} (${edu.startDate || ''} - ${edu.gradDate || ''})\n`;
        });
    }
    if (resumeData.skills && resumeData.skills.length > 0) {
        resumeText += "\n--- Skills ---\n" + resumeData.skills.join(', ') + "\n";
    }
    return resumeText.trim();
};


// --- The AI Functions ---


const improveWriting = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ message: "Text is required." });

        const prompt = `You are a world-class resume writer. Rewrite the following text to be more impactful, professional, and concise. Correct any spelling or grammatical errors. Return ONLY the improved text. Original text: "${text}"`;
        const result = await textModel.generateContent(prompt);
        
        res.status(200).json({ improvedText: result.response.text() });
    } catch (error) {
        console.error("AI Improve Writing Error:", error);
        res.status(500).json({ message: 'Error improving text.' });
    }
};

const getAtsScore = async (req, res) => {
    try {
        const { resumeData } = req.body;
        if (!resumeData) return res.status(400).json({ message: "Resume data is required." });
        const resumeText = resumeToString(resumeData);

        const prompt = `As an expert ATS scanner, analyze the following resume. Your entire response must be a single, valid JSON object with keys "score" (number), "summary" (string explaining the score), and "suggestions" (an array of specific, actionable strings for improvement). Resume:\n\n${resumeText}`;
        const result = await jsonModel.generateContent(prompt);
        
        const resultText = result.response.text();
        res.status(200).json(JSON.parse(resultText));

    } catch (error) {
        console.error("AI ATS Score Error:", error);
        res.status(500).json({ message: 'Error calculating ATS score.' });
    }
};

const personalizeForJob = async (req, res) => {
    try {
        const { resumeData, jobDescription } = req.body;
        if (!jobDescription) return res.status(400).json({ message: "A job description is required." });
        
        const resumeText = resumeToString(resumeData);
        
        const prompt = `
            You are a smart, strategic, and adaptive AI career coach. Your primary goal is to provide a user with a personalized and realistic roadmap to significantly improve their resume for a specific job, no matter their starting point.
            Your process must follow this strategic logic:

            1.  **Analyze the User's Resume:** First, determine the user's current level based on their resume text (e.g., beginner, intermediate, or advanced). A resume with very little content is a beginner.
            2.  **Analyze the Job Description:** Second, determine the role's difficulty (e.g., easy, medium, or hard). A job requiring many years of experience and highly specialized skills is hard.
            3.  **Set a Realistic Goal:** Based on the combination of the user's level and the job's difficulty, set a realistic improvement goal and tailor your feedback accordingly, following these scenarios:
                * If the job is easy and the user is a beginner: Your goal is to get them to a **100% match**. Provide a complete, step-by-step guide.
                * If the job is medium and the user is a beginner: Your goal is to get them **as close to 100% as possible**. Your advice should be ambitious, focusing on the most critical skills to make them a top-tier candidate.
                * If the job is hard (e.g., a senior role at a top tech company) and the user is a beginner: Your goal is to help them reach a **medium level**. Your advice must be highly strategic, focusing on the absolute "must-have" qualifications to get their foot in the door.

            **Your entire response MUST be a single, valid JSON object** with the following keys, ordered to match a resume's structure. Even if the user's resume is empty, you must analyze the job description and provide valuable content for all keys.

            1.  **"strategicFeedback"**: A concise, one-paragraph summary explaining the user's current standing for the role and outlining the strategic goal of your feedback.
            2.  **"summary"**: An object containing "feedback" (a string of specific advice for this section) and "rewrittenText" (a completely rewritten, ready-to-use professional summary paragraph tailored to the job).
            3.  **"experience"**: An object containing "feedback" (a string of overall advice for this section) and "rewrittenItems" (an array of objects, where each object has "original" and "suggestion" keys for rewriting the user's work experience bullet points).
            4.  **"projects"**: An object containing "feedback" (a string of overall advice for this section), "rewrittenItems" (an array for rewriting project descriptions, same format as experience), and "newProjectIdeas" (an array of 2-3 new, relevant project ideas).
            5.  **"education"**: An object containing "feedback" (a string of advice, like relevant coursework to add) and "rewrittenItems" (an array for any suggested changes to their education entries).
            6.  **"skills"**: An object with "feedback" (a string of advice for this section), "missingSkills" (an array of crucial keywords to add), and "suggestedSkillsList" (a complete, rewritten comma-separated string of skills).
            
            --
            **User's Resume:**
            ${resumeText}
            --
            **Job Description:**
            ${jobDescription}
            -----
        `;
        
        const result = await jsonModel.generateContent(prompt);
        const responseText = result.response.text();
        
        
        const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        
        try {
            const parsedResult = JSON.parse(cleanedText);
            res.status(200).json(parsedResult);
        } catch (parseError) {
            console.error("JSON Parsing Error from AI response:", parseError);
            console.error("Original malformed text from AI:", responseText);
            res.status(500).json({ message: 'The AI returned a response in an unexpected format. Please try again.' });
        }
    } catch (error) {
        console.error("AI Personalization Error:", error);
        res.status(500).json({ message: 'An error occurred while personalizing the resume.' });
    }
};

module.exports = {
    improveWriting,
    getAtsScore,
    personalizeForJob,
};