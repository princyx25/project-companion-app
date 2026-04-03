import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { History, Trash2 } from "lucide-react";
import { HistoryEntry } from "@/hooks/usePrediction";
import { formatNumber, getRiskColor, getRiskLabel, type RiskLevel } from "@/lib/prediction-utils";

interface PredictionHistoryProps {
  history: HistoryEntry[];
  onClear: () => void;
  regions: { value: string; label: string }[];
}

export function PredictionHistory({ history, onClear, regions }: PredictionHistoryProps) {
  if (history.length === 0) return null;

  const getRegionLabel = (val: string) => regions.find((r) => r.value === val)?.label || val;

  return (
    <Card className="animate-fade-in border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-base">
          <History className="h-5 w-5 text-primary" />
          Prediction History
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onClear} className="text-muted-foreground hover:text-destructive">
          <Trash2 className="h-4 w-4 mr-1" /> Clear
        </Button>
      </CardHeader>
      <CardContent>
        <div className="max-h-[300px] overflow-auto rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Region</TableHead>
                <TableHead className="text-right">Day</TableHead>
                <TableHead className="text-right">Current</TableHead>
                <TableHead className="text-right">Predicted</TableHead>
                <TableHead className="text-right">Growth</TableHead>
                <TableHead>Risk</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((entry) => {
                const risk = (entry.result.risk || "low").toLowerCase() as RiskLevel;
                const colors = getRiskColor(risk);
                return (
                  <TableRow key={entry.id}>
                    <TableCell className="text-muted-foreground text-xs">
                      {entry.timestamp.toLocaleTimeString()}
                    </TableCell>
                    <TableCell className="text-sm">{getRegionLabel(entry.region)}</TableCell>
                    <TableCell className="text-right font-medium">{entry.day}</TableCell>
                    <TableCell className="text-right font-mono">{formatNumber(entry.result.current_cases)}</TableCell>
                    <TableCell className="text-right font-mono">{formatNumber(entry.result.prediction)}</TableCell>
                    <TableCell className="text-right font-mono">{entry.result.growth_percent.toFixed(1)}%</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${colors.text} ${colors.border} ${colors.bg} text-xs`}>
                        {getRiskLabel(risk)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
