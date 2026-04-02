import { useState, useCallback } from "react";
import { PredictionDataPoint, generateHistoricalData } from "@/lib/prediction-utils";

const API_BASE = "https://penecontemporaneous-blithesomely-joya.ngrok-free.dev";

interface PredictionState {
  prediction: number | null;
  day: number | null;
  region: string | null;
  chartData: PredictionDataPoint[];
  isLoading: boolean;
  error: string | null;
  history: PredictionDataPoint[];
}

export function usePrediction() {
  const [state, setState] = useState<PredictionState>({
    prediction: null,
    day: null,
    region: null,
    chartData: [],
    isLoading: false,
    error: null,
    history: [],
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
      
      setState((s) => ({
        ...s,
        prediction,
        day,
        region,
        chartData,
        isLoading: false,
        history: [...s.history.filter((h) => h.day !== day), { day, cases: prediction }].sort((a, b) => a.day - b.day),
      }));
    } catch (err: any) {
      const message = err.name === "AbortError" ? "Request timed out." : err.message || "Failed to fetch prediction.";
      setState((s) => ({ ...s, isLoading: false, error: message }));
    }
  }, []);

  return { ...state, predict };
}
