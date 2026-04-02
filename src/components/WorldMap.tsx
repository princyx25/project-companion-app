import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe } from "lucide-react";
import { classifyRisk, getRiskColor, getRiskLabel, formatNumber, type RiskLevel } from "@/lib/prediction-utils";

interface RegionData {
  id: string;
  label: string;
  x: number;
  y: number;
  prediction?: number;
}

const REGION_POSITIONS: RegionData[] = [
  { id: "usa", label: "🇺🇸 USA", x: 20, y: 38 },
  { id: "brazil", label: "🇧🇷 Brazil", x: 30, y: 65 },
  { id: "uk", label: "🇬🇧 UK", x: 47, y: 30 },
  { id: "france", label: "🇫🇷 France", x: 48, y: 38 },
  { id: "germany", label: "🇩🇪 Germany", x: 51, y: 33 },
  { id: "italy", label: "🇮🇹 Italy", x: 52, y: 40 },
  { id: "russia", label: "🇷🇺 Russia", x: 65, y: 28 },
  { id: "india", label: "🇮🇳 India", x: 68, y: 48 },
  { id: "china", label: "🇨🇳 China", x: 75, y: 38 },
];

interface WorldMapProps {
  predictions: Record<string, number>;
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
          {/* Simplified world outline using CSS */}
          <div className="absolute inset-0 opacity-10">
            <svg viewBox="0 0 100 50" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
              {/* Simplified continent shapes */}
              <ellipse cx="22" cy="20" rx="12" ry="8" fill="currentColor" className="text-foreground" /> {/* N America */}
              <ellipse cx="30" cy="34" rx="6" ry="10" fill="currentColor" className="text-foreground" /> {/* S America */}
              <ellipse cx="50" cy="18" rx="8" ry="7" fill="currentColor" className="text-foreground" /> {/* Europe */}
              <ellipse cx="55" cy="28" rx="10" ry="10" fill="currentColor" className="text-foreground" /> {/* Africa */}
              <ellipse cx="70" cy="22" rx="14" ry="10" fill="currentColor" className="text-foreground" /> {/* Asia */}
              <ellipse cx="85" cy="38" rx="6" ry="4" fill="currentColor" className="text-foreground" /> {/* Australia */}
            </svg>
          </div>

          {/* Region dots */}
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
            const risk = classifyRisk(pred);
            const colors = getRiskColor(risk);
            const size = getDotSize(risk);
            return (
              <div
                key={region.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                style={{ left: `${region.x}%`, top: `${region.y}%` }}
              >
                <div className={`${size} rounded-full ${colors.dot} animate-pulse shadow-lg`} />
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                  <div className="bg-popover text-popover-foreground border border-border rounded-lg px-3 py-2 text-xs shadow-lg whitespace-nowrap">
                    <p className="font-semibold">{region.label}</p>
                    <p>{formatNumber(pred)} cases</p>
                    <p className={colors.text}>{getRiskLabel(risk)}</p>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Legend */}
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
