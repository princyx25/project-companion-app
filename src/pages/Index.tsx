import { useState } from "react";
import { Activity, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PredictionCard } from "@/components/PredictionCard";
import { PredictionChart } from "@/components/PredictionChart";
import { RiskIndicator } from "@/components/RiskIndicator";
import { AIInsight } from "@/components/AIInsight";
import { usePrediction } from "@/hooks/usePrediction";
import { toast } from "sonner";

const Index = () => {
  const [dayInput, setDayInput] = useState("");
  const { prediction, day, chartData, isLoading, error, history, predict } = usePrediction();
  const [prevPrediction, setPrevPrediction] = useState<number | undefined>();

  const handlePredict = async () => {
    const num = parseInt(dayInput);
    if (isNaN(num) || num < 1 || num > 1000) {
      toast.error("Please enter a valid number of days (1–1000).");
      return;
    }
    if (prediction !== null) setPrevPrediction(prediction);
    await predict(num);
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Activity className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Epidemic Spread Predictor</h1>
              <p className="text-xs text-muted-foreground">AI-Powered Outbreak Analysis</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Input Section */}
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm animate-fade-in">
          <CardContent className="flex flex-col sm:flex-row items-end gap-4 p-6">
            <div className="flex-1 w-full">
              <label htmlFor="days" className="text-sm font-medium text-muted-foreground mb-2 block">
                Enter number of days
              </label>
              <Input
                id="days"
                type="number"
                min={1}
                max={1000}
                placeholder="e.g. 200"
                value={dayInput}
                onChange={(e) => setDayInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handlePredict()}
                className="bg-background/50"
              />
            </div>
            <Button onClick={handlePredict} disabled={isLoading} className="w-full sm:w-auto min-w-[140px]">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Predicting…
                </>
              ) : (
                "Predict"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 text-destructive text-sm animate-fade-in">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        {/* Results */}
        {prediction !== null && day !== null && (
          <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <PredictionCard prediction={prediction} day={day} previousPrediction={prevPrediction} />
              <RiskIndicator prediction={prediction} />
              <AIInsight prediction={prediction} day={day} />
            </div>
            <PredictionChart data={chartData} />
          </div>
        )}

        {/* Empty State */}
        {prediction === null && !isLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
            <div className="rounded-full bg-muted p-6 mb-4">
              <Activity className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">No prediction yet</h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-md">
              Enter the number of days and hit Predict to see AI-powered epidemic spread analysis.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
