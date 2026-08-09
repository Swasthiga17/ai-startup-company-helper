const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;
let model = null;
let GEMINI_AVAILABLE = false;

if (apiKey) {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
    GEMINI_AVAILABLE = true;
  } catch (err) {
    console.error('Gemini AI initialization failed:', err);
  }
}

function safeJsonParse(text, fallback) {
  try {
    // Clean code fences if returned by model
    let cleanText = text.trim();
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.substring(7, cleanText.length - 3).trim();
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.substring(3, cleanText.length - 3).trim();
    }
    return JSON.parse(cleanText);
  } catch (e) {
    console.error('Failed to parse Gemini response as JSON:', e);
    return fallback;
  }
}

async function analyzeMarket(idea, context = '') {
  if (!GEMINI_AVAILABLE) {
    return {
      target_market: { demographics: ['Urban professionals', 'Small business owners'], psychographics: ['Tech-savvy', 'Cost-conscious'] },
      market_size: { tam: '$50B', sam: '$15B', som: '$2B' },
      growth_potential: 'High - 15% CAGR expected',
      risks: ['Market saturation', 'Regulatory changes'],
    };
  }
  try {
    const prompt = `You are a professional Market Research Analyst.
Analyze the startup idea: ${idea}
Additional knowledge base context: ${context}

Return strictly as JSON:
{
  "target_market": {
    "demographics": ["string"],
    "psychographics": ["string"]
  },
  "market_size": {
    "tam": "string",
    "sam": "string",
    "som": "string"
  },
  "growth_potential": "string",
  "risks": ["string"]
}`;
    const result = await model.generateContent({
      contents: prompt,
      generationConfig: { responseMimeType: 'application/json' },
    });
    return safeJsonParse(result.response.text(), {
      target_market: { demographics: [], psychographics: [] },
      market_size: { tam: 'N/A', sam: 'N/A', som: 'N/A' },
      growth_potential: 'N/A',
      risks: [],
    });
  } catch (err) {
    console.error('Market agent error:', err);
    return {
      target_market: { demographics: ['Urban professionals'], psychographics: ['Tech-savvy'] },
      market_size: { tam: '$50B', sam: '$15B', som: '$2B' },
      growth_potential: 'High',
      risks: ['Market saturation'],
    };
  }
}

async function analyzeCompetitors(idea) {
  if (!GEMINI_AVAILABLE) {
    return {
      competitors: [
        { name: 'Competitor A', market_share: '25%', strengths: ['Brand recognition'], weaknesses: ['Legacy tech'], competitive_advantage: 'Low pricing' },
        { name: 'Competitor B', market_share: '18%', strengths: ['Low pricing'], weaknesses: ['Poor UX'], competitive_advantage: 'Market presence' },
        { name: 'Competitor C', market_share: '12%', strengths: ['Innovation'], weaknesses: ['Small scale'], competitive_advantage: 'Niche focus' },
      ],
    };
  }
  try {
    const prompt = `Analyze potential competitors for: ${idea}

Return strictly as JSON:
{
  "competitors": [
    {
      "name": "string",
      "strengths": ["string"],
      "weaknesses": ["string"],
      "market_share": "string",
      "competitive_advantage": "string"
    }
  ]
}`;
    const result = await model.generateContent({
      contents: prompt,
      generationConfig: { responseMimeType: 'application/json' },
    });
    return safeJsonParse(result.response.text(), { competitors: [] });
  } catch (err) {
    console.error('Competitor agent error:', err);
    return { competitors: [] };
  }
}

async function analyzeSwot(idea) {
  if (!GEMINI_AVAILABLE) {
    return {
      strengths: ['Strong technical team', 'Innovative product', 'Low operational costs'],
      weaknesses: ['Limited brand recognition', 'Small customer base', 'Dependency on key personnel'],
      opportunities: ['Growing market demand', 'Technology advancement', 'Partnership potential'],
      threats: ['New market entrants', 'Economic uncertainty', 'Regulatory changes'],
    };
  }
  try {
    const prompt = `Perform SWOT analysis for: ${idea}

Return strictly as JSON:
{
  "strengths": ["string"],
  "weaknesses": ["string"],
  "opportunities": ["string"],
  "threats": ["string"]
}`;
    const result = await model.generateContent({
      contents: prompt,
      generationConfig: { responseMimeType: 'application/json' },
    });
    return safeJsonParse(result.response.text(), { strengths: [], weaknesses: [], opportunities: [], threats: [] });
  } catch (err) {
    console.error('SWOT agent error:', err);
    return { strengths: [], weaknesses: [], opportunities: [], threats: [] };
  }
}

async function analyzeBusinessModel(idea) {
  if (!GEMINI_AVAILABLE) {
    return {
      revenue_streams: ['Subscription', 'Enterprise', 'API', 'Consulting'],
      cost_structure: ['Development', 'Marketing', 'Operations', 'Support'],
      key_metrics: ['MRR', 'CAC', 'LTV', 'Churn Rate'],
    };
  }
  try {
    const prompt = `Create a business model for: ${idea}

Return strictly as JSON:
{
  "revenue_streams": ["string"],
  "cost_structure": ["string"],
  "key_metrics": ["string"]
}`;
    const result = await model.generateContent({
      contents: prompt,
      generationConfig: { responseMimeType: 'application/json' },
    });
    return safeJsonParse(result.response.text(), { revenue_streams: [], cost_structure: [], key_metrics: [] });
  } catch (err) {
    console.error('Business model agent error:', err);
    return { revenue_streams: [], cost_structure: [], key_metrics: [] };
  }
}

async function analyzeMvp(idea) {
  if (!GEMINI_AVAILABLE) {
    return {
      phases: [
        { phase: 'Phase 1', title: 'Discovery & Planning', duration: '4 weeks', tasks: ['Market research', 'User interviews', 'Technical architecture'] },
        { phase: 'Phase 2', title: 'MVP Development', duration: '12 weeks', tasks: ['Core features', 'UI/UX design', 'Backend setup'] },
        { phase: 'Phase 3', title: 'Beta Launch', duration: '8 weeks', tasks: ['User testing', 'Bug fixes', 'Performance optimization'] },
      ],
    };
  }
  try {
    const prompt = `Create an MVP roadmap for: ${idea}

Return strictly as JSON:
{
  "phases": [
    {
      "phase": "string",
      "title": "string",
      "duration": "string",
      "tasks": ["string"]
    }
  ]
}`;
    const result = await model.generateContent({
      contents: prompt,
      generationConfig: { responseMimeType: 'application/json' },
    });
    return safeJsonParse(result.response.text(), { phases: [] });
  } catch (err) {
    console.error('MVP agent error:', err);
    return { phases: [] };
  }
}

async function analyzeRevenue(idea) {
  if (!GEMINI_AVAILABLE) {
    return {
      projections: [
        { year: 'Year 1', revenue: 0.5, users: 1000, growth: 0 },
        { year: 'Year 2', revenue: 2.5, users: 10000, growth: 400 },
        { year: 'Year 3', revenue: 8.0, users: 50000, growth: 220 },
        { year: 'Year 4', revenue: 18.0, users: 150000, growth: 125 },
        { year: 'Year 5', revenue: 35.0, users: 400000, growth: 94 },
      ],
      revenue_streams: ['Subscription', 'Enterprise', 'API', 'Consulting'],
    };
  }
  try {
    const prompt = `Create a 5-year revenue forecast for: ${idea}

Return strictly as JSON:
{
  "projections": [
    {"year": "string", "revenue": number, "users": number, "growth": number}
  ],
  "revenue_streams": ["string"]
}`;
    const result = await model.generateContent({
      contents: prompt,
      generationConfig: { responseMimeType: 'application/json' },
    });
    return safeJsonParse(result.response.text(), { projections: [], revenue_streams: [] });
  } catch (err) {
    console.error('Revenue agent error:', err);
    return { projections: [], revenue_streams: [] };
  }
}

async function scoreStartup(idea) {
  if (!GEMINI_AVAILABLE) {
    return {
      overall_score: 7.5,
      market_potential: 8.5,
      innovation_level: 7.8,
      feasibility: 7.2,
      risk_factor: 3.5,
      summary: 'Strong market opportunity with innovative approach. Moderate risk profile.',
    };
  }
  try {
    const prompt = `Score this startup idea: ${idea}

Return strictly as JSON:
{
  "overall_score": number,
  "market_potential": number,
  "innovation_level": number,
  "feasibility": number,
  "risk_factor": number,
  "summary": "string"
}`;
    const result = await model.generateContent({
      contents: prompt,
      generationConfig: { responseMimeType: 'application/json' },
    });
    return safeJsonParse(result.response.text(), {
      overall_score: 7.0,
      market_potential: 7.0,
      innovation_level: 7.0,
      feasibility: 7.0,
      risk_factor: 5.0,
      summary: '',
    });
  } catch (err) {
    console.error('Score agent error:', err);
    return {
      overall_score: 7.5,
      market_potential: 8.5,
      innovation_level: 7.8,
      feasibility: 7.2,
      risk_factor: 3.5,
      summary: '',
    };
  }
}

async function generatePitchDeck(idea) {
  if (!GEMINI_AVAILABLE) {
    return {
      slides: [
        { title: 'Problem', content: 'The problem your startup solves' },
        { title: 'Solution', content: 'Your unique value proposition' },
        { title: 'Market', content: 'TAM/SAM/SOM analysis' },
        { title: 'Product', content: 'Key features and demo' },
        { title: 'Business Model', content: 'Revenue streams and pricing' },
        { title: 'Competition', content: 'Competitive landscape' },
        { title: 'Team', content: 'Core team members' },
        { title: 'Financials', content: 'Revenue projections' },
        { title: 'Ask', content: 'Funding requirements' },
        { title: 'Contact', content: 'Get in touch' },
      ],
    };
  }
  try {
    const prompt = `Create a pitch deck outline for: ${idea}

Return strictly as JSON:
{
  "slides": [
    {"title": "string", "content": "string"}
  ]
}`;
    const result = await model.generateContent({
      contents: prompt,
      generationConfig: { responseMimeType: 'application/json' },
    });
    return safeJsonParse(result.response.text(), { slides: [] });
  } catch (err) {
    console.error('Pitch agent error:', err);
    return { slides: [] };
  }
}

async function answerChat(message, idea) {
  if (!GEMINI_AVAILABLE) {
    return `As your AI Co-Founder, I'm analyzing your question about "${idea}". Since the Gemini API is offline, here's a placeholder reply focusing on startup growth advice.`;
  }
  try {
    const prompt = `You are the AI Co-Founder for the startup: ${idea}.
The user asks: "${message}"
Respond conversationally, providing actionable advice. Keep it under 200 words.`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    console.error('Chat response error:', err);
    return 'I encountered an error trying to process your request. Let me know how else I can assist you.';
  }
}

async function generateDocument(docType, idea) {
  if (!GEMINI_AVAILABLE) {
    return `[MOCK DOCUMENT: ${docType.toUpperCase()}]

Based on your startup description:
"${idea}"

Here is a professional document outline generated by our AI consulting agent team:

1. EXECUTIVE SUMMARY
- Primary Value Proposition: Customized solutions for specific industry niches.
- Problem Solved: Inefficiencies and high operation costs.

2. TARGET MARKET AUDIENCE
- Focus: Urban professionals, early adopters, and SMEs.
- Demand: High CAGR growth over the next 5 years.

3. STRATEGIC REACTION
- Pricing: Subscription-based SaaS models with usage APIs.
- Customer CAC reduction: Targeted LinkedIn search and cold pitches.

For full custom AI content, please activate your Gemini credentials.`;
  }
  try {
    const prompts = {
      business_plan: `Write a comprehensive, professional Business Plan for: ${idea}. Include Executive Summary, Market Opportunity, Product Offerings, Business Model, Financial Plan, and Execution Strategy. Keep it detailed and structured.`,
      executive_summary: `Write a high-impact Executive Summary for: ${idea}. Outline the problem, unique value proposition, target market size, and funding requirements.`,
      one_pager: `Create a one-page investment teaser for: ${idea}. Include quick metrics, problem description, solution description, and the investment ask.`,
      investor_email: `Draft a professional, compelling investor introduction email for: ${idea}. Make it concise, highlighting traction and asking for a brief meeting.`,
      cold_email: `Draft a cold outreach email to potential partners or customers for: ${idea}. Highlight the core value proposition and call to action.`,
      linkedin_pitch: `Draft a LinkedIn connection message template to pitch: ${idea} to industry partners. Keep it under 300 characters.`,
      elevator_pitch: `Write a persuasive 30-second elevator pitch for: ${idea}. Make it engaging and easy to understand.`
    };
    
    const promptText = prompts[docType] || `Write a professional business report for: ${idea}`;
    const result = await model.generateContent(promptText);
    return result.response.text();
  } catch (err) {
    console.error('Document agent error:', err);
    return `[Error generating document: ${docType}] Fallback text.`;
  }
}

module.exports = {
  analyzeMarket,
  analyzeCompetitors,
  analyzeSwot,
  analyzeBusinessModel,
  analyzeMvp,
  analyzeRevenue,
  scoreStartup,
  generatePitchDeck,
  answerChat,
  generateDocument,
  GEMINI_AVAILABLE,
};
