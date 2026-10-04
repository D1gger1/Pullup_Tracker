import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { ProgressPoint } from '../../types/pullup';

type ProgressChartProps = {
  points: ProgressPoint[];
};

function formatDate(dateString: string) {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
  });
}

export function ProgressChart({ points }: ProgressChartProps) {
  return (
    <div className="h-64 w-full md:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points} margin={{ top: 20, right: 12, bottom: 0, left: 12 }}>
          <defs>
            <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#bef264" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#bef264" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid vertical={false} stroke="#27272a" strokeOpacity={0.8} />

          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            axisLine={false}
            tickLine={false}
            minTickGap={24}
            padding={{ left: 8, right: 8 }}
            tick={{ fill: '#71717a', fontSize: 12 }}
          />

          <YAxis hide allowDecimals={false} domain={[0, 'auto']} />

          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#71717a', fontSize: 12 }}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#71717a', fontSize: 12 }}
            allowDecimals={false}
          />

          <Tooltip
            cursor={{
              stroke: '#3f3f46',
              strokeDasharray: '4 4',
            }}
            labelFormatter={(date) => formatDate(String(date))}
            contentStyle={{
              border: '1px solid #3f3f46',
              borderRadius: '12px',
              backgroundColor: '#18181b',
              color: '#f4f4f5',
            }}
          />

          <Area
            type="monotone"
            dataKey="totalReps"
            name="Повторения"
            stroke="#bef264"
            strokeWidth={3}
            fill="url(#progressGradient)"
            dot={{
              r: 5,
              fill: '#18181b',
              stroke: '#bef264',
              strokeWidth: 2,
            }}
            activeDot={{
              r: 7,
              fill: '#bef264',
              stroke: '#18181b',
              strokeWidth: 2,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
