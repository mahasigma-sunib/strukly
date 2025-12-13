import React from "react";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Configuration for a single bar
export interface BarConfig {
  key: string; // data key
  color: string;
  label?: string; // legend label (e.g., "Expense")
}

interface CustomBarChartProps {
  data: any[]; // Array of data objects
  xAxisKey: string; // Key for the X-axis labels (e.g., "name", "month")
  bars: BarConfig[]; // Array of bars to render
  height?: number; // Chart height (default: 300)
  className?: string;
}

const CustomBarChart: React.FC<CustomBarChartProps> = ({
  data,
  xAxisKey,
  bars,
  height = 300,
  className = "",
}) => {
  return (
    <div
      className={`w-full min-w-0 ${className}`}
      style={{ height: `${height}px`, width: "100%", position: "relative" }}
    >
      <ResponsiveContainer width="99%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 0,
          }}
        >
          {/* Grid lines: Horizontal only, subtle gray */}
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="var(--fun-color-inactive)"
          />

          {/* X Axis: Clean, no axis line */}
          <XAxis
            dataKey={xAxisKey}
            axisLine={false}
            tickLine={false}
            tick={{
              fill: "var(--fun-color-text-secondary)",
              fontSize: 12,
              fontWeight: 500,
            }}
            dy={10}
          />

          {/* Y Axis: Clean, no axis line */}
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--fun-color-text-secondary)", fontSize: 12 }}
            tickFormatter={(value) =>
              // Optional: Shorten large numbers (1000 -> 1k)
              value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value
            }
          />

          {/* Tooltip: Modern, rounded shadow box */}
          <Tooltip
            cursor={{ fill: "transparent" }}
            contentStyle={{
              borderRadius: "12px",
              border: "none",
              boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
              padding: "12px",
            }}
          />

          <Legend wrapperStyle={{ paddingTop: "20px" }} />

          {/* Dynamic Bars */}
          {bars.map((bar) => (
            <Bar
              key={bar.key}
              dataKey={bar.key}
              name={bar.label || bar.key}
              fill={bar.color}
              radius={[6, 6, 0, 0]}
              maxBarSize={35}
              // Hover Effect
              activeBar={
                <Rectangle
                  fill={bar.color}
                  stroke={bar.color}
                  strokeOpacity={0.1}
                />
              }
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomBarChart;
