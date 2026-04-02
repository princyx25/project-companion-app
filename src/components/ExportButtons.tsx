import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { HistoryEntry } from "@/hooks/usePrediction";
import { PredictionDataPoint, classifyRisk, getRiskLabel, formatNumber } from "@/lib/prediction-utils";
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
    const header = "Timestamp,Region,Day,Predicted Cases,Risk Level\n";
    const rows = history.map((e) =>
      `${e.timestamp.toISOString()},${getRegionLabel(e.region)},${e.day},${Math.round(e.prediction)},${getRiskLabel(classifyRisk(e.prediction))}`
    ).join("\n");
    downloadCSV(`prediction-history-${Date.now()}.csv`, header + rows);
  };

  const exportBatch = () => {
    if (batchData.length === 0) {
      toast.error("No batch data to export.");
      return;
    }
    const header = "Day,Predicted Cases,Risk Level\n";
    const rows = batchData.map((d) =>
      `${d.day},${Math.round(d.cases)},${getRiskLabel(classifyRisk(d.cases))}`
    ).join("\n");
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
        const risk = classifyRisk(e.prediction);
        report += `[${e.timestamp.toLocaleTimeString()}] ${getRegionLabel(e.region)} | Day ${e.day} | ${formatNumber(e.prediction)} cases | ${getRiskLabel(risk)}\n`;
      });
      report += "\n";
    }

    if (batchData.length > 0) {
      report += "BATCH PREDICTION DATA\n";
      report += "-".repeat(30) + "\n";
      batchData.forEach((d) => {
        report += `Day ${d.day}: ${formatNumber(d.cases)} cases (${getRiskLabel(classifyRisk(d.cases))})\n`;
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
