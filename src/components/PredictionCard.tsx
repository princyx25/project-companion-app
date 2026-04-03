import { useEffect, useState } from "react";
import { TrendingUp, Activity, Users, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/lib/prediction-utils";
import { PredictionResult } from "@/hooks/usePrediction";

interface PredictionCardProps {
  result: PredictionResult;
  day: number;
}

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const stepTime = 16;
    const steps = duration / stepTime;
    const increment = value / steps;
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(Math.round(start));
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [value]);
  return <>{formatNumber(display)}</>;
}

export function PredictionCard({ result, day }: PredictionCardProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Current Cases */}
      <Card className="animate-fade-in border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent pointer-events-none" />
        <CardHeader className="pb-2 relative">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Users className="h-4 w-4" />
            Current Cases
          </CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <p className="text-3xl font-bold tracking-tight text-foreground">
            <AnimatedNumber value={result.current_cases} />
          </p>
          <p className="text-xs text-muted-foreground mt-1">{result.country}</p>
        </CardContent>
      </Card>

      {/* Predicted Cases */}
      <Card className="animate-fade-in border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
        <CardHeader className="pb-2 relative">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Activity className="h-4 w-4" />
            Predicted — Day {day}
          </CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <p className="text-3xl font-bold tracking-tight text-foreground">
            <AnimatedNumber value={result.prediction} />
          </p>
        </CardContent>
      </Card>

      {/* Increase */}
      <Card className="animate-fade-in border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 to-transparent pointer-events-none" />
        <CardHeader className="pb-2 relative">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            Increase
          </CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <p className="text-3xl font-bold tracking-tight text-foreground">
            +<AnimatedNumber value={result.increase} />
          </p>
        </CardContent>
      </Card>

      {/* Growth Percent */}
      <Card className="animate-fade-in border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent pointer-events-none" />
        <CardHeader className="pb-2 relative">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <BarChart3 className="h-4 w-4" />
            Growth
          </CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <p className="text-3xl font-bold tracking-tight text-foreground">
            {result.growth_percent.toFixed(1)}%
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
