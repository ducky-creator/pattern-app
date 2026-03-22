import { getFrameworkPromptBlock } from "@/lib/frameworks";
import type { AiInsight, PatternEntry } from "@/lib/types";

const SYSTEM_PROMPT = `
You analyze behavioral logs using embedded neuroscience and psychology frameworks.

Requirements:
- Output valid JSON only.
- Use exactly these keys:
  frameworksApplied
  detectedPattern
  neuroscienceExplanation
  whyThisIsHappening
  risk
  recommendedAction
- frameworksApplied must be an array of 2 to 5 specific theories or systems.
- Total output must stay under 120 words.
- The neuroscienceExplanation must explicitly reference at least 2 of these systems:
  Reward system
  Emotional learning
  Threat response
  Cognitive control
  Habit formation
- Keep the writing sharp, analytical, and non-generic.
- Avoid emotional, therapeutic, or comforting language.
- Select only the most relevant frameworks from this library:
${getFrameworkPromptBlock()}
`.trim();

export async function generateNeuroscienceInsight(
  entries: PatternEntry[]
): Promise<AiInsight | null> {
  if (!process.env.OPENAI_API_KEY || entries.length === 0) {
    return null;
  }

  const model = process.env.OPENAI_MODEL ?? "gpt-4.1-mini";
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model,
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT
        },
        {
          role: "user",
          content: buildUserPrompt(entries)
        }
      ]
    }),
    cache: "no-store"
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as {
    choices?: Array<{
      message?: {
        content?: string;
      };
    }>;
  };

  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    return null;
  }

  try {
    const parsed = JSON.parse(content) as Partial<AiInsight>;

    if (
      !Array.isArray(parsed.frameworksApplied) ||
      parsed.frameworksApplied.length < 2 ||
      !parsed.detectedPattern ||
      !parsed.neuroscienceExplanation ||
      !parsed.whyThisIsHappening ||
      !parsed.risk ||
      !parsed.recommendedAction
    ) {
      return null;
    }

    return {
      frameworksApplied: parsed.frameworksApplied.filter(
        (value): value is string => typeof value === "string"
      ),
      detectedPattern: parsed.detectedPattern,
      neuroscienceExplanation: parsed.neuroscienceExplanation,
      whyThisIsHappening: parsed.whyThisIsHappening,
      risk: parsed.risk,
      recommendedAction: parsed.recommendedAction
    };
  } catch {
    return null;
  }
}

function buildUserPrompt(entries: PatternEntry[]) {
  const recentEntries = entries.slice(0, 10).map((entry) => ({
    trigger: entry.trigger,
    emotion: entry.emotion,
    intensity: entry.intensity,
    action: entry.action,
    createdAt: entry.createdAt
  }));

  return `
Analyze these behavioral logs.

Return structured insight in the required JSON format.
Reference at least 2 neuroscience systems.
Keep the entire response under 120 words.
Choose the most relevant theories from the embedded framework library.

Logs:
${JSON.stringify(recentEntries, null, 2)}
`.trim();
}
