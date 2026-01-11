This Product Requirements Document (PRD) outlines the frontend architecture and product logic for **ScanalyticsAI**, an AI-driven B2B SaaS platform that transforms business descriptions into automated observability suites.

---

## 📄 Product Requirements Document (PRD): ScanalyticsAI

### 1. Project Overview

**ScanalyticsAI** is a high-level observability intelligence layer. Unlike traditional analytics (which show what happened), ScanalyticsAI uses AI to determine **what should be happening** based on a business's specific model. It generates the database schema, the SQL queries for business logic, and the error thresholds automatically from a simple text description.

**Tech Stack:**

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (TS)
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui (Radix UI primitives)
- **State Management:** React Context / TanStack Query (Mocked)

---

### 2. User Flows & Route Specifications

#### **A. Authentication Layer**

- **`app/(auth)/login/page.tsx`**
- **Sections:** Brand Hero Header, Credentials Form (Email/Password), OAuth Provider Grid (GitHub/Google), Password Recovery Link, "Need an account?" Redirect.

- **`app/(auth)/register/page.tsx`**
- **Sections:** "Join the Intelligence Layer" Value Prop, Combined User/Organization Form, Industry Vertical Selector, "Build my Workspace" Submit Button.

#### **B. The "Engine" Onboarding**

- **`app/onboarding/page.tsx`**
- **Sections:** Multi-step Progress Tracker (Description -> Blueprint -> Finalize), Rich Text Area for Startup Description, "AI Thinking" Skeleton State, Generated Event Schema Cards (e.g., `user_signup`, `payment_success`), Editable Column/Type Table for PostgreSQL, Generated SQL Insight Cards with Threshold Logic (e.g., "Alert if Conversion < 3%"), "Commit to Database" Action.

#### **C. The Insights Dashboard**

- **`app/dashboard/layout.tsx`**
- **Sections:** shadcn Sidebar Nav, Organization Switcher, Real-time "Engine Pulse" Status Indicator, Top Nav Search and Profile.

- **`app/dashboard/page.tsx`**
- **Sections:** Macro Health Score Gauge (0-100), Metric Highlight Grid (Event Volume, Active Alerts, Logic Coverage), AI-Written "Executive Summary" (Daily business health narrative), Mini-Charts for Traffic vs. Errors.

- **`app/insights/page.tsx`**
- **Sections:** Global "Refresh Engine" Button, List of AI SQL Queries, SQL Syntax-Highlighter Code Blocks, Threshold Comparison Bars (Current vs. Target), "Insight Value" tooltips (Why this query matters for the business).

#### **D. Technical & Debugging**

- **`app/observability/page.tsx`**
- **Sections:** Error Frequency Heatmap, "Top Impacting Failures" List, AI-Assisted Debugging Suggestions, Live Raw Event Stream (Log Table), Filter/Search Bar.

- **`app/integration/page.tsx`**
- **Sections:** API Key Management (Masked Keys), SDK Installation Snippets (npm/yarn/pnpm), Google Analytics Connection Status, PostgreSQL Sink Configuration, "Send Test Event" Playground.

---

### 3. Component Architecture (shadcn/ui)

| Feature             | Component Strategy                                                      |
| ------------------- | ----------------------------------------------------------------------- |
| **Main Navigation** | `Sidebar` & `NavigationMenu` for deep routing.                          |
| **Data Display**    | `DataTable` for logs, `Card` for SQL insights and metrics.              |
| **User Input**      | `Textarea` for AI descriptions, `Switch` for toggling generated events. |
| **Feedback**        | `Progress` for engine runs, `Toast` for threshold breaches.             |
| **Layout**          | `Resizable` panels for the SQL Editor vs. Results view.                 |

---

### 4. Technical Features (AI Observability)

- **Dynamic Thresholding:** Instead of static numbers, the UI displays thresholds generated based on the business description (e.g., a "High Frequency" app gets different thresholds than a "Luxury Real Estate" app).
- **The "Refresh" Engine:** A frontend mock function that simulates the backend running SQL against the PostgreSQL instance and updating the `status` (Healthy/Warning/Critical) of each insight card.
- **Contextual SDKs:** Code snippets that dynamically include the user's `ProjectID` and the specific events the AI just generated during onboarding.

---

### 5. High-Level Logic Diagram

---

### 6. Next Steps for Implementation

1. **Initialize Next.js 16 Project** with Tailwind and TypeScript.
2. **Install shadcn/ui** components (Card, Button, Input, Table, Sidebar).
3. **Build the Onboarding Engine** UI to handle the transition from "Text Description" to "Generated Schema."
4. **Develop the Mock Engine** to simulate SQL data returning to the Dashboard.

**Would you like me to generate the `app/onboarding/page.tsx` code now, using Tailwind and shadcn, including the "AI Generation" simulation logic?**
