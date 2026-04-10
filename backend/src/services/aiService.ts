import OpenAI from "openai";
import type { AIParseResponse } from "../types";

const getClient = (): OpenAI => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }
  return new OpenAI({
    apiKey,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
  });
};

// Helper: retry with exponential backoff for 429 errors
const withRetry = async <T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> => {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: unknown) {
      const isRateLimit =
        error instanceof Error && error.message.includes("429");

      if (isRateLimit && attempt < maxRetries) {
        const waitMs = Math.pow(2, attempt) * 2000;
        console.error("--- RATE LIMIT ERROR DETECTED ---");
        try {
          // The OpenAI SDK wraps the Gemini error, let's see inside
          console.error(JSON.stringify(error, null, 2));
        } catch (e) {
          console.error(error);
        }
        console.log(`Rate limited (429). Retrying in ${waitMs}ms... (attempt ${attempt + 1}/${maxRetries})`);
        await new Promise((resolve) => setTimeout(resolve, waitMs));
        continue;
      }

      throw error;
    }
  }

  throw new Error("Max retries reached");
};

export const parseAndSuggest = async (
  jobDescription: string
): Promise<AIParseResponse> => {
  const client = getClient();

  const response = await withRetry(() =>
    client.chat.completions.create({
      model: "gemini-2.5-flash",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are a job description parser AND resume writing expert. You will do TWO things in a single response:

1. PARSE the job description to extract structured info.
2. GENERATE 5 tailored resume bullet points for a candidate applying to the role.

Each resume bullet point should:
- Start with a strong action verb
- Include quantifiable results where possible
- Be specific to the role and required skills
- Be concise (1-2 lines)

Return a single JSON object with exactly this structure:
{
  "parsed": {
    "company": "company name (string)",
    "role": "job title/role (string)",
    "requiredSkills": ["array of required skills"],
    "niceToHaveSkills": ["array of nice-to-have/preferred skills"],
    "seniority": "seniority level like Junior, Mid, Senior, Lead, Staff, Principal (string)",
    "location": "job location or Remote (string)",
    "salaryRange": "salary range if mentioned, otherwise empty string (string)"
  },
  "suggestions": [
    { "id": "1", "text": "resume bullet point" },
    { "id": "2", "text": "resume bullet point" },
    { "id": "3", "text": "resume bullet point" },
    { "id": "4", "text": "resume bullet point" },
    { "id": "5", "text": "resume bullet point" }
  ]
}

If a parsed field cannot be determined, use a sensible default: empty string for strings, empty array for arrays.`,
        },
        {
          role: "user",
          content: `Parse this job description and generate resume suggestions:\n\n${jobDescription.slice(0, 3000)}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 2000,
    })
  );

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response from AI");
  }

  console.log("Raw AI Output:", content);
  
  // Clean markdown json blocks if present
  const cleanedContent = content.replace(/```json\n?/g, "").replace(/```\n?/g, "");

  let result;
  try {
    result = JSON.parse(cleanedContent);
  } catch (e) {
    console.error("JSON parsing failed. Content was:", cleanedContent);
    throw new Error("AI returned malformed data format.");
  }

  // Handle both { parsed: { company } } and { company } structures
  const parsedJD = result.parsed || result;
  const suggestionsList = result.suggestions || result.parsed?.suggestions || [];

  // Validate required fields
  if (!parsedJD.company || !parsedJD.role) {
    console.error("Extracted structure missing company/role:", result);
    throw new Error("AI could not extract company name or role from the job description");
  }

  return {
    parsed: {
      company: parsedJD.company,
      role: parsedJD.role,
      requiredSkills: parsedJD.requiredSkills || [],
      niceToHaveSkills: parsedJD.niceToHaveSkills || [],
      seniority: parsedJD.seniority || "",
      location: parsedJD.location || "",
      salaryRange: parsedJD.salaryRange || "",
    },
    suggestions: suggestionsList,
  };
};
