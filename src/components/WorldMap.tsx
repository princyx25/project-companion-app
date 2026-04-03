import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe } from "lucide-react";
import { getRiskColor, getRiskLabel, formatNumber, type RiskLevel } from "@/lib/prediction-utils";
import { PredictionResult } from "@/hooks/usePrediction";

interface RegionData {
  id: string;
  label: string;
  x: number;
  y: number;
}

const REGION_POSITIONS: RegionData[] = [
  { id: "United States", label: "🇺🇸 USA", x: 20, y: 38 },
  { id: "Brazil", label: "🇧🇷 Brazil", x: 30, y: 65 },
  { id: "France", label: "🇫🇷 France", x: 48, y: 38 },
  { id: "Germany", label: "🇩🇪 Germany", x: 51, y: 33 },
  { id: "Italy", label: "🇮🇹 Italy", x: 52, y: 40 },
  { id: "Russia", label: "🇷🇺 Russia", x: 65, y: 28 },
  { id: "India", label: "🇮🇳 India", x: 68, y: 48 },
  { id: "China", label: "🇨🇳 China", x: 75, y: 38 },
  { id: "Japan", label: "🇯🇵 Japan", x: 82, y: 36 },
  { id: "Australia", label: "🇦🇺 Australia", x: 83, y: 70 },
  { id: "Canada", label: "🇨🇦 Canada", x: 18, y: 28 },
  { id: "Mexico", label: "🇲🇽 Mexico", x: 16, y: 48 },
  { id: "Spain", label: "🇪🇸 Spain", x: 46, y: 42 },
  { id: "South Africa", label: "🇿🇦 S. Africa", x: 55, y: 72 },
];

interface WorldMapProps {
  predictions: Record<string, PredictionResult>;
}

function getDotSize(risk: RiskLevel): string {
  switch (risk) {
    case "low": return "h-3 w-3";
    case "medium": return "h-4 w-4";
    case "high": return "h-5 w-5";
  }
}

export function WorldMap({ predictions }: WorldMapProps) {
  return (
    <Card className="animate-fade-in border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Globe className="h-5 w-5 text-primary" />
          Global Hotspot Map
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full aspect-[2/1] bg-muted/30 rounded-lg overflow-hidden border border-border/30">
          <div className="absolute inset-0 opacity-10">
            <svg viewBox="0 0 100 50" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
              <ellipse cx="22" cy="20" rx="12" ry="8" fill="currentColor" className="text-foreground" />
              <ellipse cx="30" cy="34" rx="6" ry="10" fill="currentColor" className="text-foreground" />
              <ellipse cx="50" cy="18" rx="8" ry="7" fill="currentColor" className="text-foreground" />
              <ellipse cx="55" cy="28" rx="10" ry="10" fill="currentColor" className="text-foreground" />
              <ellipse cx="70" cy="22" rx="14" ry="10" fill="currentColor" className="text-foreground" />
              <ellipse cx="85" cy="38" rx="6" ry="4" fill="currentColor" className="text-foreground" />
            </svg>
          </div>

          {REGION_POSITIONS.map((region) => {
            const pred = predictions[region.id];
            if (!pred) {
              return (
                <div
                  key={region.id}
                  className="absolute h-2 w-2 rounded-full bg-muted-foreground/30 -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${region.x}%`, top: `${region.y}%` }}
                  title={`${region.label} — No data`}
                />
              );
            }
            const risk = (pred.risk || "low").toLowerCase() as RiskLevel;
            const colors = getRiskColor(risk);
            const size = getDotSize(risk);
            return (
              <div
                key={region.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                style={{ left: `${region.x}%`, top: `${region.y}%` }}
              >
                <div className={`${size} rounded-full ${colors.dot} animate-pulse shadow-lg`} />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                  <div className="bg-popover text-popover-foreground border border-border rounded-lg px-3 py-2 text-xs shadow-lg whitespace-nowrap">
                    <p className="font-semibold">{region.label}</p>
                    <p>{formatNumber(pred.prediction)} predicted</p>
                    <p>{formatNumber(pred.current_cases)} current</p>
                    <p className={colors.text}>{getRiskLabel(risk)}</p>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="absolute bottom-2 right-2 bg-card/90 backdrop-blur-sm border border-border/50 rounded-md px-3 py-2 text-xs space-y-1">
            <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-emerald-500" /> Low</div>
            <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-amber-500" /> Medium</div>
            <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-red-500" /> High</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
