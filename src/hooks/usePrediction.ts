import { useState, useCallback } from "react";
import { PredictionDataPoint, generateHistoricalData } from "@/lib/prediction-utils";

const API_BASE = "https://penecontemporaneous-blithesomely-joya.ngrok-free.dev";

export interface HistoryEntry {
  id: string;
  day: number;
  region: string;
  prediction: number;
  timestamp: Date;
}

interface PredictionState {
  prediction: number | null;
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
    prediction: null,
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
      const timeout = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(`${API_BASE}/predict?day=${day}&region=${encodeURIComponent(region)}`, {
        signal: controller.signal,
        headers: { "ngrok-skip-browser-warning": "true" },
      });
      clearTimeout(timeout);

      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const data = await res.json();
      const prediction = data.prediction as number;
      const historical = generateHistoricalData(day, prediction);
      const chartData = [...historical, { day, cases: prediction }];

      const entry: HistoryEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        day,
        region,
        prediction,
        timestamp: new Date(),
      };

      setState((s) => ({
        ...s,
        prediction,
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
        const timeout = setTimeout(() => controller.abort(), 10000);
        const res = await fetch(`${API_BASE}/predict?day=${d}&region=${encodeURIComponent(region)}`, {
          signal: controller.signal,
          headers: { "ngrok-skip-browser-warning": "true" },
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
