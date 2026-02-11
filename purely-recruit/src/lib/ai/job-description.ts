import { anthropic, AI_MODEL } from "./client";

export async function generateJobDescription(input: {
  title: string;
  department?: string;
  locationType?: string;
  employmentType?: string;
  industry?: string;
  notes?: string;
}): Promise<{
  description: string;
  requirements: string;
  goodIndicators: string[];
  badIndicators: string[];
  suggestedSkills: { name: string; importance: "mandatory" | "required" | "optional" }[];
}> {
  const response = await anthropic.messages.create({
    model: AI_MODEL,
    max_tokens: 4096,
    messages: [{
      role: "user",
      content: `Generate a professional job posting. Return ONLY valid JSON.

Title: ${input.title}
Department: ${input.department || "N/A"}
Location Type: ${input.locationType || "N/A"}
Employment Type: ${input.employmentType || "full_time"}
Industry: ${input.industry || "N/A"}
Additional Notes: ${input.notes || "N/A"}

Return:
{
  "description": "full job description (3-5 paragraphs)",
  "requirements": "bullet-point requirements",
  "goodIndicators": ["5-8 positive signals to look for in candidates"],
  "badIndicators": ["3-5 red flags to watch for"],
  "suggestedSkills": [
    {"name": "skill", "importance": "mandatory|required|optional"},
  ]
}`
    }],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "{}";
  return JSON.parse(text);
}
