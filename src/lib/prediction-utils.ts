export type RiskLevel = "low" | "medium" | "high";

export function classifyRisk(prediction: number): RiskLevel {
  if (prediction < 10000) return "low";
  if (prediction <= 100000) return "medium";
  return "high";
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(Math.round(num));
}

export function getRiskColor(risk: RiskLevel) {
  switch (risk) {
    case "low":
      return { bg: "bg-emerald-500/15", text: "text-emerald-500", border: "border-emerald-500/30", dot: "bg-emerald-500" };
    case "medium":
      return { bg: "bg-amber-500/15", text: "text-amber-500", border: "border-amber-500/30", dot: "bg-amber-500" };
    case "high":
      return { bg: "bg-red-500/15", text: "text-red-500", border: "border-red-500/30", dot: "bg-red-500" };
  }
}

export function getRiskLabel(risk: RiskLevel): string {
  switch (risk) {
    case "low": return "Low Risk";
    case "medium": return "Medium Risk";
    case "high": return "High Risk";
  }
}

export function getAIInsight(risk: RiskLevel, prediction: number, day: number): string {
  switch (risk) {
    case "low":
      return `Based on AI analysis, the predicted ${formatNumber(prediction)} cases by day ${day} indicates a controlled outbreak. Current containment measures appear effective. Continue monitoring and maintain preventive protocols.`;
    case "medium":
      return `⚠️ AI models project ${formatNumber(prediction)} cases by day ${day}, signaling escalating transmission. Recommend increasing testing capacity, enforcing social distancing, and preparing healthcare surge plans.`;
    case "high":
      return `🚨 Critical alert: AI predicts ${formatNumber(prediction)} cases by day ${day}. This indicates exponential growth requiring immediate intervention — lockdowns, mass vaccination drives, and emergency resource allocation are strongly advised.`;
  }
}

export interface PredictionDataPoint {
  day: number;
  cases: number;
}

export function generateHistoricalData(targetDay: number, targetCases: number): PredictionDataPoint[] {
  const points: PredictionDataPoint[] = [];
  const numPoints = Math.min(targetDay, 10);
  
  for (let i = 0; i < numPoints; i++) {
    const day = Math.round((targetDay / (numPoints + 1)) * (i + 1));
    const ratio = day / targetDay;
    const cases = Math.round(targetCases * Math.pow(ratio, 1.8) * (0.85 + Math.random() * 0.3));
    points.push({ day, cases: Math.max(0, cases) });
  }
  
  return points;
}
