"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
} from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { mockChartData } from "@/lib/mockStats"

export function StatisticsChart() {
  return (
<Card className="p-6 w-full">
  <CardContent className="pt-6">
  <ResponsiveContainer width="100%" height={420}>
  <LineChart
    data={mockChartData}
    margin={{ top: 20, right: 60, left: 60, bottom: 20 }} 
  >
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="year" />
    <YAxis>
      <Label
        angle={-90}
        position="insideLeft"
        offset={-15} 
        style={{ textAnchor: "middle" }}
      >
        Empleados
      </Label>
    </YAxis>
    <Tooltip formatter={(value) => `${value.toLocaleString()} empleados`} />
    <Line
      type="monotone"
      dataKey="value"
      stroke="#2563eb"
      strokeWidth={3}
      dot={{ r: 6 }}
      activeDot={{ r: 8 }}
    />
  </LineChart>
</ResponsiveContainer>

  </CardContent>
</Card>

  )
}
