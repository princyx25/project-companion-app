import { useState, useCallback } from "react";
import { PredictionDataPoint, generateHistoricalData } from "@/lib/prediction-utils";

const API_BASE = "https://new-epidemic-ai-1.onrender.com";

export interface PredictionResult {
  country: string;
  current_cases: number;
  prediction: number;
  increase: number;
  growth_percent: number;
  risk: string;
}

export interface HistoryEntry {
  id: string;
  day: number;
  region: string;
  result: PredictionResult;
  timestamp: Date;
}

interface PredictionState {
  result: PredictionResult | null;
  day: number | null;
  region: string | null;
  chartData: PredictionDataPoint[];
  isLoading: boolean;
  isBatchLoading: boolean;
  error: string | null;
  history: HistoryEntry[];
  batchData: PredictionDataPoint[];
}

export function usePrediction() {
  const [state, setState] = useState<PredictionState>({
    result: null,
    day: null,
    region: null,
    chartData: [],
    isLoading: false,
    isBatchLoading: false,
    error: null,
    history: [],
    batchData: [],
  });

  const predict = useCallback(async (day: number, region: string) => {
    if (!Number.isInteger(day) || day < 1 || day > 1000) {
      setState((s) => ({ ...s, error: "Please enter a valid day (1–1000)." }));
      return;
    }

    setState((s) => ({ ...s, isLoading: true, error: null }));

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 60000);

      const res = await fetch(`${API_BASE}/predict?day=${day}&region=${encodeURIComponent(region)}`, {
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const data = await res.json();
      const result: PredictionResult = {
        country: data.country,
        current_cases: data.current_cases,
        prediction: data.prediction,
        increase: data.increase,
        growth_percent: data.growth_percent,
        risk: data.risk,
      };

      const historical = generateHistoricalData(day, result.prediction);
      const chartData = [...historical, { day, cases: result.prediction }];

      const entry: HistoryEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        day,
        region,
        result,
        timestamp: new Date(),
      };

      setState((s) => ({
        ...s,
        result,
        day,
        region,
        chartData,
        isLoading: false,
        history: [entry, ...s.history].slice(0, 50),
      }));
    } catch (err: any) {
      const message = err.name === "AbortError" ? "Request timed out." : err.message || "Failed to fetch prediction.";
      setState((s) => ({ ...s, isLoading: false, error: message }));
    }
  }, []);

  const batchPredict = useCallback(async (startDay: number, endDay: number, step: number, region: string) => {
    setState((s) => ({ ...s, isBatchLoading: true, error: null, batchData: [] }));

    const results: PredictionDataPoint[] = [];
    try {
      for (let d = startDay; d <= endDay; d += step) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 60000);
        const res = await fetch(`${API_BASE}/predict?day=${d}&region=${encodeURIComponent(region)}`, {
          signal: controller.signal,
        });
        clearTimeout(timeout);
        if (!res.ok) throw new Error(`API error at day ${d}: ${res.status}`);
        const data = await res.json();
        results.push({ day: d, cases: data.prediction });
      }
      setState((s) => ({ ...s, isBatchLoading: false, batchData: results }));
    } catch (err: any) {
      const message = err.name === "AbortError" ? "Batch request timed out." : err.message || "Batch prediction failed.";
      setState((s) => ({ ...s, isBatchLoading: false, error: message, batchData: results }));
    }
  }, []);

  const clearHistory = useCallback(() => {
    setState((s) => ({ ...s, history: [] }));
  }, []);

  return { ...state, predict, batchPredict, clearHistory };
}
