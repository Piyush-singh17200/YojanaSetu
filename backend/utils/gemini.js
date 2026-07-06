const { GoogleGenerativeAI } = require("@google/generative-ai");

// Helper to interact with Gemini API
async function queryAssistant(userMessage, userProfile = {}, allSchemes = []) {
  const apiKey = process.env.GEMINI_API_KEY;

  // Compile schemes text context for LLM RAG injection
  const contextText = allSchemes
    .map((s) => {
      return `- ID: ${s.id}\n  Name: ${s.name}\n  Benefit: ${s.benefit}\n  Eligibility: ${s.eligibility}\n  Tagline: ${s.tagline}`;
    })
    .join("\n\n");

  const profileText = JSON.stringify(userProfile);

  const prompt = `You are YojanaSetu AI Assistant, an expert on Indian government welfare schemes.
Your task is to analyze the citizen's query, profile, and guide them to eligible schemes.

Here is the database of available schemes:
${contextText}

Here is the citizen's profile details:
${profileText}

The citizen asks: "${userMessage}"

Guide them clearly, matching their profile against eligible schemes. Highlight the benefits they qualify for, explain why, and lay out simple next steps.
Keep your response professional, structured, and easy to read. Use bullet points where appropriate.`;

  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    console.log("No VITE/GEMINI API key found. Using smart heuristic assistant fallback.");
    return fallbackResponse(userMessage, userProfile, allSchemes);
  }

  try {
    const ai = new GoogleGenerativeAI(apiKey);
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    return result.response.text();
  } catch (err) {
    console.error("Gemini API call failed, falling back:", err);
    return fallbackResponse(userMessage, userProfile, allSchemes);
  }
}

// Smart local matching fallback if API key is missing or calls fail
function fallbackResponse(msg, profile, schemes) {
  const term = msg.toLowerCase();
  
  // Find schemes whose category matches terms
  let matches = schemes.filter((s) => {
    return (
      s.name.toLowerCase().includes(term) ||
      s.category.toLowerCase().includes(term) ||
      s.dept.toLowerCase().includes(term) ||
      s.tagline.toLowerCase().includes(term)
    );
  });

  if (matches.length === 0) {
    // Return general category match based on occupation
    const occ = (profile.occupation || "").toLowerCase();
    if (occ.includes("student")) {
      matches = schemes.filter(s => s.category === "education");
    } else if (occ.includes("farmer")) {
      matches = schemes.filter(s => s.category === "agriculture");
    } else {
      matches = schemes.slice(0, 2);
    }
  }

  if (matches.length > 0) {
    let response = `Based on your request, I found some relevant schemes you may qualify for:\n\n`;
    matches.forEach((s) => {
      const eligArr = Array.isArray(s.eligibility) ? s.eligibility : JSON.parse(s.eligibility || "[]");
      response += `*   **${s.name}**: Offers ${s.benefit}. Eligibility: ${eligArr.slice(0, 2).join(", ")}.\n`;
    });
    response += `\nGo to the Schemes tab to view the complete details and print your required document checklists!`;
    return response;
  }

  return "I analyzed your profile details, but I couldn't find specific matches for that query. Try asking about 'scholarships', 'farming subsidies', or 'business loans'.";
}

module.exports = {
  queryAssistant
};
