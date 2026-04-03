import { getRiskColor, getRiskLabel, type RiskLevel } from "@/lib/prediction-utils";
import { Shield, ShieldAlert, ShieldCheck } from "lucide-react";

interface RiskIndicatorProps {
  risk: string;
  prediction: number;
}

const icons: Record<RiskLevel, React.ElementType> = {
  low: ShieldCheck,
  medium: Shield,
  high: ShieldAlert,
};

export function RiskIndicator({ risk: apiRisk, prediction }: RiskIndicatorProps) {
  const risk = apiRisk.toLowerCase() as RiskLevel;
  const colors = getRiskColor(risk);
  const label = getRiskLabel(risk);
  const Icon = icons[risk] || Shield;

  return (
    <div className={`flex flex-col items-center gap-3 rounded-xl border p-6 ${colors.bg} ${colors.border} animate-scale-in`}>
      <div className={`rounded-full p-3 ${colors.bg}`}>
        <Icon className={`h-8 w-8 ${colors.text}`} />
      </div>
      <div className="text-center">
        <p className={`text-xl font-bold ${colors.text}`}>{label}</p>
        <p className="text-sm text-muted-foreground mt-1">
          {risk === "low" && "Situation under control"}
          {risk === "medium" && "Escalation possible"}
          {risk === "high" && "Immediate action needed"}
        </p>
      </div>
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${colors.dot}`}
          style={{ width: risk === "low" ? "25%" : risk === "medium" ? "60%" : "95%" }}
        />
      </div>
    </div>
  );
}
