import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { convertToModelMessages, streamText, UIMessage } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    /**
     * LOGIC EQUIVALENT TO YOUR PYTHON CLEAN_HISTORY:
     * The AI SDK's `convertToModelMessages` utility handles the complexity
     * of mapping roles (user/assistant) and extracting content from parts.
     */
// 1. Define the Prompt as a constant
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

// 2. Use it in your streamText call
const result = streamText({
  model: openrouter.chat("google/gemini-2.0-flash-lite-001"),
  system: ANALYST_PROMPT, // <--- Inject the new prompt here
  messages: await convertToModelMessages(messages),
});

    /**
     * DATA STREAMING:
     * We use `toUIMessageStreamResponse` to ensure the metadata,
     * reasoning tokens (if applicable), and text parts are formatted
     * correctly for your frontend hook.
     */
    return result.toUIMessageStreamResponse({
      // Forwarding reasoning if using models like DeepSeek-R1 or Claude 3.7
      sendReasoning: true,
      // Example of custom error masking (similar to your try/except logic)
      onError: (error) => {
        console.error("Chat Analyst Endpoint Error:", error);
        return "Internal System Error: Analytics Engine Offline.";
      },
    });
  } catch (error) {
    console.error("Critical Runtime Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process chat request." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
