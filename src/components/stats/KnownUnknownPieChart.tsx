"use client";
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from 'next-themes'; // if using next-themes, otherwise get from CSS vars

interface KnownUnknownPieChartProps {
  knownCount: number;
  unknownCount: number;
  newCount: number;
}

const COLORS = {
  known: 'hsl(var(--chart-2))', // Greenish - Accent in our theme
  unknown: 'hsl(var(--destructive))', // Reddish
  new: 'hsl(var(--chart-3))', // Neutral/Blueish
};

export function KnownUnknownPieChart({ knownCount, unknownCount, newCount }: KnownUnknownPieChartProps) {
  // Fix hydration issues by ensuring consistent rendering between server and client
  // Use a client-side only component for the chart - declare hooks at the top
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const data = [
    { name: 'Known', value: knownCount, fill: COLORS.known },
    { name: 'Unknown', value: unknownCount, fill: COLORS.unknown },
    { name: 'New', value: newCount, fill: COLORS.new },
  ].filter(entry => entry.value > 0); // Filter out zero values to avoid display issues

  if (data.length === 0) {
    return (
      <Card className="glassmorphism-intense relative overflow-hidden">
        <div className="absolute -inset-1 bg-gradient-primary opacity-10 blur-xl -z-10"></div>
        <CardHeader>
          <CardTitle className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2 text-primary">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              <path d="M2 12h20" />
            </svg>
            Card Status Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">No card data available to display chart.</p>
        </CardContent>
      </Card>
    );
  }

  // Recharts expects explicit fill on Cell for Pie, not on data object directly for <Pie>
  const pieCells = data.map((entry, index) => (
    <Cell key={`cell-${index}`} fill={entry.fill} />
  ));

  // Format the percentage on the client side only
  const getLabel = ({ name, percent }: { name: string, percent: number }) => {
    if (!isMounted) return '';
    return `${name} ${Math.round(percent * 100)}%`;
  };

  return (
    <Card className="glassmorphism-intense relative overflow-hidden">
      {/* Add decorative background elements */}
      <div className="absolute -inset-1 bg-gradient-primary opacity-10 blur-xl -z-10"></div>

      <CardHeader>
        <CardTitle className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2 text-primary">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            <path d="M2 12h20" />
          </svg>
          Card Status Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        {isMounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8" // Default fill, overridden by Cell
                dataKey="value"
                label={getLabel}
                animationBegin={0}
                animationDuration={1000}
                animationEasing="ease-out"
              >
                {pieCells}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  borderColor: 'hsl(var(--border))',
                  color: 'hsl(var(--popover-foreground))',
                  borderRadius: '0.5rem',
                  padding: '0.5rem',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value: number) => [`${value} cards`, 'Count']}
              />
              <Legend
                formatter={(value: string) => <span className="text-sm font-medium">{value}</span>}
                iconSize={10}
                iconType="circle"
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-muted-foreground">Loading chart...</p>
          </div>
        )}

        {/* Add a summary below the chart */}
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="p-2 rounded-lg bg-muted/20">
            <div className="text-sm font-medium" style={{ color: COLORS.known }}>Known</div>
            <div className="text-lg font-bold">{knownCount}</div>
          </div>
          <div className="p-2 rounded-lg bg-muted/20">
            <div className="text-sm font-medium" style={{ color: COLORS.unknown }}>Unknown</div>
            <div className="text-lg font-bold">{unknownCount}</div>
          </div>
          <div className="p-2 rounded-lg bg-muted/20">
            <div className="text-sm font-medium" style={{ color: COLORS.new }}>New</div>
            <div className="text-lg font-bold">{newCount}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
