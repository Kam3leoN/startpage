/** Outils IA — FAB menu (inspiré materialYouNewTab). */
export interface AiTool {
  id: string;
  label: string;
  url: string;
  /** Icône K3UI (classic) — fallback visuel si asset absent. */
  icon: string;
}

export const AI_TOOLS: AiTool[] = [
  { id: "chatgpt", label: "ChatGPT", url: "https://chat.openai.com/", icon: "magnifying-glass" },
  { id: "gemini", label: "Gemini", url: "https://gemini.google.com/", icon: "sun" },
  { id: "claude", label: "Claude", url: "https://claude.ai/", icon: "person" },
  { id: "copilot", label: "Copilot", url: "https://copilot.microsoft.com/", icon: "gear" },
  { id: "firefly", label: "Firefly", url: "https://firefly.adobe.com/", icon: "image" },
];
