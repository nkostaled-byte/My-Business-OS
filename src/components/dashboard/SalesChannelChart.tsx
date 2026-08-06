import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Order } from '../../types';

interface SalesChannelChartProps {
  orders: Order[];
}

export const SalesChannelChart: React.FC<SalesChannelChartProps> = ({ orders }) => {
  const posRevenue = orders.filter((o) => o.isPos && o.status !== 'cancelled' && o.status !== 'refunded')
    .reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
  const onlineRevenue = orders.filter((o) => !o.isPos && o.status !== 'cancelled' && o.status !== 'refunded')
    .reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

  const data = [
    { name: 'POS / In-store', value: posRevenue, color: '#4F46E5' },
    { name: 'Online Orders', value: onlineRevenue, color: '#22D3EE' },
  ];

  const total = posRevenue + onlineRevenue;

  return (
    <div className="p-6 rounded-xl glass-panel flex flex-col justify-between h-full">
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Sales Channels</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Revenue share by point of sale
        </p>
      </div>

      {total === 0 ? (
        <div className="text-center py-8 text-xs text-slate-400">No sales recorded yet</div>
      ) : (
        <div className="flex flex-col items-center gap-4 my-auto py-4">
          <div className="relative w-36 h-36">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={42}
                  outerRadius={58}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const item = payload[0].payload as (typeof data)[number];
                    return (
                      <div className="bg-slate-900 text-white dark:bg-[#12161c] p-3 rounded-lg shadow-popover text-xs space-y-1">
                        <p className="font-bold border-b border-slate-700 dark:border-white/10 pb-1">{item.name}</p>
                        <p className="text-indigo-300 font-semibold">R{item.value.toLocaleString()}</p>
                        <p className="text-slate-300">{total ? Math.round((item.value / total) * 100) : 0}%</p>
                      </div>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-lg font-extrabold text-slate-900 dark:text-slate-100 leading-none">
                R{total.toLocaleString()}
              </span>
              <span className="text-[10px] font-medium text-slate-400 mt-0.5">Total</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full">
            {data.map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <div>
                  <p className="font-medium text-slate-700 dark:text-slate-300">{item.name}</p>
                  <p className="text-slate-400">{total ? Math.round((item.value / total) * 100) : 0}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
