import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { HistoryEntry } from "@/hooks/usePrediction";
import { PredictionDataPoint, formatNumber, getRiskLabel, type RiskLevel } from "@/lib/prediction-utils";
import { toast } from "sonner";

interface ExportButtonsProps {
  history: HistoryEntry[];
  batchData: PredictionDataPoint[];
  regions: { value: string; label: string }[];
}

function downloadCSV(filename: string, csvContent: string) {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
  toast.success(`Downloaded ${filename}`);
}

export function ExportButtons({ history, batchData, regions }: ExportButtonsProps) {
  const getRegionLabel = (val: string) => regions.find((r) => r.value === val)?.label?.replace(/[^\w\s]/g, "").trim() || val;

  const exportHistory = () => {
    if (history.length === 0) {
      toast.error("No history to export.");
      return;
    }
    const header = "Timestamp,Region,Day,Current Cases,Predicted Cases,Increase,Growth %,Risk Level\n";
    const rows = history.map((e) =>
      `${e.timestamp.toISOString()},${getRegionLabel(e.region)},${e.day},${Math.round(e.result.current_cases)},${Math.round(e.result.prediction)},${Math.round(e.result.increase)},${e.result.growth_percent.toFixed(1)},${e.result.risk}`
    ).join("\n");
    downloadCSV(`prediction-history-${Date.now()}.csv`, header + rows);
  };

  const exportBatch = () => {
    if (batchData.length === 0) {
      toast.error("No batch data to export.");
      return;
    }
    const header = "Day,Predicted Cases\n";
    const rows = batchData.map((d) => `${d.day},${Math.round(d.cases)}`).join("\n");
    downloadCSV(`batch-prediction-${Date.now()}.csv`, header + rows);
  };

  const exportReport = () => {
    if (history.length === 0 && batchData.length === 0) {
      toast.error("No data to generate report.");
      return;
    }

    let report = "EPIDEMIC SPREAD PREDICTION REPORT\n";
    report += `Generated: ${new Date().toLocaleString()}\n`;
    report += "=".repeat(50) + "\n\n";

    if (history.length > 0) {
      report += "PREDICTION HISTORY\n";
      report += "-".repeat(30) + "\n";
      history.forEach((e) => {
        report += `[${e.timestamp.toLocaleTimeString()}] ${getRegionLabel(e.region)} | Day ${e.day} | Current: ${formatNumber(e.result.current_cases)} | Predicted: ${formatNumber(e.result.prediction)} | +${formatNumber(e.result.increase)} (${e.result.growth_percent.toFixed(1)}%) | ${e.result.risk}\n`;
      });
      report += "\n";
    }

    if (batchData.length > 0) {
      report += "BATCH PREDICTION DATA\n";
      report += "-".repeat(30) + "\n";
      batchData.forEach((d) => {
        report += `Day ${d.day}: ${formatNumber(d.cases)} cases\n`;
      });
    }

    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `epidemic-report-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Report downloaded.");
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" onClick={exportHistory} disabled={history.length === 0}>
        <Download className="h-4 w-4 mr-1" /> Export History (CSV)
      </Button>
      <Button variant="outline" size="sm" onClick={exportBatch} disabled={batchData.length === 0}>
        <Download className="h-4 w-4 mr-1" /> Export Batch (CSV)
      </Button>
      <Button variant="outline" size="sm" onClick={exportReport} disabled={history.length === 0 && batchData.length === 0}>
        <FileText className="h-4 w-4 mr-1" /> Full Report
      </Button>
    </div>
  );
}
