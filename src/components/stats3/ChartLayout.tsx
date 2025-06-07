import { StatisticsChart } from "@/components/stats3/StatisticsChart"
import { SourcesPanel } from "@/components/stats3/SourcesPanel"
import { ChartControls } from "@/components/stats3/ChartControls"

export function ChartLayout() {
  return (
    <div className="relative flex flex-col xl:flex-row gap-6 mt-6">
      <div className="relative flex-1">
        <ChartControls />
        <StatisticsChart />
        <div className="text-sm text-blue-600 mt-2 ml-1">ℹ️ Información adicional</div>
        <div className="text-sm text-right text-gray-500 mt-2">© Statista 2025 · <a href="#" className="underline">Ver fuente</a></div>
      </div>
      <div className="shrink-0 self-center">
      <SourcesPanel />
      </div>

    </div>
  )
}
