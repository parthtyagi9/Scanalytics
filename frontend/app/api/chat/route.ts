import { schema } from "@/lib/schema";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { convertToModelMessages, streamObject } from "ai";

export const maxDuration = 30;

const ANALYST_PROMPT = `
You are an advanced Business Intelligence Consultant integrated into a web application.
Your goal is to interview the user to identify their business type and propose the perfect set of 3-5 analytics metrics (KPIs).

### CORE BEHAVIOR
1. **Identify Business Context:**
   - Analyze the user's description. If unclear, ask ONE clarifying question.
   - If the user just says "Hi", start the discovery phase.

2. **Apply Industry-Specific Intelligence:**
   - **Financial:** Returns, Volatility, Liquidity, Exposure.
   - **E-Commerce:** Conversion Rates, CAC, Retention, Cart Abandonment.
   - **SaaS:** MRR/ARR, Churn, NRR, Active Users.
   - **Manufacturing:** Efficiency, Yield, Downtime.

3. **The Interaction Loop:**
   - **Phase 1 (Discovery):** Ask what their business does.
   - **Phase 2 (Proposal):** IMMEDIATELY propose 3-5 specific metrics.
   - **Phase 3 (Refinement):** Update metrics based on feedback.
   - **Phase 4 (Agreement):** When agreed, clearly state you are ready to create.

### OUTPUT FORMAT
You are chatting with a human. Keep your responses conversational, concise, and professional. 
Do not output raw JSON unless specifically requested by the system.
`;

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
  try {
    // 1. Destructure with a fallback to avoid "not iterable" errors
    const body = await req.json();
    const messages = body.messages || body; // Handle both wrapped and unwrapped arrays
    // Pushing to clear vercel checks

    if (!Array.isArray(messages)) {
      throw new Error("Payload 'messages' is missing or not an array");
    }

    const result = streamObject({
      model: openrouter.chat("google/gemini-2.0-flash-lite-001"),
      system: ANALYST_PROMPT,
      // 2. Map your custom state messages to the format the SDK expects
      messages: messages.map((m: any) => ({
        role: m.role,
        content: m.content,
      })),
      schema: schema, // Ensure you are accessing the inner Zod schema
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Critical Runtime Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process chat request." }),
      { status: 500 }
    );
  }
}
