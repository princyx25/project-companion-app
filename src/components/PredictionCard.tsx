import { useEffect, useState } from "react";
import { TrendingUp, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/lib/prediction-utils";

interface PredictionCardProps {
  prediction: number;
  day: number;
  previousPrediction?: number;
}

export function PredictionCard({ prediction, day, previousPrediction }: PredictionCardProps) {
  const [displayNum, setDisplayNum] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const stepTime = 16;
    const steps = duration / stepTime;
    const increment = prediction / steps;
    const timer = setInterval(() => {
      start += increment;
      if (start >= prediction) {
        setDisplayNum(prediction);
        clearInterval(timer);
      } else {
        setDisplayNum(Math.round(start));
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [prediction]);

  const increase = previousPrediction ? ((prediction - previousPrediction) / previousPrediction) * 100 : null;

  return (
    <Card className="animate-fade-in border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
      <CardHeader className="pb-2 relative">
        <CardTitle className="flex items-center gap-2 text-base font-medium text-muted-foreground">
          <Activity className="h-4 w-4" />
          Predicted Cases — Day {day}
        </CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <p className="text-4xl font-bold tracking-tight text-foreground">{formatNumber(displayNum)}</p>
        {increase !== null && (
          <div className="flex items-center gap-1 mt-2 text-sm">
            <TrendingUp className="h-4 w-4 text-amber-500" />
            <span className="text-amber-500 font-medium">{increase > 0 ? "+" : ""}{increase.toFixed(1)}%</span>
            <span className="text-muted-foreground">vs previous</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
