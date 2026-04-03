import { useState } from "react";
import { Activity, Loader2, AlertCircle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PredictionCard } from "@/components/PredictionCard";
import { PredictionChart } from "@/components/PredictionChart";
import { RiskIndicator } from "@/components/RiskIndicator";
import { AIInsight } from "@/components/AIInsight";
import { PredictionHistory } from "@/components/PredictionHistory";
import { BatchPrediction } from "@/components/BatchPrediction";
import { WorldMap } from "@/components/WorldMap";
import { ExportButtons } from "@/components/ExportButtons";
import { usePrediction, PredictionResult } from "@/hooks/usePrediction";
import { toast } from "sonner";

const REGIONS = [
  { value: "India", label: "🇮🇳 India" },
  { value: "United States", label: "🇺🇸 United States" },
  { value: "Brazil", label: "🇧🇷 Brazil" },
  { value: "Germany", label: "🇩🇪 Germany" },
  { value: "France", label: "🇫🇷 France" },
  { value: "Italy", label: "🇮🇹 Italy" },
  { value: "Russia", label: "🇷🇺 Russia" },
  { value: "China", label: "🇨🇳 China" },
  { value: "Japan", label: "🇯🇵 Japan" },
  { value: "Australia", label: "🇦🇺 Australia" },
  { value: "Canada", label: "🇨🇦 Canada" },
  { value: "Mexico", label: "🇲🇽 Mexico" },
  { value: "Spain", label: "🇪🇸 Spain" },
  { value: "South Africa", label: "🇿🇦 South Africa" },
];

const Index = () => {
  const [dayInput, setDayInput] = useState("");
  const [region, setRegion] = useState("India");
  const {
    result, day, region: activeRegion, chartData,
    isLoading, isBatchLoading, error,
    history, batchData,
    predict, batchPredict, clearHistory,
  } = usePrediction();

  const selectedRegionLabel = REGIONS.find((r) => r.value === (activeRegion || region))?.label || "Global";

  // Build map data from history (latest prediction result per region)
  const mapPredictions: Record<string, PredictionResult> = {};
  history.forEach((entry) => {
    if (!mapPredictions[entry.region]) {
      mapPredictions[entry.region] = entry.result;
    }
  });

  const handlePredict = async () => {
    const num = parseInt(dayInput);
    if (isNaN(num) || num < 1 || num > 1000) {
      toast.error("Please enter a valid number of days (1–1000).");
      return;
    }
    await predict(num, region);
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
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
          <div className="flex items-center gap-3">
            <ExportButtons history={history} batchData={batchData} regions={REGIONS} />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Input Section */}
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm animate-fade-in">
          <CardContent className="flex flex-col sm:flex-row items-end gap-4 p-6">
            <div className="w-full sm:w-48">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Region</label>
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {REGIONS.map((r) => (
                    <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 w-full">
              <label htmlFor="days" className="text-sm font-medium text-muted-foreground mb-2 block">Number of days</label>
              <Input
                id="days" type="number" min={1} max={1000}
                placeholder="e.g. 200" value={dayInput}
                onChange={(e) => setDayInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handlePredict()}
                className="bg-background/50"
              />
            </div>
            <Button onClick={handlePredict} disabled={isLoading} className="w-full sm:w-auto min-w-[140px]">
              {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Predicting…</> : "Predict"}
            </Button>
          </CardContent>
        </Card>

        {error && (
          <div className="flex items-center gap-2 text-destructive text-sm animate-fade-in">
            <AlertCircle className="h-4 w-4" />{error}
          </div>
        )}

        {/* Results */}
        {result !== null && day !== null && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Showing predictions for <span className="font-semibold text-foreground">{selectedRegionLabel}</span></span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <PredictionCard result={result} day={day} />
              </div>
              <div className="space-y-6">
                <RiskIndicator risk={result.risk} prediction={result.prediction} />
                <AIInsight risk={result.risk} prediction={result.prediction} day={day} />
              </div>
            </div>
            <PredictionChart data={chartData} />
          </div>
        )}

        {/* Empty State */}
        {result === null && !isLoading && (
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

        {/* Advanced Features Tabs */}
        <Tabs defaultValue="batch" className="animate-fade-in">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="batch">Batch Prediction</TabsTrigger>
            <TabsTrigger value="map">World Map</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          <TabsContent value="batch" className="mt-4">
            <BatchPrediction
              onBatchPredict={batchPredict}
              batchData={batchData}
              isBatchLoading={isBatchLoading}
              region={region}
            />
          </TabsContent>
          <TabsContent value="map" className="mt-4">
            <WorldMap predictions={mapPredictions} />
          </TabsContent>
          <TabsContent value="history" className="mt-4">
            <PredictionHistory history={history} onClear={clearHistory} regions={REGIONS} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
