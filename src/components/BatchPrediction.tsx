import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Layers, Loader2 } from "lucide-react";
import { PredictionDataPoint } from "@/lib/prediction-utils";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface BatchPredictionProps {
  onBatchPredict: (start: number, end: number, step: number, region: string) => Promise<void>;
  batchData: PredictionDataPoint[];
  isBatchLoading: boolean;
  region: string;
}

export function BatchPrediction({ onBatchPredict, batchData, isBatchLoading, region }: BatchPredictionProps) {
  const [startDay, setStartDay] = useState("10");
  const [endDay, setEndDay] = useState("200");
  const [step, setStep] = useState("20");

  const handleBatch = () => {
    const s = parseInt(startDay);
    const e = parseInt(endDay);
    const st = parseInt(step);
    if (isNaN(s) || isNaN(e) || isNaN(st) || s < 1 || e > 1000 || s >= e || st < 1) return;
    onBatchPredict(s, e, st, region);
  };

  return (
    <Card className="animate-fade-in border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Layers className="h-5 w-5 text-primary" />
          Multi-Day Batch Prediction
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="text-xs text-muted-foreground mb-1 block">Start Day</label>
            <Input type="number" value={startDay} onChange={(e) => setStartDay(e.target.value)} min={1} max={999} className="bg-background/50" />
          </div>
          <div className="flex-1">
            <label className="text-xs text-muted-foreground mb-1 block">End Day</label>
            <Input type="number" value={endDay} onChange={(e) => setEndDay(e.target.value)} min={2} max={1000} className="bg-background/50" />
          </div>
          <div className="flex-1">
            <label className="text-xs text-muted-foreground mb-1 block">Step</label>
            <Input type="number" value={step} onChange={(e) => setStep(e.target.value)} min={1} max={100} className="bg-background/50" />
          </div>
          <div className="flex items-end">
            <Button onClick={handleBatch} disabled={isBatchLoading} className="min-w-[120px]">
              {isBatchLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Running…</> : "Run Batch"}
            </Button>
          </div>
        </div>

        {batchData.length > 0 && (
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={batchData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="batchGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} />
                <Tooltip
                  contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "13px" }}
                  labelFormatter={(v) => `Day ${v}`}
                  formatter={(v: number) => [v.toLocaleString(), "Cases"]}
                />
                <Area type="monotone" dataKey="cases" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#batchGradient)" dot={{ r: 2, fill: "hsl(var(--primary))" }} animationDuration={800} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
